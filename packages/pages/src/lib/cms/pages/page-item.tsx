import React from 'react';
import { Page } from '@inithium/types';
import { Box, Button, Checkbox, Text } from '@inithium/ui';

const STATUS_STYLES = {
  active:   'bg-success text-success-contrast',
  inactive: 'bg-surface3 text-secondary',
};

export interface PageItemProps {
  page: Page;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
}

export const PageItem: React.FC<PageItemProps> = ({
  page,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const statusStyle = page.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;

  return (
    <Box
      flex
      direction="row"
      justify="between"
      align="center"
      color="surface2"
      border
      borderWidth="thin"
      borderRadius="md"
      padding="md"
      fullWidth
      className="transition-colors hover:bg-surface3 items-center"
    >
      <Box flex direction="row" align="center" className="gap-2 min-w-0 flex-1">
        <Box flex align="center" justify="center" className="w-5 h-5 shrink-0">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggle(page._id)}
            color="primary"
            size="md"
            disabled={page.is_system_page}
          />
        </Box>

        <Box flex direction="col" className="min-w-0">
          <Box flex align="center" className="gap-1.5">
            <Text variant="body2" overrideClassName="font-semibold text-sm text-primary truncate">
              {page.key}
            </Text>
            {page.is_system_page && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-warning/10 text-warning uppercase tracking-wide shrink-0">
                system
              </span>
            )}
          </Box>
          <Text variant="caption" color="secondary" overrideClassName="text-xs text-secondary truncate">
            {page.path}
          </Text>
        </Box>
      </Box>

      <Box flex direction="row" align="center" className="gap-2 shrink-0">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusStyle}`}
        >
          {page.isActive ? 'active' : 'inactive'}
        </span>

        <Box flex align="center" className="gap-1">
          <Button
            variant="ghost"
            color="secondary"
            size="sm"
            rounded
            icon="pencil"
            onClick={() => onEdit(page)}
            aria-label={`Edit ${page.key}`}
          />
          <Button
            variant="ghost"
            color="danger"
            size="sm"
            rounded
            icon="trash-2"
            onClick={() => onDelete(page)}
            disabled={page.is_system_page}
            aria-label={`Delete ${page.key}`}
          />
        </Box>
      </Box>
    </Box>
  );
};