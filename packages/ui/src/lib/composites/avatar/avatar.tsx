import React from 'react';
import { AvatarProps } from '@inithium/types';
import { AvatarContext } from './avatar-context';

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-24 h-24 text-lg',
  xl: 'w-48 h-48 text-3xl'
};

const shapeMap = {
  circle: 'rounded-full',
  square: 'rounded-xl'
};

const statusColorMap = {
  online: 'bg-[var(--color-success)] border-[var(--color-surface)]',
  offline: 'bg-[var(--color-surface4)] border-[var(--color-surface)]',
  away: 'bg-[var(--color-warning)] border-[var(--color-surface)]',
  busy: 'bg-[var(--color-danger)] border-[var(--color-surface)]'
};

const statusSizeMap = {
  sm: 'w-2 h-2 bottom-0 right-0 border',
  md: 'w-3.5 h-3.5 bottom-0 right-0 border-2',
  lg: 'w-4.5 h-4.5 bottom-0.5 right-0.5 border-2',
  xl: 'w-6 h-6 bottom-1 right-1 border-2'
};

export const Avatar: React.FC<AvatarProps & { children?: React.ReactNode }> = ({
  src,
  alt,
  fallback,
  size = 'md',
  status,
  shape = 'circle',
  onClick,
  className = '',
  children
}) => {
  const [hasImageLoaded, setHasImageLoaded] = React.useState(false);

  const containerClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'select-none',
    'bg-[var(--color-surface3)]',
    'text-[var(--color-primary)]',
    'font-semibold',
    'transition-all',
    'duration-300',
    'ease-out',
    sizeMap[size],
    shapeMap[shape],
    onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-[var(--color-accent)] active:scale-95 active:duration-75' : '',
    className
  ].filter(Boolean).join(' ');

  const statusClasses = status ? [
    'absolute',
    'rounded-full',
    statusColorMap[status],
    statusSizeMap[size]
  ].filter(Boolean).join(' ') : '';

  return (
    <AvatarContext.Provider value={{ size, shape, hasImageLoaded, setHasImageLoaded }}>
      <div className={containerClasses} onClick={onClick}>
        {children}
        {status && <span className={statusClasses} aria-hidden="true" />}
      </div>
    </AvatarContext.Provider>
  );
};