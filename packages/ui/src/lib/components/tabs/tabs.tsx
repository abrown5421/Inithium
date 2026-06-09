import React from 'react';
import {
  Tab as HeadlessTab,
  TabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
} from '@headlessui/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { ThemeColor } from '@inithium/types';
import { TabListProps, TabPanelProps, TabPanelsProps, TabProps, TabsProps, TabsSize, TabsVariant } from './tabs.types';

type TabsContextProps = {
  variant: TabsVariant;
  size: TabsSize;
  color: ThemeColor;
  vertical: boolean;
  fullWidth: boolean;
};

const TabsContext = React.createContext<TabsContextProps | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be rendered within a <Tabs /> provider.');
  }
  return context;
};

const normalizeIconName = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_-]+/g, '-')
    .toLowerCase();

const sizeStyles: Record<TabsSize, { text: string; py: string; px: string; gap: string; icon: number }> = {
  sm: { text: 'text-xs font-medium', py: 'py-1.5', px: 'px-3', gap: 'gap-1.5', icon: 14 },
  md: { text: 'text-sm font-medium', py: 'py-2', px: 'px-4', gap: 'gap-2', icon: 16 },
  lg: { text: 'text-base font-semibold', py: 'py-2.5', px: 'px-5', gap: 'gap-2', icon: 18 },
};

const listVariantStyles = (variant: TabsVariant, vertical: boolean): string => {
  const base = vertical ? 'flex flex-col' : 'flex items-center';
  
  const maps: Record<TabsVariant, string> = {
    line: vertical ? 'border-r border-slate-200' : 'border-b border-slate-200 w-full',
    pills: 'gap-1 p-1 bg-slate-100 rounded-lg',
    enclosed: 'border border-slate-200 rounded-xl p-1.5 gap-1 bg-slate-50',
  };
  
  return [base, maps[variant]].join(' ');
};

