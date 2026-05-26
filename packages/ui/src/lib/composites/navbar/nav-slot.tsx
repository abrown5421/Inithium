import React from 'react';
import { Box, Button } from '../../components';
import { NavSlotProps } from './navbar.types';
import { NavigationLink } from '@inithium/router';

const NavSlot: React.FC<NavSlotProps> = ({ pages }) => {
  return (
    <Box flex align="center" padding="sm" className='h-[56px]'>
      {pages.map((page) => {
        if (page.navigation?.isButton) {
          return (
            <Button type="submit" color="primary" variant="solid" size="sm" rounded className="mx-1">
              <NavigationLink 
                pageKey={page.key}
              >
                {page.navigation!.label}
              </NavigationLink>
            </Button>
          )
        } else { 
          return(
            <NavigationLink 
              pageKey={page.key}
              className="mx-1 px-3 py-1.5 rounded-md text-sm font-medium text-surface2-contrast hover:border-accent hover:text-accent transition-colors duration-150"
            >
              {page.navigation!.label}
            </NavigationLink>
          )
        }
      })}
    </Box>
  );
};

export default NavSlot;