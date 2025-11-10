"use client"

import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

// URL của ảnh nền sidebar (giả sử đặt trong /public)
const SIDEBAR_BG_URL = '/assets/jellyfish.png';
const SIDEBAR_WIDTH = 280; // Độ rộng của sidebar

// Style chung cho Glassmorphism của các mục trong Sidebar
const glassmorphismStyle = {
  backgroundColor: 'rgba(1, 62, 106, 0.6)', // Dùng màu #013e6a với 60% opacity
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '12px',
};

// Định nghĩa types cho props
interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    // <GlassCard>
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary" // "temporary" sẽ tự động đóng khi click ra ngoài
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          borderRadius: '50px',
          height: '97vh',
          margin: '1.5vh auto',
          marginLeft: '0.5vw',
          
          
          // Sử dụng background đa lớp: Ảnh con sứa (trên) và Gradient (dưới)
          background: `
            url(${SIDEBAR_BG_URL}), 
            linear-gradient(
              180deg, 
              rgba(1, 62, 106, 0.6), 
              rgba(67, 209, 255, 0.6), 
              rgba(1, 62, 106, 0.6), 
              rgba(65, 154, 214, 0.6), 
              rgba(1, 24, 106, 0.6)
            )
          `,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',

          // Hiệu ứng Glassmorphism
          backdropFilter: 'blur(15px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
          boxSizing: 'border-box',
          boxShadow: 'none',
        },
      }}
    >
      
      <Box sx={{ padding: 2, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Menu
        </Typography>
        <List>
          {/* Các mục menu giả lập theo ảnh */}
          {[1, 2, 3, 4].map((item) => (
            <ListItem
              // button
              key={item}
              sx={{
                ...glassmorphismStyle, // Áp dụng glass cho từng mục
                marginBottom: '10px',
                '&:hover': {
                  backgroundColor: 'rgba(67, 209, 255, 0.4)', // Hiệu ứng hover
                },
              }}
            >
              <ListItemText
                primary={`Ghi chú ${item}`}
                sx={{ color: 'white' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>

  );
};

export default Sidebar;
