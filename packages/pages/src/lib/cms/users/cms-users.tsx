import React, { useMemo, useState } from 'react';
import { Box, Button, Checkbox, Loader, Pagination, Text } from '@inithium/ui';
import { useReadAllUsersQuery } from '@inithium/store';
import { User } from '@inithium/types';
import { UserItem } from './user-item';
import { Input } from '@inithium/ui';

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
  const { data, isLoading, error } = useReadAllUsersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const users: readonly User[] = useMemo(() => data ?? [], [data]);

  // Filter before paginating so totalItems and pages reflect the search
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
    setCurrentPage(1); // reset to first page on new search
  };

  const handleToggle = (id: string): void => setSelectedIds(toggleSelection(id));
  const handleToggleAll = (): void => setSelectedIds(toggleAll(pageIds));
  const handleEdit = (user: User): void => console.info('Edit triggered:', user._id);
  const handleDelete = (user: User): void => console.info('Delete triggered:', user._id);
  const handleBulkDelete = (): void => {
    console.info('Bulk delete triggered:', Array.from(selectedIds));
    setSelectedIds(new Set());
  };

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
        <Box flex direction="col" className="h-full gap-4">

          {/* Search bar */}
          <Input
            label="Search by name or email"
            leadingIcon="search"
            variant="outline"
            color="primary"
            size="md"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* Select-all / bulk actions */}
          <Box flex align="center" justify="between" className="bg-surface1 padding-sm rounded-md my-2">
            <Box flex align="center" className="gap-2">
              <Checkbox
                checked={isAllSelected}
                onChange={handleToggleAll}
                color="primary"
                size="md"
              />
              <Text variant="body2" overrideClassName="font-medium text-sm">
                Select All on Page
              </Text>
            </Box>
            {selectedIds.size > 0 && (
              <Button
                variant="ghost"
                color="danger"
                size="sm"
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedIds.size})
              </Button>
            )}
          </Box>

          {/* User list */}
          <Box flex direction="col" className="flex-1 gap-2">
            {pagedUsers.length > 0 ? (
              pagedUsers.map((user: User) => (
                <UserItem
                  key={user._id}
                  user={user}
                  isSelected={selectedIds.has(user._id)}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
    </Box>
  );
};

export default CmsUsersPage;