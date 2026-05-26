import React, { useState } from 'react';
import { Box, Button } from '../../components';
import NavSlot from './nav-slot';
import LogoSlot from './logo-slot';
import { selectActiveUser } from '@inithium/store';
import { useSelector } from 'react-redux';
import UserSlot from './user-slot';
import NavbarSlideout from './navbar-slideout';
import type { Page } from '@inithium/types';

interface NavbarProps {
  pages: Page[];
  profilePages: Page[];
}

export const Navbar: React.FC<NavbarProps> = ({ pages, profilePages }) => {
  const activeUser = useSelector(selectActiveUser);
  const [slideoutOpen, setSlideoutOpen] = useState(false);

  const openSlideout = () => setSlideoutOpen(true);
  const closeSlideout = () => setSlideoutOpen(false);

  return (
    <>
      <Box flex justify="between" align="center" color="surface2" className="h-[56px]">
        <LogoSlot />

        <Box flex direction="row" align="center">
          <Box className="hidden lg:flex">
            <NavSlot pages={pages} />
          </Box>

          <Box className="flex lg:hidden">
            {activeUser ? (
              <Box padding="sm" className="h-[56px]" flex align="center">
                <UserSlot onAvatarClick={openSlideout} />
              </Box>
            ) : (
              <Button
                icon="menu"
                color="primary"
                variant="ghost"
                size="md"
                rounded
                onClick={openSlideout}
              />
            )}
          </Box>

          <Box className="hidden lg:flex">
            {activeUser && <UserSlot />}
          </Box>
        </Box>
      </Box>

      <NavbarSlideout
        mainPages={pages}
        profilePages={profilePages}
        isOpen={slideoutOpen}
        onClose={closeSlideout}
      />
    </>
  );
};