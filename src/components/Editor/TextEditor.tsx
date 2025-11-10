import React from 'react';
import { Box, TextField } from '@mui/material';

// Style chung cho Glassmorphism
const glassmorphismStyle = {
  // backgroundColor: 'rgba(2, 83, 104, 0.5)', // Màu xanh mòng két (teal) trong suốt
  backgroundColor: 'rgba(25, 55, 90, 0.5)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
};

const TextEditor = () => {
  return (
    <Box
      sx={{
        ...glassmorphismStyle,
        width: { xs: '90vw', md: '50vw' }, // Responsive
        height: '85vh',
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
            color: 'white', // Màu chữ
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
            color: 'rgba(255, 255, 255, 0.7)', // Màu placeholder
            opacity: 1,
          },
        }}
        
      />
    </Box>
  );
};

export default TextEditor;