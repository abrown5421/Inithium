import React from 'react';
import { Box, Text } from '../../components';

const LogoSlot: React.FC = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;

  return (
    <Box flex align="center" className="h-[56px]">
      {logoUrl && (
        <Box flex align="center" className="h-[56px]">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="max-h-full w-auto object-contain"
          />
          <Text variant="h5" color="primary">Inithium</Text>
        </Box>
      )}
    </Box>
  );
};

export default LogoSlot;