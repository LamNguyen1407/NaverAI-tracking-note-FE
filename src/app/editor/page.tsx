"use client"

import React, { useState } from 'react';
import { Box, CssBaseline, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '@/components/Editor/Sidebar';
import Toolbar from '@/components/Editor/Toolbar';
import TextEditor from '@/components/Editor/TextEditor';

// URL của ảnh nền chính (giả sử đặt trong /public)
const MAIN_BG_URL = '/assets/whale.png';
const MENU_ICON_URL = '/assets/starfish.png';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: `url(${MAIN_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Giúp reset CSS và làm nền full màn hình */}
      <CssBaseline />

      {/* Nút mở Sidebar */}
      {/* <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white', // Icon màu trắng
          zIndex: 1301,
          
          // --- THAY ĐỔI Ở ĐÂY ---
          // Sử dụng radial-gradient để tạo hiệu ứng tròn trịa
          background:
            'radial-gradient(circle at top left, rgba(123, 45, 159, 0.9) 0%, rgba(253, 216, 46, 0.9) 100%)',
          
          // Nếu muốn gradient theo 180deg nhưng trông tròn hơn:
          // background:
          //   'linear-gradient(180deg, rgba(123, 45, 159, 0.9) 0%, rgba(253, 216, 46, 0.9) 100%)',
          // backgroundSize: '150% 150%', // Làm gradient lớn hơn
          // backgroundPosition: 'center', // Đặt ở giữa
          // ----------------------
          
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%', // Đảm bảo là hình tròn
          
          // Màu hover: Giữ màu tương tự nhưng sáng hơn một chút
          '&:hover': {
            // Làm cho màu sáng hơn và hơi giãn gradient ra
            background:
              'radial-gradient(circle at top left, rgba(140, 60, 175, 1) 0%, rgba(255, 240, 120, 1) 100%)',
            boxShadow: '0 0 12px rgba(253, 216, 46, 0.3)', // Shadow rõ hơn
          },
        }}
      > */}

      {/* <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
          zIndex: 1301, // Phải cao hơn zIndex của Drawer (1300)
          // Thêm hiệu ứng glassmorphism cho nút
          background: isSidebarOpen 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'linear-gradient(180deg, rgba(123, 45, 159, 0.9) 0%, rgba(253, 216, 46, 0.9) 100%)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      */}

      <Box
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 25,
          left: 25,
          width: 48, // Đặt kích thước cố định cho nút ảnh
          height: 48,
          cursor: 'pointer', // Biến thành con trỏ để báo hiệu là nút
          zIndex: 1301,
          
          // Áp dụng ảnh làm nền
          backgroundImage: `url(${MENU_ICON_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

          // Áp dụng Glassmorphism
          backdropFilter: 'blur(5px)',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'transform 0.2s', // Thêm hiệu ứng chuyển động khi hover

          // Hiệu ứng hover (phóng to nhẹ khi rê chuột)
          '&:hover': {
            transform: 'scale(1.1)',
          },

          // Hiển thị gradient/màu khác khi sidebar chưa mở (Không cần nữa vì dùng ảnh)
          // Nếu bạn muốn thay đổi độ mờ của ảnh dựa trên isSidebarOpen, dùng opacity
          opacity: isSidebarOpen ? 0.8 : 1, 
        }}
      />

      {/* Thanh Toolbar ở trên
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <Toolbar />
      </Box> */}

      {/* Sidebar (Drawer) */}
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />

      {/* Vùng nội dung chính (chứa Text Editor)
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px', // Tạo khoảng đệm
        }}
      >
        <TextEditor />
      </Box> */}
      {/* Gộp Toolbar và TextEditor vào 1 box flex */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2, // khoảng cách giữa Toolbar và TextEditor
          width: '100%',
          height: '100vh',
          pt: 8, // chừa chỗ cho nút menu trên cùng
        }}
      >
        <Toolbar />
        <TextEditor />
      </Box>

      
    </Box>
  );
}

export default App;