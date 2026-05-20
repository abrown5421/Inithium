import { HTMLAttributes } from "react";

export interface AvatarOptions {
  gradient?: string;
  variant?: 'square' | 'circular';
}

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  large?: boolean;
  alt?: string;
  options?: AvatarOptions;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
