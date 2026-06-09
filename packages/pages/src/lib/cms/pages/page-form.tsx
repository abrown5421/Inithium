import React, { useReducer, useTransition } from 'react';
import { Box, Button, Input, Select, Text, Checkbox } from '@inithium/ui';
import { Page, NavigationConfig, NavLocation, AnimateEntry, AnimateSpeed, AnimateExit, ThemeColor } from '@inithium/types';
import { useCreatePageMutation, useUpdatePageMutation } from '@inithium/store';

const ANIMATE_ENTRY_OPTIONS = [
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'fadeInDown', label: 'Fade In Down' },
  { value: 'fadeInUp', label: 'Fade In Up' },
  { value: 'fadeInLeft', label: 'Fade In Left' },
  { value: 'fadeInRight', label: 'Fade In Right' },
  { value: 'slideInLeft', label: 'Slide In Left' },
  { value: 'slideInRight', label: 'Slide In Right' },
  { value: 'zoomIn', label: 'Zoom In' },
];

const ANIMATE_EXIT_OPTIONS = [
  { value: 'fadeOut', label: 'Fade Out' },
  { value: 'fadeOutDown', label: 'Fade Out Down' },
  { value: 'fadeOutUp', label: 'Fade Out Up' },
  { value: 'fadeOutLeft', label: 'Fade Out Left' },
  { value: 'fadeOutRight', label: 'Fade Out Right' },
  { value: 'slideOutLeft', label: 'Slide Out Left' },
  { value: 'slideOutRight', label: 'Slide Out Right' },
  { value: 'zoomOut', label: 'Zoom Out' },
];

const SPEED_OPTIONS = [
  { value: 'faster', label: 'Faster' },
  { value: 'fast', label: 'Fast' },
  { value: 'normal', label: 'Normal' },
  { value: 'slow', label: 'Slow' },
  { value: 'slower', label: 'Slower' },
];

const NAV_LOCATION_OPTIONS = [
  { value: 'main', label: 'Main' },
  { value: 'profile', label: 'Profile' },
  { value: 'footer', label: 'Footer' },
  { value: 'cms', label: 'CMS' },
  { value: 'none', label: 'None' },
];

export interface PageFormProps {
  page?: Page;
  onCancel: () => void;
}

type FormState = Partial<Page>;

type FormAction =
  | { type: 'SET_FIELD'; field: keyof Page; value: any }
  | { type: 'SET_NESTED_FIELD'; parent: 'navigation'; field: keyof NavigationConfig; value: any };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_NESTED_FIELD': {
      const currentParent = state[action.parent] ?? {
        label: '',
        location: 'none' as NavLocation,
      };
      return {
        ...state,
        [action.parent]: {
          ...currentParent,
          [action.field]: action.value,
        } as NavigationConfig,
      };
    }
    default:
      return state;
  }
};

const createInitialState = (page?: Page): FormState => ({
  key: '',
  path: '',
  componentKey: '',
  entry: 'fadeIn' as AnimateEntry,
  entrySpeed: 'normal' as AnimateSpeed,
  exit: 'fadeOut' as AnimateExit,
  exitSpeed: 'normal' as AnimateSpeed,
  bg: '' as ThemeColor,
  color: undefined,
  isActive: true,
  centered: false,
  isErrorPage: false,
  is_system_page: false,
  navigation: {
    location: 'none' as NavLocation,
    label: '',
    authenticated: false,
    anonymous: false,
  },
  ...page,
});

