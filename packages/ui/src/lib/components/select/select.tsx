import React from 'react';
import { Select as HeadlessSelect } from '@headlessui/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { SelectProps, SelectSize } from './select.types';

type ColorKey = NonNullable<SelectProps['color']>;
type VariantKey = NonNullable<SelectProps['variant']>;

function normalizeIconName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_-]+/g, '-')
    .toLowerCase();
}

const sizeStyles: Record<SelectSize, { container: string; select: string; label: string; iconSize: number; leadingIconSpacer: string }> = {
  sm: {
    container: 'h-10',
    select: 'pt-4 pb-1 text-sm pl-3 pr-8',
    label: 'text-xs left-3 top-0.5 peer-data-has-value:text-xs peer-data-has-value:top-0.5 peer-focus:text-xs peer-focus:top-0.5 text-sm top-2.5',
    leadingIconSpacer: 'pl-9',
    iconSize: 14,
  },
  md: {
    container: 'h-12',
    select: 'pt-5 pb-1.5 text-base pl-4 pr-10',
    label: 'text-xs left-4 top-0.5 peer-data-has-value:text-xs peer-data-has-value:top-0.5 peer-focus:text-xs peer-focus:top-0.5 text-base top-3',
    leadingIconSpacer: 'pl-10',
    iconSize: 18,
  },
  lg: {
    container: 'h-14',
    select: 'pt-6 pb-2 text-lg pl-5 pr-12',
    label: 'text-xs left-5 top-0.5 peer-data-has-value:text-xs peer-data-has-value:top-0.5 peer-focus:text-xs peer-focus:top-0.5 text-lg top-3.5',
    leadingIconSpacer: 'pl-12',
    iconSize: 22,
  },
};

const variantBaseStyles: Record<VariantKey, string> = {
  outline: 'bg-transparent border border-slate-300 focus:border-2 focus:pt-[19px] focus:pb-[5px]',
  filled: 'bg-slate-100 border-b-2 border-transparent focus:bg-slate-50',
  standard: 'bg-transparent border-b-2 border-slate-300 rounded-none! px-0!',
};

const focusColorStyles: Record<ColorKey, string> = {
  primary: 'focus:border-primary focus:ring-primary text-slate-900',
  secondary: 'focus:border-secondary focus:ring-secondary text-slate-900',
  accent: 'focus:border-accent focus:ring-accent text-slate-900',
  success: 'focus:border-success focus:ring-success text-slate-900',
  warning: 'focus:border-warning focus:ring-warning text-slate-900',
  danger: 'focus:border-danger focus:ring-danger text-slate-900',
  surface: 'focus:border-surface focus:ring-surface text-slate-900',
  surface2: 'focus:border-surface2 focus:ring-surface2 text-slate-900',
  surface3: 'focus:border-surface3 focus:ring-surface3 text-slate-900',
  surface4: 'focus:border-surface4 focus:ring-surface4 text-slate-900',
  'primary-contrast': 'focus:border-primary-contrast focus:ring-primary-contrast text-slate-900',
  'secondary-contrast': 'focus:border-secondary-contrast focus:ring-secondary-contrast text-slate-900',
  'accent-contrast': 'focus:border-accent-contrast focus:ring-accent-contrast text-slate-900',
  'success-contrast': 'focus:border-success-contrast focus:ring-success-contrast text-slate-900',
  'warning-contrast': 'focus:border-warning-contrast focus:ring-warning-contrast text-slate-900',
  'danger-contrast': 'focus:border-danger-contrast focus:ring-danger-contrast text-slate-900',
  'surface-contrast': 'focus:border-surface-contrast focus:ring-surface-contrast text-slate-900',
  'surface2-contrast': 'focus:border-surface2-contrast focus:ring-surface2-contrast text-slate-900',
  'surface3-contrast': 'focus:border-surface3-contrast focus:ring-surface3-contrast text-slate-900',
  'surface4-contrast': 'focus:border-surface4-contrast focus:ring-surface4-contrast text-slate-900',
};

const labelColorStyles: Record<ColorKey, string> = {
  primary: 'peer-focus:text-primary',
  secondary: 'peer-focus:text-secondary',
  accent: 'peer-focus:text-accent',
  success: 'peer-focus:text-success',
  warning: 'peer-focus:text-warning',
  danger: 'peer-focus:text-danger',
  surface: 'peer-focus:text-surface',
  surface2: 'peer-focus:text-surface2',
  surface3: 'peer-focus:text-surface3',
  surface4: 'peer-focus:text-surface4',
  'primary-contrast': 'peer-focus:text-primary-contrast',
  'secondary-contrast': 'peer-focus:text-secondary-contrast',
  'accent-contrast': 'peer-focus:text-accent-contrast',
  'success-contrast': 'peer-focus:text-success-contrast',
  'warning-contrast': 'peer-focus:text-warning-contrast',
  'danger-contrast': 'peer-focus:text-danger-contrast',
  'surface-contrast': 'peer-focus:text-surface-contrast',
  'surface2-contrast': 'peer-focus:text-surface2-contrast',
  'surface3-contrast': 'peer-focus:text-surface3-contrast',
  'surface4-contrast': 'peer-focus:text-surface4-contrast',
};

