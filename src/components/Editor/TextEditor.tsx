"use client"

import React from 'react';
import { Box, TextField } from '@mui/material';
import { GlassCard } from '@developer-hub/liquid-glass';

// // Style chung cho Glassmorphism
// const glassmorphismStyle = {
//   // backgroundColor: 'rgba(2, 83, 104, 0.5)', // Màu xanh mòng két (teal) trong suốt
//   // backgroundColor: 'rgba(25, 55, 90, 0.5)',
//   background: 'linear-gradient(180deg, rgba(17,51,32,0.6), rgba(38,141,124,0.6), rgba(194,255,180,0.6))',

//   backdropFilter: 'blur(12px)',
//   boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//   borderRadius: '15px',
//   border: '1px solid rgba(255, 255, 255, 0.18)',
// };

const TextEditor = () => {
  return (
    <GlassCard cornerRadius={50}>
    <Box
      sx={{
        // ...glassmorphismStyle,
        background: `linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.6),
          rgba(255, 255, 255, 0.8),
          rgba(245, 245, 245, 0.45)
        )`,

        width: { xs: '90vw', md: '50vw' }, // Responsive
        height: '90vh',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex', // Sử dụng flex để TextField lấp đầy
        flexDirection: 'column',
      }}
    >
      <TextField
        multiline
        fullWidth
        variant="standard" // Bỏ viền input
        placeholder="Bắt đầu ghi chú..."
        InputProps={{
          disableUnderline: true, // Bỏ gạch chân
          sx: {
            color: 'black', // Màu chữ
            height: '100%',
            alignItems: 'flex-start', // Bắt đầu gõ từ trên xuống
            overflowY: 'auto',
          },
        }}
        sx={{
          height: '100%', // TextField chiếm toàn bộ chiều cao của Box
          '& .MuiInputBase-root': {
            height: '100%',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'black', // Màu placeholder
            opacity: 1,
          },

          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.8)',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          scrollbarWidth: 'thin', // Firefox
          scrollbarColor: 'rgba(0,0,0,0.5) transparent',

        }}
        
      />
    </Box>
    </GlassCard>
  );
};

export default TextEditor;
