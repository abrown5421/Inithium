import React from 'react';
import { Box } from '../../components';
import NavSlot from './nav-slot';
import LogoSlot from './logo-slot';

const Navbar: React.FC = () => {
  return (
    <Box flex justify='between' align='center' color='surface2' className='h-[56px]'>
        <LogoSlot />
        <NavSlot />
    </Box>
  )
};

export default Navbar
