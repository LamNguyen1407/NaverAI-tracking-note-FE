"use client";

import React, { useState } from "react";
import { Box, CssBaseline, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "@/components/Editor/Sidebar";
import Toolbar from "@/components/Editor/Toolbar";
import TextEditor from "@/components/Editor/TextEditor";
import { useSidebar } from "@/context/SidebarContext";
// URL của ảnh nền chính (giả sử đặt trong /public)
const MAIN_BG_URL = "/assets/sea7.png";
const MENU_ICON_URL = "/assets/starfish.png";

function App() {
  const { toggleSidebar } = useSidebar();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${MAIN_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Giúp reset CSS và làm nền full màn hình */}
      <CssBaseline />

      <Box
        onClick={toggleSidebar}
        sx={{
          position: "absolute",
          top: 30,
          left: 30,
          width: 40, // Đặt kích thước cố định cho nút ảnh
          height: 40,
          cursor: "pointer", // Biến thành con trỏ để báo hiệu là nút
          zIndex: 1301,

          // Áp dụng ảnh làm nền
          backgroundImage: `url(${MENU_ICON_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          // Áp dụng Glassmorphism
          backdropFilter: "blur(5px)",
          borderRadius: "50%",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "transform 0.2s", // Thêm hiệu ứng chuyển động khi hover

          // Hiệu ứng hover (phóng to nhẹ khi rê chuột)
          "&:hover": {
            transform: "scale(1.1)",
          },

          // Hiển thị gradient/màu khác khi sidebar chưa mở (Không cần nữa vì dùng ảnh)
          // Nếu bạn muốn thay đổi độ mờ của ảnh dựa trên isSidebarOpen, dùng opacity
        }}
      />

      {/* Sidebar (Drawer) */}
      {/* <Sidebar open={isSidebarOpen} onClose={toggleSidebar} /> */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1, // khoảng cách giữa Toolbar và TextEditor
          width: "100%",
          height: "100vh",
        }}
      >
        <Toolbar />
        <TextEditor />
      </Box>
    </Box>
  );
}

export default App;