const tabSelectedStyles = (variant: TabsVariant, color: ThemeColor, vertical: boolean): string => {
  const variantColorMaps: Record<TabsVariant, Record<ThemeColor, string>> = {
    line: {
      primary: vertical ? 'border-r-2 border-primary text-primary' : 'border-b-2 border-primary text-primary',
      secondary: vertical ? 'border-r-2 border-secondary text-secondary' : 'border-b-2 border-secondary text-secondary',
      accent: vertical ? 'border-r-2 border-accent text-accent' : 'border-b-2 border-accent text-accent',
      success: vertical ? 'border-r-2 border-success text-success' : 'border-b-2 border-success text-success',
      warning: vertical ? 'border-r-2 border-warning text-warning' : 'border-b-2 border-warning text-warning',
      danger: vertical ? 'border-r-2 border-danger text-danger' : 'border-b-2 border-danger text-danger',
      surface: vertical ? 'border-r-2 border-surface text-surface' : 'border-b-2 border-surface text-surface',
      surface2: vertical ? 'border-r-2 border-surface2 text-surface2' : 'border-b-2 border-surface2 text-surface2',
      surface3: vertical ? 'border-r-2 border-surface3 text-surface3' : 'border-b-2 border-surface3 text-surface3',
      surface4: vertical ? 'border-r-2 border-surface4 text-surface4' : 'border-b-2 border-surface4 text-surface4',
      'primary-contrast': vertical ? 'border-r-2 border-primary-contrast text-primary-contrast' : 'border-b-2 border-primary-contrast text-primary-contrast',
      'secondary-contrast': vertical ? 'border-r-2 border-secondary-contrast text-secondary-contrast' : 'border-b-2 border-secondary-contrast text-secondary-contrast',
      'accent-contrast': vertical ? 'border-r-2 border-accent-contrast text-accent-contrast' : 'border-b-2 border-accent-contrast text-accent-contrast',
      'success-contrast': vertical ? 'border-r-2 border-success-contrast text-success-contrast' : 'border-b-2 border-success-contrast text-success-contrast',
      'warning-contrast': vertical ? 'border-r-2 border-warning-contrast text-warning-contrast' : 'border-b-2 border-warning-contrast text-warning-contrast',
      'danger-contrast': vertical ? 'border-r-2 border-danger-contrast text-danger-contrast' : 'border-b-2 border-danger-contrast text-danger-contrast',
      'surface-contrast': vertical ? 'border-r-2 border-surface-contrast text-surface-contrast' : 'border-b-2 border-surface-contrast text-surface-contrast',
      'surface2-contrast': vertical ? 'border-r-2 border-surface2-contrast text-surface2-contrast' : 'border-b-2 border-surface2-contrast text-surface2-contrast',
      'surface3-contrast': vertical ? 'border-r-2 border-surface3-contrast text-surface3-contrast' : 'border-b-2 border-surface3-contrast text-surface3-contrast',
      'surface4-contrast': vertical ? 'border-r-2 border-surface4-contrast text-surface4-contrast' : 'border-b-2 border-surface4-contrast text-surface4-contrast',
    },
    pills: {
      primary: 'bg-primary text-white shadow-sm',
      secondary: 'bg-secondary text-white shadow-sm',
      accent: 'bg-accent text-white shadow-sm',
      success: 'bg-success text-white shadow-sm',
      warning: 'bg-warning text-white shadow-sm',
      danger: 'bg-danger text-white shadow-sm',
      surface: 'bg-surface text-slate-900 shadow-sm',
      surface2: 'bg-surface2 text-slate-900 shadow-sm',
      surface3: 'bg-surface3 text-slate-900 shadow-sm',
      surface4: 'bg-surface4 text-slate-900 shadow-sm',
      'primary-contrast': 'bg-primary-contrast text-slate-900 shadow-sm',
      'secondary-contrast': 'bg-secondary-contrast text-slate-900 shadow-sm',
      'accent-contrast': 'bg-accent-contrast text-slate-900 shadow-sm',
      'success-contrast': 'bg-success-contrast text-slate-900 shadow-sm',
      'warning-contrast': 'bg-warning-contrast text-slate-900 shadow-sm',
      'danger-contrast': 'bg-danger-contrast text-slate-900 shadow-sm',
      'surface-contrast': 'bg-surface-contrast text-slate-900 shadow-sm',
      'surface2-contrast': 'bg-surface2-contrast text-slate-900 shadow-sm',
      'surface3-contrast': 'bg-surface3-contrast text-slate-900 shadow-sm',
      'surface4-contrast': 'bg-surface4-contrast text-slate-900 shadow-sm',
    },
    enclosed: {
      primary: 'bg-primary border border-slate-200 text-primary-contrast shadow-xs rounded-lg',
      secondary: 'bg-secondary border border-slate-200 text-secondary-contrast shadow-xs rounded-lg',
      accent: 'bg-accent border border-slate-200 text-accent-contrast shadow-xs rounded-lg',
      success: 'bg-success border border-slate-200 text-success-contrast shadow-xs rounded-lg',
      warning: 'bg-warning border border-slate-200 text-warning-contrast shadow-xs rounded-lg',
      danger: 'bg-danger border border-slate-200 text-danger-contrast shadow-xs rounded-lg',
      surface: 'bg-surface border border-slate-200 text-surface-contrast shadow-xs rounded-lg',
      surface2: 'bg-surface2 border border-slate-200 text-surface2-contrast shadow-xs rounded-lg',
      surface3: 'bg-surface3 border border-slate-200 text-surface3-contrast shadow-xs rounded-lg',
      surface4: 'bg-surface4 border border-slate-200 text-surface4-contrast shadow-xs rounded-lg',
      'primary-contrast': 'bg-primary-contrast border border-slate-200 text-primary shadow-xs rounded-lg',
      'secondary-contrast': 'bg-secondary-contrast border border-slate-200 text-secondary shadow-xs rounded-lg',
      'accent-contrast': 'bg-accent-contrast border border-slate-200 text-accent shadow-xs rounded-lg',
      'success-contrast': 'bg-success-contrast border border-slate-200 text-success shadow-xs rounded-lg',
      'warning-contrast': 'bg-warning-contrast border border-slate-200 text-warning shadow-xs rounded-lg',
      'danger-contrast': 'bg-danger-contrast border border-slate-200 text-danger shadow-xs rounded-lg',
      'surface-contrast': 'bg-surface-contrast border border-slate-200 text-surface shadow-xs rounded-lg',
      'surface2-contrast': 'bg-surface2-contrast border border-slate-200 text-surface2 shadow-xs rounded-lg',
      'surface3-contrast': 'bg-surface3-contrast border border-slate-200 text-surface3 shadow-xs rounded-lg',
      'surface4-contrast': 'bg-surface4-contrast border border-slate-200 text-surface4 shadow-xs rounded-lg',
    },
  };

  return variantColorMaps[variant][color];
};

