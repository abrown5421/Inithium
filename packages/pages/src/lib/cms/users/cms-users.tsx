import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Checkbox, Loader, Pagination, Text, Dialog } from '@inithium/ui';
import { 
  useReadAllUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation, 
  useDeleteUsersBatchMutation,
  selectActiveUser
} from '@inithium/store';
import { User } from '@inithium/types';
import { UserItem } from './user-item';
import { Input } from '@inithium/ui';
import { UserForm } from './user-form';

const PAGE_SIZE = 5;

const paginate = (size: number) => (page: number) => (items: readonly User[]): readonly User[] =>
  items.slice((page - 1) * size, page * size);

const toggleSelection = (id: string) => (selected: ReadonlySet<string>): ReadonlySet<string> => {
  const next = new Set(selected);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
};

const toggleAll = (pageIds: readonly string[]) => (selected: ReadonlySet<string>): ReadonlySet<string> => {
  const hasAll = pageIds.every(id => selected.has(id));
  const next = new Set(selected);
  pageIds.forEach(id => hasAll ? next.delete(id) : next.add(id));
  return next;
};

const filterUsers = (query: string) => (users: readonly User[]): readonly User[] => {
  const q = query.trim().toLowerCase();
  if (!q) return users;
  return users.filter(u =>
    u.first_name?.toLowerCase().includes(q) ||
    u.last_name?.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q)
  );
};