export const PageForm: React.FC<PageFormProps> = ({ page, onCancel }) => {
  const isEditMode = Boolean(page?._id);
  const isSystemRecord = Boolean(page?.is_system_page);
  
  const [formState, dispatch] = useReducer(formReducer, page, createInitialState);
  const [isPending, startTransition] = useTransition();

  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();

  const updateField = (field: keyof Page) => (value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const updateNestedField = (parent: 'navigation') => (field: keyof NavigationConfig) => (value: any) => {
    dispatch({ type: 'SET_NESTED_FIELD', parent, field, value });
  };

  const handleInputChange = (field: keyof Page) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(field)(e.target.value);
  };

  const handleNestedInputChange = (parent: 'navigation', field: keyof NavigationConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNestedField(parent)(field)(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (isEditMode && page?._id) {
          await updatePage({ id: page._id, updates: formState }).unwrap();
        } else {
          await createPage(formState).unwrap();
        }
        onCancel();
      } catch (error) {
        console.error('Failed to submit structural page mutation payload:', error);
      }
    });
  };

  return (
    <Box flex direction="col" onSubmit={handleSubmit} className="gap-4 py-2 w-full">
      <Box flex direction="row" className="gap-4">
        <Box flex direction="col" className="gap-1 flex-1">
          <Input
            label="Page Key"
            variant="outline"
            color="primary"
            size="sm"
            fullWidth
            value={formState.key ?? ''}
            onChange={handleInputChange('key')}
            disabled={isEditMode}
            required
          />
        </Box>
        <Box flex direction="col" className="gap-1 flex-1">
          <Input
            label="Path"
            variant="outline"
            color="primary"
            size="sm"
            fullWidth
            value={formState.path ?? ''}
            onChange={handleInputChange('path')}
            leadingIcon="link"
            disabled={isEditMode}
            required
          />
        </Box>
      </Box>

      <Box flex direction="col" className="gap-1">
        <Input
          label="Component Key"
          variant="outline"
          color="primary"
          size="sm"
          fullWidth
          value={formState.componentKey ?? ''}
          onChange={handleInputChange('componentKey')}
          leadingIcon="code"
          disabled={isEditMode}
          required
        />
      </Box>

      <SectionLabel label="Animation" />

      <Box flex direction="row" className="gap-4">
        <Box className="flex-1">
          <Select
            label="Entry Animation"
            options={ANIMATE_ENTRY_OPTIONS}
            color="primary"
            variant="outline"
            size="sm"
            fullWidth
            value={formState.entry ?? ''}
            onChange={updateField('entry')}
          />
        </Box>
        <Box className="flex-1">
          <Select
            label="Entry Speed"
            options={SPEED_OPTIONS}
            color="primary"
            variant="outline"
            size="sm"
            fullWidth
            value={formState.entrySpeed ?? ''}
            onChange={updateField('entrySpeed')}
          />
        </Box>
      </Box>

      <Box flex direction="row" className="gap-4">
        <Box className="flex-1">
          <Select
            label="Exit Animation"
            options={ANIMATE_EXIT_OPTIONS}
            color="primary"
            variant="outline"
            size="sm"
            fullWidth
            value={formState.exit ?? ''}
            onChange={updateField('exit')}
          />
        </Box>
        <Box className="flex-1">
          <Select
            label="Exit Speed"
            options={SPEED_OPTIONS}
            color="primary"
            variant="outline"
            size="sm"
            fullWidth
            value={formState.exitSpeed ?? ''}
            onChange={updateField('exitSpeed')}
          />
        </Box>
      </Box>

      <SectionLabel label="Appearance" />

      <Box flex direction="row" className="gap-4">
        <Box className="flex-1">
          <Input
            label="Background Color"
            variant="outline"
            color="primary"
            size="sm"
            fullWidth
            value={formState.bg ?? ''}
            onChange={handleInputChange('bg')}
          />
        </Box>
        <Box className="flex-1">
          <Input
            label="Text Color"
            variant="outline"
            color="primary"
            size="sm"
            fullWidth
            value={formState.color ?? ''}
            onChange={handleInputChange('color')}
          />
        </Box>
      </Box>

      <SectionLabel label="Navigation" />

      <Box flex direction="row" className="gap-4">
        <Box className="flex-1">
          <Input
            label="Nav Label"
            variant="outline"
            color="primary"
            size="sm"
            fullWidth
            value={formState.navigation?.label ?? ''}
            onChange={handleNestedInputChange('navigation', 'label')}
          />
        </Box>
        <Box className="flex-1">
          <Select
            label="Nav Location"
            options={NAV_LOCATION_OPTIONS}
            color="primary"
            variant="outline"
            size="sm"
            fullWidth
            value={formState.navigation?.location ?? 'none'}
            onChange={updateNestedField('navigation')('location')}
          />
        </Box>
      </Box>

      <SectionLabel label="Flags" />

      <Box flex direction="row" justify="between" className="gap-4 flex-wrap my-2">
        <Checkbox
          label="Active"
          checked={Boolean(formState.isActive)}
          onChange={updateField('isActive')}
          color="success"
          size="sm"
        />
        <Checkbox
          label="Centered"
          checked={Boolean(formState.centered)}
          onChange={updateField('centered')}
          color="primary"
          size="sm"
        />
        <Checkbox
          label="Error Page"
          checked={Boolean(formState.isErrorPage)}
          onChange={updateField('isErrorPage')}
          color="danger"
          size="sm"
        />
        <Checkbox
          label="Auth Required"
          checked={Boolean(formState.navigation?.authenticated)}
          onChange={updateNestedField('navigation')('authenticated')}
          color="primary"
          size="sm"
        />
        <Checkbox
          label="Anonymous Only"
          checked={Boolean(formState.navigation?.anonymous)}
          onChange={updateNestedField('navigation')('anonymous')}
          color="secondary"
          size="sm"
        />
      </Box>

      <Box flex justify="end" className="gap-2 mt-4">
        <Button variant="ghost" color="secondary" size="sm" onClick={onCancel} type="button" disabled={isPending}>
          Cancel
        </Button>
        <Button variant="solid" color="primary" size="sm" type="submit" disabled={isPending}>
          {isEditMode ? 'Save Modifications' : 'Create Context'}
        </Button>
      </Box>
    </Box>
  );
};

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <Text
    variant="caption"
    overrideClassName="text-xs font-bold uppercase tracking-wider text-secondary mt-2"
  >
    {label}
  </Text>
);