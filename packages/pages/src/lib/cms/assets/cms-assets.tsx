import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Loader, Text, Dialog, Input } from '@inithium/ui';
import {
  useGetAssetsQuery,
  useDeleteAssetMutation,
  useCreateAssetIntentMutation,
  useUploadAssetBinaryMutation,
  showAlert,
} from '@inithium/store';
import type { Asset } from '@inithium/types';
import { AssetBrowserSidebar } from './asset-browser-sidebar';
import { AssetGrid } from './asset-grid';
import { AssetUploadDialog } from './asset-upload-dialog';

export type AssetCategory = 'all' | 'images' | 'fonts' | 'audio' | 'videos' | 'documents' | 'misc';
export type AssetOwnerContext = 'all' | 'app' | 'user';

const PAGE_SIZE = 8;

const filterAssets = (
  assets: readonly Asset[],
  query: string,
  category: AssetCategory,
  ownerContext: AssetOwnerContext,
): readonly Asset[] => {
  let result = assets;

  if (category !== 'all') {
    result = result.filter((a) => a.category === category || a.category === singularCategory(category));
  }

  if (ownerContext !== 'all') {
    result = result.filter((a) => a.owner_type === ownerContext);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (a) =>
        a.original_name?.toLowerCase().includes(q) ||
        a.storage_key?.toLowerCase().includes(q) ||
        a.filename?.toLowerCase().includes(q),
    );
  }

  return result;
};

const singularCategory = (cat: AssetCategory): string => {
  const map: Record<string, string> = {
    images: 'image',
    fonts: 'font',
    audio: 'audio',
    videos: 'video',
    documents: 'document',
    misc: 'other',
  };
  return map[cat] ?? cat;
};