const SELECT_BASE =
  'peer block w-full appearance-none outline-hidden transition-all duration-200 ease-in-out ' +
  'text-slate-900 focus:outline-hidden bg-none ';

const CONTAINER_BASE = 'relative flex items-center transition-all duration-200 ';

interface SafeIconProps {
  name: string;
  size: number;
  className?: string;
}

const SafeIcon: React.FC<SafeIconProps> = ({ name, size, className }) => {
  try {
    const usableName = normalizeIconName(name) as any;
    return <DynamicIcon name={usableName} size={size} className={className} aria-hidden="true" />;
  } catch {
    return null;
  }
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  color = 'primary',
  variant = 'outline',
  size = 'md',
  rounded = true,
  fullWidth = false,
  leadingIcon,
  className,
  overrideClassName,
  style,
  onChange,
  id,
  value,
  defaultValue = '',
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  const currentSize = sizeStyles[size];

  const [hasValue, setHasValue] = React.useState(() => {
    const initial = value ?? defaultValue;
    return String(initial ?? '').length > 0;
  });

  React.useEffect(() => {
    if (value !== undefined) {
      setHasValue(String(value ?? '').length > 0);
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<any>) => {
    const element = e.target || e.currentTarget;
    if (element) {
      const rawValue = (element as Record<string, any>)['value'];
      setHasValue(String(rawValue ?? '').length > 0);
    }
    if (onChange) onChange(e);
  };

  const builtSelectClasses = overrideClassName
    ? [SELECT_BASE, overrideClassName].filter(Boolean).join(' ')
    : [
        SELECT_BASE,
        currentSize.select,
        variantBaseStyles[variant],
        focusColorStyles[color],
        rounded && variant !== 'standard' ? 'rounded-md' : 'rounded-none',
        leadingIcon ? currentSize.leadingIconSpacer : '',
        typeof className === 'string' ? className : '',
      ]
        .filter(Boolean)
        .join(' ');

  const labelPlacementClasses = variant === 'standard'
    ? `left-0 top-0.5 peer-data-has-value:text-xs peer-data-has-value:top-0.5 peer-focus:text-xs peer-focus:top-0.5 text-base top-3`
    : currentSize.label;

  const shiftedLabelPadding = leadingIcon && variant !== 'standard'
    ? hasValue 
      ? (size === 'sm' ? 'left-3' : size === 'md' ? 'left-4' : 'left-5') 
      : (size === 'sm' ? 'left-9 peer-focus:left-3' : size === 'md' ? 'left-10 peer-focus:left-4' : 'left-12 peer-focus:left-5')
    : '';

  return (
    <div
      className={[
        CONTAINER_BASE,
        currentSize.container,
        fullWidth ? 'w-full' : 'w-72',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {leadingIcon && (
        <span 
          className="absolute flex items-center pointer-events-none text-slate-400 transition-colors peer-focus:text-slate-600 z-10"
          style={{ left: variant === 'standard' ? '0px' : '12px' }}
        >
          <SafeIcon name={leadingIcon} size={currentSize.iconSize} />
        </span>
      )}

      <HeadlessSelect
        id={selectId}
        className={builtSelectClasses}
        onChange={handleSelectChange}
        value={value}
        defaultValue={defaultValue}
        data-has-value={hasValue ? 'true' : undefined}
        {...props}
      >
        <option value="" disabled hidden>
          {/* Empty fallback option blocks layout collisions on mount */}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white text-slate-900">
            {opt.label}
          </option>
        ))}
      </HeadlessSelect>

      <label
        htmlFor={selectId}
        className={[
          'absolute text-slate-400 pointer-events-none origin-top-left transition-all duration-200 ease-in-out z-10',
          hasValue ? 'top-0.5 scale-85' : 'peer-focus:top-0.5 peer-focus:scale-85',
          labelPlacementClasses,
          shiftedLabelPadding,
          labelColorStyles[color],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </label>

      <span className="absolute right-3 flex items-center pointer-events-none text-slate-400 transition-colors peer-focus:text-slate-600 z-10">
        <SafeIcon name="chevron-down" size={currentSize.iconSize} />
      </span>
    </div>
  );
};