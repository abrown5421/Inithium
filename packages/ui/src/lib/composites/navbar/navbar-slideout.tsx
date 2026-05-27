import React, { useRef, useEffect } from 'react';
import { Box, Button, Text } from '../../components';
import { AnimationController } from '@inithium/types';
import { NavbarSlideoutProps } from './navbar.types';
import { getGreeting } from '@inithium/utils';

const NavbarSlideout: React.FC<NavbarSlideoutProps> = ({
  mainPages,
  profilePages,
  isOpen,
  onClose,
  activeUser,
  renderLink,
  onLogout,
}) => {
  const controllerRef = useRef<AnimationController>({
    phase: 'idle',
    triggerExit: () => Promise.resolve(),
    triggerEnter: () => {},
    reset: () => {},
  });

  useEffect(() => {
    if (isOpen) {
      controllerRef.current.triggerEnter();
    }
  }, [isOpen]);

  const handleClose = async () => {
    await controllerRef.current.triggerExit();
    onClose();
  };

  const handleLinkClick = async () => {
    await controllerRef.current.triggerExit();
    onClose();
  };

  const handleLogout = async () => {
    await controllerRef.current.triggerExit();
    onClose();
    onLogout?.();
  };

  if (!isOpen) return null;

  const hasVisibleMainLinks = mainPages.some((page) => !page.navigation?.isButton);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <Box
        color="surface2"
        flex
        direction="col"
        className="relative z-10 w-72 h-full shadow-xl"
        animation={{
          entry: 'slideInRight',
          exit: 'slideOutRight',
          entrySpeed: 'faster',
          exitSpeed: 'faster',
          controller: controllerRef.current,
        }}
      >
        <Box flex justify="between" align="center" padding="sm" className="h-[56px] shrink-0">
          <Text variant="h5" color="primary">{getGreeting()}</Text>
          <Button
            icon="x"
            color="primary"
            variant="ghost"
            size="md"
            rounded={false}
            onClick={handleClose}
          />
        </Box>

        <Box flex direction="col" padding="sm" className="flex-1 overflow-y-auto">
          {mainPages.map((page) => {
            if (page.navigation?.isButton) {
              return null;
            }
            return (
              <div key={page.key} onClick={handleLinkClick}>
                {renderLink(
                  page,
                  'block px-3 py-2 rounded-md text-sm font-medium text-surface2-contrast hover:text-accent transition-colors duration-150',
                )}
              </div>
            );
          })}

          {activeUser && profilePages.length > 0 && (
            <>
              {hasVisibleMainLinks && <Box className="my-2 border-t border-surface3" />}
              {profilePages.map((page) => {
                if (page.navigation?.isButton) {
                  return (
                    <div key={page.key} onClick={handleLinkClick} className="mt-1">
                      <Button
                        color="primary"
                        variant="solid"
                        size="sm"
                        rounded
                        fullWidth
                      >
                        {renderLink(page)}
                      </Button>
                    </div>
                  );
                }
                return (
                  <div key={page.key} onClick={handleLinkClick}>
                    {renderLink(
                      page,
                      'block px-3 py-2 rounded-md text-sm font-medium text-surface2-contrast hover:text-accent transition-colors duration-150',
                    )}
                  </div>
                );
              })}
            </>
          )}
        </Box>

        <Box padding="sm" className="shrink-0">
          {!activeUser && (
            mainPages
              .filter((page) => page.navigation?.isButton)
              .map((page) => (
                <div key={page.key} onClick={handleLinkClick}>
                  <Button
                    color="primary"
                    variant="solid"
                    size="sm"
                    rounded
                    fullWidth
                  >
                    {renderLink(page)}
                  </Button>
                </div>
              ))
          )}

          {activeUser && (
            <Button
              color="danger"
              variant="solid"
              size="sm"
              rounded
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default NavbarSlideout;