const CmsAssetsPage: React.FC = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [selectedOwnerContext, setSelectedOwnerContext] = useState<AssetOwnerContext>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState<{ targets: readonly string[]; label: string } | null>(null);

  const { data, isLoading, error } = useGetAssetsQuery();
  const [deleteAsset] = useDeleteAssetMutation();
  const [createAssetIntent] = useCreateAssetIntentMutation();
  const [uploadAssetBinary] = useUploadAssetBinaryMutation();

  const assets: readonly Asset[] = useMemo(() => data ?? [], [data]);

  const filteredAssets = useMemo(
    () => filterAssets(assets, searchQuery, selectedCategory, selectedOwnerContext),
    [assets, searchQuery, selectedCategory, selectedOwnerContext],
  );

  const pagedAssets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAssets.slice(start, start + PAGE_SIZE);
  }, [filteredAssets, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    const pageIds = pagedAssets.map((a) => a._id);
    setSelectedIds((prev) => {
      const hasAll = pageIds.every((id) => prev.has(id));
      const next = new Set(prev);
      pageIds.forEach((id) => (hasAll ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [pagedAssets]);

  const isAllSelected = useMemo(
    () => pagedAssets.length > 0 && pagedAssets.every((a) => selectedIds.has(a._id)),
    [pagedAssets, selectedIds],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: AssetCategory): void => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleOwnerContextChange = (ctx: AssetOwnerContext): void => {
    setSelectedOwnerContext(ctx);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleUploadComplete = (count: number): void => {
    setIsUploadOpen(false);
    dispatch(
      showAlert({
        message: `${count} asset${count !== 1 ? 's' : ''} uploaded successfully.`,
        severity: 'success',
        closeable: false,
        position: 'bottom-right',
        animation_object: {
          entry: 'fadeInRight',
          exit: 'fadeOutRight',
          entrySpeed: 'fast',
          exitSpeed: 'faster',
        },
      }),
    );
  };

  const handleDeleteTrigger = (asset: Asset): void => {
    setDeleteContext({
      targets: [asset._id],
      label: `Are you sure you want to permanently remove "${asset.original_name ?? asset.filename}"? This action cannot be undone.`,
    });
  };

  const handleBulkDeleteTrigger = (): void => {
    const total = selectedIds.size;
    setDeleteContext({
      targets: Array.from(selectedIds),
      label: `Are you sure you want to permanently remove ${total} selected asset${total !== 1 ? 's' : ''}? The files and all associated records will be deleted.`,
    });
  };

  const executeDeletion = async (closeDialog: () => void): Promise<void> => {
    if (!deleteContext) return;
    try {
      await Promise.all(deleteContext.targets.map((id) => deleteAsset(id).unwrap()));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        deleteContext.targets.forEach((id) => next.delete(id));
        return next;
      });
      closeDialog();
      dispatch(
        showAlert({
          message: `${deleteContext.targets.length} asset${deleteContext.targets.length !== 1 ? 's' : ''} permanently removed.`,
          severity: 'success',
          closeable: false,
          position: 'bottom-right',
          animation_object: {
            entry: 'fadeInRight',
            exit: 'fadeOutRight',
            entrySpeed: 'fast',
            exitSpeed: 'faster',
          },
        }),
      );
    } catch (err) {
      console.error('Asset deletion error:', err);
    } finally {
      setDeleteContext(null);
    }
  };

  const deleteDialogActions = useMemo(
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
    <Box flex direction="row" className="h-full w-full overflow-hidden">
      <AssetBrowserSidebar
        selectedCategory={selectedCategory}
        selectedOwnerContext={selectedOwnerContext}
        assets={assets}
        onCategoryChange={handleCategoryChange}
        onOwnerContextChange={handleOwnerContextChange}
      />

      <Box flex direction="col" className="flex-1 min-w-0 h-full overflow-hidden">
        {isLoading ? (
          <Box flex justify="center" align="center" className="h-full w-full">
            <Loader variant="spinner" size="lg" color="primary" />
          </Box>
        ) : error ? (
          <Box flex justify="center" align="center" className="h-full w-full">
            <Text color="danger">Error loading assets</Text>
          </Box>
        ) : (
          <Box flex direction="col" className="h-full gap-2 p-4">
            <Box flex justify="between" align="center" className="w-full gap-2 shrink-0">
              <Box className="flex-1">
                <Input
                  label="Search assets"
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
                onClick={() => setIsUploadOpen(true)}
                leadingIcon="upload"
              >
                Upload Assets
              </Button>
            </Box>

            <Box
              flex
              align="center"
              justify="between"
              className="bg-surface1 px-3 py-2 rounded-md shrink-0"
            >
              <Box flex align="center" className="gap-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  className="w-4 h-4 accent-primary"
                />
                <Text variant="body2" overrideClassName="font-medium text-sm">
                  Select All on Page
                </Text>
                {filteredAssets.length > 0 && (
                  <Text variant="caption" color="secondary" overrideClassName="text-xs">
                    ({filteredAssets.length} total)
                  </Text>
                )}
              </Box>
              {selectedIds.size > 0 && (
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

            <Box className="flex-1 overflow-y-auto min-h-0">
              <AssetGrid
                assets={pagedAssets}
                selectedIds={selectedIds}
                onToggle={handleToggle}
                onDelete={handleDeleteTrigger}
                searchQuery={searchQuery}
              />
            </Box>

            {totalPages > 1 && (
              <Box flex justify="center" align="center" className="shrink-0 py-2">
                <Box flex align="center" className="gap-2">
                  <Button
                    variant="ghost"
                    color="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    leadingIcon="chevron-left"
                  >
                    Prev
                  </Button>
                  <Text variant="body2" overrideClassName="text-sm px-2">
                    {currentPage} / {totalPages}
                  </Text>
                  <Button
                    variant="ghost"
                    color="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    trailingIcon="chevron-right"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <AssetUploadDialog
        open={isUploadOpen}
        defaultOwnerContext={selectedOwnerContext === 'all' ? 'app' : selectedOwnerContext}
        onClose={() => setIsUploadOpen(false)}
        onComplete={handleUploadComplete}
        createAssetIntent={createAssetIntent}
        uploadAssetBinary={uploadAssetBinary}
      />

      <Dialog
        open={Boolean(deleteContext)}
        onClose={() => setDeleteContext(null)}
        title="Confirm Destructive Action"
        size="xl"
        variant="alert"
        backdrop={true}
        transition={true}
        actions={deleteDialogActions}
        actionsAlign="right"
      >
        <Text variant="body2" overrideClassName="text-slate-600">
          {deleteContext?.label}
        </Text>
      </Dialog>
    </Box>
  );
};

export default CmsAssetsPage;