const tabUnselectedStyles = (variant: TabsVariant): string => {
  const maps: Record<TabsVariant, string> = {
    line: 'border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
    pills: 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md',
    enclosed: 'text-slate-500 hover:text-slate-900 rounded-lg border border-transparent',
  };
  return maps[variant];
};

export const Tabs: React.FC<TabsProps> & {
  List: React.FC<TabListProps>;
  Tab: React.FC<TabProps>;
  Panels: React.FC<TabPanelsProps>;
  Panel: React.FC<TabPanelProps>;
} = ({
  variant = 'line',
  size = 'md',
  color = 'primary',
  fullWidth = false,
  vertical = false,
  className,
  children,
  ...props
}) => {
  const contextValue = React.useMemo(
    () => ({ variant, size, color, vertical, fullWidth }),
    [variant, size, color, vertical, fullWidth]
  );

  const containerClasses = [
    vertical ? 'flex gap-6' : 'flex flex-col gap-4',
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TabsContext.Provider value={contextValue}>
      <TabGroup vertical={vertical} className={containerClasses} {...props}>
        {children}
      </TabGroup>
    </TabsContext.Provider>
  );
};

Tabs.List = function List({ className, children }) {
  const { variant, vertical } = useTabsContext();
  
  const classes = [listVariantStyles(variant, vertical), className ?? '']
    .filter(Boolean)
    .join(' ');

  return <HeadlessTabList className={classes}>{children}</HeadlessTabList>;
};

Tabs.Tab = function Tab({ leadingIcon, trailingIcon, className, children, ...props }) {
  const { variant, size, color, vertical, fullWidth } = useTabsContext();
  const currentSize = sizeStyles[size];

  return (
    <HeadlessTab
      {...props}
      className={({ selected, disabled }) => {
        const baseClasses =
          'relative flex items-center justify-center whitespace-nowrap outline-hidden cursor-pointer select-none ' +
          'transition-all duration-200 ease-in-out font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400';

        const contextStyles = selected
          ? tabSelectedStyles(variant, color, vertical)
          : tabUnselectedStyles(variant);

        const disabledStyles = disabled ? 'opacity-40 cursor-not-allowed select-none' : '';
        const widthStyle = fullWidth && !vertical ? 'flex-1' : '';

        return typeof className === 'function'
          ? className({ selected, disabled })
          : [
              baseClasses,
              currentSize.text,
              currentSize.py,
              currentSize.px,
              currentSize.gap,
              contextStyles,
              disabledStyles,
              widthStyle,
              className ?? '',
            ]
              .filter(Boolean)
              .join(' ');
      }}
    >
      {(bag) => (
        <>
          {leadingIcon && (
            <DynamicIcon
              name={normalizeIconName(leadingIcon) as any}
              size={currentSize.icon}
              className="shrink-0"
              aria-hidden="true"
            />
          )}
          {typeof children === 'function' ? children(bag) : children}
          {trailingIcon && (
            <DynamicIcon
              name={normalizeIconName(trailingIcon) as any}
              size={currentSize.icon}
              className="shrink-0"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </HeadlessTab>
  );
};

Tabs.Panels = function Panels({ className, children }) {
  return <HeadlessTabPanels className={['outline-hidden', className ?? ''].filter(Boolean).join(' ')}>{children}</HeadlessTabPanels>;
};

Tabs.Panel = function Panel({ className, unmount = false, children }) {
  return (
    <HeadlessTabPanel
      unmount={unmount}
      className={['outline-hidden transition-all duration-200 ease-in-out', className ?? ''].filter(Boolean).join(' ')}
    >
      {children}
    </HeadlessTabPanel>
  );
};

export default Tabs;