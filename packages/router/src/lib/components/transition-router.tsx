import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Page } from '@inithium/types';
import { useReadAllPagesQuery } from '@inithium/store';
import { navigationService } from '../navigation/navigation-service';
import AnimatedPage, { AnimatedPageHandle } from './animated-page';
import { Box } from '@inithium/ui';
import { Text } from '@inithium/ui';

const TransitionRouter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: pages, isLoading, isError } = useReadAllPagesQuery();
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const animatedPageRef = useRef<AnimatedPageHandle>(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    navigationService.register(navigate);
  }, [navigate]);

  useEffect(() => {
    if (pages) {
      navigationService.setPages(pages);
    }
  }, [pages]);

  useEffect(() => {
    if (!pages) return;
    const match = pages.find((p) => p.path === location.pathname) ?? null;
    setCurrentPage(match);
  }, [location.pathname, pages]);

  const handleTransitionRequest = useCallback(
    async ({
      targetPath,
      resolve,
    }: {
      targetPath: string;
      resolve: () => void;
    }) => {
      if (isTransitioning.current) {
        resolve();
        return;
      }

      isTransitioning.current = true;

      try {
        if (animatedPageRef.current) {
          await animatedPageRef.current.playExit();
        }
      } finally {
        isTransitioning.current = false;
        resolve();
      }
    },
    [],
  );

  useEffect(() => {
    navigationService.registerTransitionHandler(handleTransitionRequest);
    return () => navigationService.unregisterTransitionHandler();
  }, [handleTransitionRequest]);

  if (isLoading) {
    return (
      <Box flex align="center" justify="center" fullWidth fullHeight className="min-h-screen">
        <Text variant="caption" overrideClassName="inline-block text-xs leading-normal font-normal text-primary opacity-40 tracking-widest uppercase">
          Loading…
        </Text>
      </Box>
    );
  }

  if (isError || !pages) {
    return (
      <Box flex align="center" justify="center" fullWidth fullHeight className="min-h-screen">
        <Text variant="body2" color="danger">Failed to load page manifest.</Text>
      </Box>
    );
  }

  return (
    <Routes>
      {pages
        .filter((p) => p.isActive)
        .map((page) => (
          <Route
            key={page.key}
            path={page.path}
            element={
              currentPage?.key === page.key ? (
                <AnimatedPage ref={animatedPageRef} page={page} />
              ) : (
                <AnimatedPage page={page} />
              )
            }
          />
        ))}

      <Route
        path="*"
        element={
          <Box flex align="center" justify="center" fullWidth fullHeight className="h-screen">
            <Box flex direction="col" align="center">
              <Text variant="h2" overrideClassName="inline-block text-4xl leading-tight tracking-tight font-bold text-primary opacity-20">
                404
              </Text>
              <Text variant="body2" overrideClassName="inline-block text-sm leading-relaxed font-normal text-primary mt-2 opacity-40">
                Page not found
              </Text>
            </Box>
          </Box>
        }
      />
    </Routes>
  );
};

export default TransitionRouter;