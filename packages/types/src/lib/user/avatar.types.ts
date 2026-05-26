export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  shape?: AvatarShape;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export interface AvatarFallbackProps {
  children?: React.ReactNode;
  className?: string;
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void;
  className?: string;
}