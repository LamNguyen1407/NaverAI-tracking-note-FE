import React from 'react';
import { Box } from '@mui/material';
import { GlassCard } from '@developer-hub/liquid-glass';

const Toolbar = () => {
  return (
    <GlassCard>
    <Box
      sx={{
        width: { xs: '150px', sm: '500px' }, // Responsive
        height: '40px',

        // background: 'linear-gradient(90deg, rgba(205,255,216), rgba(148,185,255))',
        background: 'linear-gradient(45deg, rgb(255, 67, 83, 0.7), rgb(255, 210, 148, 0.7))',


        // Hiệu ứng Glassmorphism
        // backdropFilter: 'blur(10px)',
        // borderRadius: '50px', // Bo tròn
        // border: '1px solid rgba(255, 255, 255, 0.18)',
        // boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
    />
    </GlassCard>
  );
};

export default Toolbar;