import React, { MouseEvent, ReactNode } from 'react';
import { useNavigation } from '../navigation/use-navigation';

interface NavigationLinkProps {
  to?: string;
  pageKey?: string;
  children: ReactNode;
  className?: string;
  asButton?: boolean;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  to,
  pageKey,
  children,
  className = '',
  asButton = false,
}) => {
  const { navigate, navigateToKey } = useNavigation();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (pageKey) {
      navigateToKey(pageKey);
    } else if (to) {
      navigate(to);
    }
  };

  const sharedProps = {
    onClick: handleClick,
    className,
  };

  if (asButton) {
    return <button type="button" {...sharedProps}>{children}</button>;
  }

  return (
    <a href={to ?? '#'} {...sharedProps}>
      {children}
    </a>
  );
};

export default NavigationLink;