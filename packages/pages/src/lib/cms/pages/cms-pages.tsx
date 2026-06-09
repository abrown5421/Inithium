import React, { useMemo, useState } from 'react';
import { Box, Button, Checkbox, Loader, Pagination, Text, Dialog, Switch } from '@inithium/ui';
import {
  useReadAllPagesQuery,
  useDeletePageMutation,
  useDeletePagesBatchMutation,
} from '@inithium/store';
import { Page } from '@inithium/types';
import { Input } from '@inithium/ui';
import { PageItem } from './page-item';
import { PageFormDialog } from './page-form-dialog';

const PAGE_SIZE = 8;

const filterPages = (query: string, showSystem: boolean) => (pages: readonly Page[]): readonly Page[] => {
  const q = query.trim().toLowerCase();
  const nonCmsPages = pages.filter((p) => !p.componentKey?.startsWith('Cms'));
  const targetedPages = showSystem ? nonCmsPages : nonCmsPages.filter((p) => !p.is_system_page);
  
  if (!q) return targetedPages;
  return targetedPages.filter(
    (p) =>
      p.key?.toLowerCase().includes(q) ||
      p.path?.toLowerCase().includes(q) ||
      p.componentKey?.toLowerCase().includes(q),
  );
};

const toggleSelection = (id: string) => (selected: ReadonlySet<string>): ReadonlySet<string> => {
  const next = new Set(selected);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
};

const toggleAll =
  (pageIds: readonly string[]) =>
  (selected: ReadonlySet<string>): ReadonlySet<string> => {
    const hasAll = pageIds.every((id) => selected.has(id));
    const next = new Set(selected);
    pageIds.forEach((id) => (hasAll ? next.delete(id) : next.add(id)));
    return next;
  };

const CmsPagesPage: React.FC = () => {
  const { data, isLoading, error } = useReadAllPagesQuery();
  const [deletePage] = useDeletePageMutation();
  const [deletePagesBatch] = useDeletePagesBatchMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSystemPages, setShowSystemPages] = useState(true);
  const [editTarget, setEditTarget] = useState<Page | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{
    targets: readonly string[];
    label: string;
  } | null>(null);

  const pages: readonly Page[] = useMemo(() => data ?? [], [data]);
  const filteredPages = useMemo(() => filterPages(searchQuery, showSystemPages)(pages), [searchQuery, showSystemPages, pages]);
  const totalItems = filteredPages.length;

  const pagedPages = useMemo(
    () => filteredPages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, filteredPages],
  );

  const pageIds = useMemo(() => pagedPages.map((p) => p._id), [pagedPages]);

  const isAllSelected = useMemo(
    () => pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id)),
    [pageIds, selectedIds],
  );

  const deletableSelectedIds = useMemo(
    () =>
      Array.from(selectedIds).filter((id) => {
        const page = pages.find((p) => p._id === id);
        return page && !page.is_system_page;
      }),
    [selectedIds, pages],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleSystemPages = (checked: boolean): void => {
    setShowSystemPages(checked);
    setCurrentPage(1);
  };

  const handleToggle = (id: string): void => setSelectedIds(toggleSelection(id));
  const handleToggleAll = (): void => setSelectedIds(toggleAll(pageIds));

  const handleCreateTrigger = (): void => {
    setEditTarget(undefined);
    setIsFormOpen(true);
  };

  const handleEditTrigger = (page: Page): void => {
    setEditTarget(page);
    setIsFormOpen(true);
  };

  const handleFormClose = (): void => {
    setIsFormOpen(false);
    setEditTarget(undefined);
  };

  const handleDeleteTrigger = (page: Page): void => {
    setDeleteContext({
      targets: [page._id],
      label: `Are you sure you want to permanently remove the "${page.key}" page? This action cannot be undone.`,
    });
  };

  const handleBulkDeleteTrigger = (): void => {
    const total = deletableSelectedIds.length;
    setDeleteContext({
      targets: deletableSelectedIds,
      label: `Are you sure you want to permanently remove ${total} selected page${total !== 1 ? 's' : ''}? System pages are excluded from deletion.`,
    });
  };

  const executeDeletion = async (closeDialog: () => void): Promise<void> => {
    if (!deleteContext) return;
    try {
      const { targets } = deleteContext;
      if (targets.length === 1) {
        await deletePage(targets[0]).unwrap();
        if (selectedIds.has(targets[0])) {
          setSelectedIds(toggleSelection(targets[0]));
        }
      } else {
        await deletePagesBatch(targets).unwrap();
        setSelectedIds(new Set());
      }
      closeDialog();
    } catch (err) {
      console.error('Page deletion error:', err);
    } finally {
      setDeleteContext(null);
    }
  };

  const dialogActions = useMemo(
    () => [
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
    ],
    [deleteContext],
  );

  return (
    <Box padding="md" className="h-full w-full">
      {isLoading ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Loader variant="spinner" size="lg" color="primary" />
        </Box>
      ) : error ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Text color="danger">Error loading pages</Text>
        </Box>
      ) : (
        <Box flex direction="col" className="h-full gap-2">
          <Box flex justify="between" align="center" className="w-full gap-2">
            <Box className="flex-1">
              <Input
                label="Search by key, path, or component"
                leadingIcon="search"
                variant="outline"
                color="primary"
                size="sm"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
            <Button
              variant="solid"
              color="primary"
              size="sm"
              onClick={handleCreateTrigger}
              leadingIcon="file-plus"
            >
              Add Page
            </Button>
          </Box>

          <Box
            flex
            align="center"
            justify="between"
            className="bg-surface1 padding-sm rounded-md my-2"
          >
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
            
            <Box flex align="center" className="gap-4">
              <Switch
                label="Show System Pages"
                checked={showSystemPages}
                onChange={handleToggleSystemPages}
                color="primary"
                size="sm"
              />
              {deletableSelectedIds.length > 0 && (
                <Button
                  variant="ghost"
                  color="danger"
                  size="sm"
                  onClick={handleBulkDeleteTrigger}
                  leadingIcon="trash-2"
                >
                  Delete Selected ({deletableSelectedIds.length})
                </Button>
              )}
            </Box>
          </Box>

          <Box flex direction="col" className="flex-1 gap-2">
            {pagedPages.length > 0 ? (
              pagedPages.map((page: Page) => (
                <PageItem
                  key={page._id}
                  page={page}
                  isSelected={selectedIds.has(page._id)}
                  onToggle={handleToggle}
                  onEdit={handleEditTrigger}
                  onDelete={handleDeleteTrigger}
                />
              ))
            ) : (
              <Box flex justify="center" align="center" className="py-8">
                <Text color="secondary">
                  {searchQuery ? `No pages match "${searchQuery}"` : 'No pages found.'}
                </Text>
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

      <PageFormDialog
        open={isFormOpen}
        page={editTarget}
        onClose={handleFormClose}
      />

      <Dialog
        open={Boolean(deleteContext)}
        onClose={() => setDeleteContext(null)}
        title="Confirm Destructive Action"
        size="xl"
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

export default CmsPagesPage;