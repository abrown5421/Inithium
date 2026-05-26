import { TransitionRouter } from '@inithium/router';
import { Box, Navbar, Text } from '@inithium/ui';
import React, { useMemo } from 'react';
import { useReadAllPagesQuery } from '@inithium/store';
import { selectActiveUser } from '@inithium/store';
import { useSelector } from 'react-redux';
import type { Page } from '@inithium/types';

const App: React.FC = () => {
  const { data, isLoading, error } = useReadAllPagesQuery();
  const activeUser = useSelector(selectActiveUser);

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
          <Navbar pages={mainNavPages} profilePages={profileNavPages} />
          <TransitionRouter />
        </Box>
      )}
    </Box>
  );
};

export default App;