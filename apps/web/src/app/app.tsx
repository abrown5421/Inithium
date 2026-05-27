import { TransitionRouter, NavigationLink, useNavigation } from '@inithium/router';
import { Box, Navbar, Text } from '@inithium/ui';
import React, { useEffect, useMemo } from 'react';
import {
  useReadAllPagesQuery,
  selectActiveUser,
  useAuthBootstrap,
  useLogoutMutation,
} from '@inithium/store';
import { useSelector } from 'react-redux';
import type { Page } from '@inithium/types';

const App: React.FC = () => {
  useAuthBootstrap();

  const { data, isLoading, error } = useReadAllPagesQuery();
  const activeUser = useSelector(selectActiveUser);
  const [logout] = useLogoutMutation();
  const { navigateToKey } = useNavigation();

  useEffect(() => console.log(data), [data])
  const mainNavPages = useMemo<Page[]>(() => {
    if (!data) return [];
    return [...data]
      .filter((page) => page.navigation?.location === 'main')
      .filter((page) => activeUser ? !page.navigation?.anonymous : !page.navigation?.authenticated)
      .sort((a, b) => (a.navigation?.order ?? 0) - (b.navigation?.order ?? 0));
  }, [data, activeUser]);

  const profileNavPages = useMemo<Page[]>(() => {
    if (!data) return [];
    return [...data]
      .filter((page) => page.navigation?.location === 'profile')
      .filter((page) => activeUser ? !page.navigation?.anonymous : !page.navigation?.authenticated)
      .sort((a, b) => (a.navigation?.order ?? 0) - (b.navigation?.order ?? 0));
  }, [data, activeUser]);

  const renderLink = (page: Page, className?: string) => {
    const params = activeUser?._id ? { id: activeUser._id } : undefined;
    return (
      <NavigationLink pageKey={page.key} params={params} className={className}>
        {page.navigation!.label}
      </NavigationLink>
    );
  };

  const handleLogout = async () => {
    await logout();
    navigateToKey('login');
  };

  return (
    <Box color="surface-contrast" className="h-screen w-screen">
      {isLoading ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Text color="primary">Loading..</Text>
        </Box>
      ) : error ? (
        <Box flex justify="center" align="center" className="h-full w-full">
          <Text color="danger">Error</Text>
        </Box>
      ) : (
        <Box>
          <Navbar
            pages={mainNavPages}
            profilePages={profileNavPages}
            activeUser={activeUser}
            renderLink={renderLink}
            onLogout={handleLogout}
          />
          <TransitionRouter />
        </Box>
      )}
    </Box>
  );
};

export default App;