const CmsUsersPage: React.FC = () => {
  const loggedInUser = useSelector(selectActiveUser);
  const loggedInRole = loggedInUser?.role ?? 'user';

  const canCreateUsers = loggedInRole === 'super-admin' || loggedInRole === 'admin';
  const canDeleteUsers = loggedInRole === 'super-admin' || loggedInRole === 'admin' || loggedInRole === 'editor';

  const { data, isLoading, error } = useReadAllUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteUsersBatch] = useDeleteUsersBatchMutation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<User | undefined>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{ targets: readonly string[]; label: string } | null>(null);

  const users: readonly User[] = useMemo(() => data ?? [], [data]);
  const filteredUsers = useMemo(() => filterUsers(searchQuery)(users), [searchQuery, users]);
  const totalItems = filteredUsers.length;

  const pagedUsers = useMemo(() =>
    paginate(PAGE_SIZE)(currentPage)(filteredUsers),
    [currentPage, filteredUsers]
  );

  const pageIds = useMemo(() => pagedUsers.map(u => u._id), [pagedUsers]);

  const isAllSelected = useMemo(() =>
    pageIds.length > 0 && pageIds.every(id => selectedIds.has(id)),
    [pageIds, selectedIds]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleToggle = (id: string): void => setSelectedIds(toggleSelection(id));
  const handleToggleAll = (): void => setSelectedIds(toggleAll(pageIds));
  
  const handleCreateTrigger = (): void => {
    if (!canCreateUsers) return;
    setApiError(null);
    setActiveUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditTrigger = (user: User): void => {
    setApiError(null);
    setActiveUser(user);
    setIsFormOpen(true);
  };

  const handleFormClose = (): void => {
    setIsFormOpen(false);
    setActiveUser(undefined);
    setApiError(null);
  }; 

  const handleFormSubmit = async (payload: any): Promise<void> => {
    setFormSubmitting(true);
    setApiError(null);
    try {
      if (activeUser) {
        await updateUser({ id: activeUser._id, data: payload }).unwrap();
      } else {
        await createUser(payload).unwrap();
      }
      setIsFormOpen(false);
      setActiveUser(undefined);
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.error ?? 'An unexpected validation rejection occurred.';
      setApiError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      console.error('Operation failure caught during storage update:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteTrigger = (user: User): void => {
    if (!canDeleteUsers) return;
    setDeleteContext({
      targets: [user._id],
      label: `Are you sure you want to permanently remove ${user.first_name} ${user.last_name}? This action cannot be undone.`,
    });
  };

  const handleBulkDeleteTrigger = (): void => {
    if (!canDeleteUsers) return;
    const total = selectedIds.size;
    setDeleteContext({
      targets: Array.from(selectedIds),
      label: `Are you sure you want to permanently remove ${total} selected users? All access credentials and associations will be deleted.`,
    });
  };

  const executeDeletion = async (closeDialog: () => void): Promise<void> => {
    if (!deleteContext) return;
    try {
      const { targets } = deleteContext;
      if (targets.length === 1) {
        await deleteUser(targets[0]).unwrap();
        if (selectedIds.has(targets[0])) {
          setSelectedIds(toggleSelection(targets[0]));
        }
      } else {
        await deleteUsersBatch(targets).unwrap();
        setSelectedIds(new Set());
      }
      closeDialog();
    } catch (err) {
      console.error('Destructive pipeline error:', err);
    } finally {
      setDeleteContext(null);
    }
  };

  const dialogActions = useMemo(() => [
    {
      label: 'Cancel',
      variant: 'ghost' as const,
      color: 'secondary' as const,
      onClick: (close: () => void) => {
        close();
        setDeleteContext(null);
      },
    },
    {
      label: 'Delete Permanently',
      variant: 'solid' as const,
      color: 'danger' as const,
      leadingIcon: 'trash-2',
      onClick: (close: () => void) => executeDeletion(close),
    },
  ], [deleteContext]);

  return (
    <Box padding="md" className="h-full w-full">
      {isLoading ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Loader variant="spinner" size="lg" color="primary" />
        </Box>
      ) : error ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Text color="danger">Error loading resources</Text>
        </Box>
      ) : (
        <Box flex direction="col" className="h-full gap-2">
          <Box flex justify="between" align="center" className="w-full gap-2">
            <Box className="flex-1">
              <Input
                label="Search by name or email"
                leadingIcon="search"
                variant="outline"
                color="primary"
                size="sm"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
            {canCreateUsers && (
              <Button variant="solid" color="primary" size="sm" onClick={handleCreateTrigger} leadingIcon="user-plus">
                Add User
              </Button>
            )}
          </Box>

          <Box flex align="center" justify="between" className="bg-surface1 padding-sm rounded-md my-2">
            <Box flex align="center" className="gap-2">
              <Checkbox
                checked={isAllSelected}
                onChange={handleToggleAll}
                color="primary"
                size="sm"
              />
              <Text variant="body2" overrideClassName="font-medium text-sm">
                Select All on Page
              </Text>
            </Box>
            {selectedIds.size > 0 && canDeleteUsers && (
              <Button
                variant="ghost"
                color="danger"
                size="sm"
                onClick={handleBulkDeleteTrigger}
                leadingIcon="trash-2"
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}
          </Box>

          <Box flex direction="col" className="flex-1 gap-2">
            {pagedUsers.length > 0 ? (
              pagedUsers.map((user: User) => (
                <UserItem
                  key={user._id}
                  user={user}
                  isSelected={selectedIds.has(user._id)}
                  onToggle={handleToggle}
                  onEdit={handleEditTrigger}
                  onDelete={handleDeleteTrigger}
                  loggedInRole={loggedInRole}
                />
              ))
            ) : (
              <Box flex justify="center" align="center" className="py-8">
                <Text color="secondary">No users match "{searchQuery}"</Text>
              </Box>
            )}
          </Box>

          <Box flex justify="center" align="center" padding="sm">
            <Pagination
              totalItems={totalItems}
              itemsPerPage={PAGE_SIZE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Box>
        </Box>
      )}

      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        title={activeUser ? `Modify Account: ${activeUser.first_name}` : 'Register New Manager Account'}
        size="sm"
        variant="default"
        backdrop={true}
        transition={true}
        closeOnBackdropClick={!formSubmitting}
        showCloseButton={!formSubmitting}
      >
        <UserForm
          user={activeUser}
          isSubmitting={formSubmitting}
          error={apiError}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          loggedInRole={loggedInRole}
        />
      </Dialog>

      <Dialog
        open={Boolean(deleteContext)}
        onClose={() => setDeleteContext(null)}
        title="Confirm Destructive Action"
        size="sm"
        variant="alert"
        backdrop={true}
        transition={true}
        actions={dialogActions}
        actionsAlign="right"
      >
        <Text variant="body2" overrideClassName="text-slate-600">
          {deleteContext?.label}
        </Text>
      </Dialog>
    </Box>
  );
};

export default CmsUsersPage;