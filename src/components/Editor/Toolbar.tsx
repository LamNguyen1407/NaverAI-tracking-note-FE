import React from 'react';
import { Box } from '@mui/material';

const Toolbar = () => {
  return (
    <Box
      sx={{
        width: { xs: '150px', sm: '500px' }, // Responsive
        height: '35px',
        // Dải màu gradient từ tím sang hồng
        background:
          'linear-gradient(90deg, rgba(142, 45, 226, 0.7), rgba(244, 65, 165, 0.7))',
        // Hiệu ứng Glassmorphism
        backdropFilter: 'blur(10px)',
        borderRadius: '50px', // Bo tròn
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
    />
  );
};

export default Toolbar;