import React, { JSX } from 'react';
import { TextProps, TextVariant, TextDecorations } from './text.types';

const variantTagMap: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  h1:        'h1',
  h2:        'h2',
  h3:        'h3',
  h5:        'h5',
  h6:        'h6',
  subtitle1: 'p',
  subtitle2: 'p',
  body:      'p',
  body2:     'p',
  caption:   'span',
};

const variantStyles: Record<TextVariant, string> = {
  h1:        'text-5xl leading-tight tracking-tight',
  h2:        'text-4xl leading-tight tracking-tight',
  h3:        'text-3xl leading-snug',
  h5:        'text-xl leading-snug',
  h6:        'text-lg leading-snug',
  subtitle1: 'text-base leading-normal',
  subtitle2: 'text-sm leading-normal',
  body:      'text-base leading-relaxed',
  body2:     'text-sm leading-relaxed',
  caption:   'text-xs leading-normal',
};

const variantDefaultWeights: Record<TextVariant, string> = {
  h1:        'font-bold',
  h2:        'font-bold',
  h3:        'font-semibold',
  h5:        'font-semibold',
  h6:        'font-semibold',
  subtitle1: 'font-medium',
  subtitle2: 'font-medium',
  body:      'font-normal',
  body2:     'font-normal',
  caption:   'font-normal',
};

const COLOR_CLASS_MAP: Record<string, string> = {
  primary:   'text-primary',
  secondary: 'text-secondary',
  success:   'text-success',
  warning:   'text-warning',
  danger:    'text-danger',
};

const BASE = 'inline-block';

function buildClasses(
  color: string,
  variant: TextVariant,
  decoration: TextDecorations | undefined,
  font: string | undefined,
  overrideClassName?: string,
): string {
  if (overrideClassName !== undefined) {
    return [BASE, overrideClassName].filter(Boolean).join(' ').trim();
  }

  const weight = decoration?.bold ? 'font-bold' : variantDefaultWeights[variant];

  return [
    BASE,
    variantStyles[variant],
    weight,
    COLOR_CLASS_MAP[color] ?? 'text-primary',
    decoration?.italic    ? 'italic'    : '',
    decoration?.underline ? 'underline' : '',
    font ? `font-[${font}]` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
}

export const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  color = 'primary',
  variant = 'body',
  decoration,
  font,
  overrideClassName,
  style,
  children,
  ...props
}) => {
  const Tag = variantTagMap[variant];

  const resolvedClassName = buildClasses(
    color,
    variant,
    decoration,
    font,
    overrideClassName,
  );

  return (
    <Tag className={resolvedClassName} style={style} {...props}>
      {children}
    </Tag>
  );
};