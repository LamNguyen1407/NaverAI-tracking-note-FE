"use client";

import React, { useState } from "react";
import { Box, CssBaseline, TextareaAutosize } from "@mui/material";
import Sidebar from "@/components/Editor/Sidebar";
import { GlassCard } from "@developer-hub/liquid-glass";
import SendIcon from "@mui/icons-material/Send";
import { TbSend } from "react-icons/tb";

import ChatBubble from "@/components/Chat/ChatBubble";

const MENU_ICON_URL = "/assets/starfish.png";
const MAIN_BG_URL = "/assets/chat2.png";

function Chat() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${MAIN_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CssBaseline />

      {/* Button mở sidebar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // không muốn ở giữa màn hình
          width: "100%",
        }}
      >
        <Box
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 30,
            left: 30,
            width: 40,
            height: 40,
            cursor: "pointer",
            zIndex: 1301,
            backgroundImage: `url(${MENU_ICON_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backdropFilter: "blur(5px)",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.1)" },
            opacity: isSidebarOpen ? 0.8 : 1,
          }}
        />

        <Sidebar open={isSidebarOpen} onClose={toggleSidebar} current="Chat" />

        {/* Chat area*/}
        {/* Chat area */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Box
            sx={{
              width: "800px", // ⚡ KHUNG RÕ RÀNG CỐ ĐỊNH
              height: "95vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Khung tin nhắn */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                maxHeight: "100%",
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",

                borderRadius: "50px",

                // ⭐ Scrollbar cho textarea
                "& textarea::-webkit-scrollbar": {
                  width: "6px",
                },
                "& textarea::-webkit-scrollbar-thumb": {
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "3px",
                },
                "& textarea::-webkit-scrollbar-thumb:hover": {
                  background: "rgba(0,0,0,0.8)",
                },
                "& textarea::-webkit-scrollbar-track": {
                  background: "transparent",
                },

                scrollbarWidth: "thin", // Firefox
                scrollbarColor: "rgba(0,0,0,0.5) transparent",
              }}
            >
              <GlassCard cornerRadius={25}>
                <Box
                  sx={{
                    width: "100%",

                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    borderRadius: "50px",
                    backdropFilter: "blur(15px)",
                    overflowY: "auto", // ⚡ CHỈ SCROLL DỌC
                    overflowX: "hidden", // ⚡ KHÔNG CHO SCROLL NGANG

                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(0,0,0,0.8)",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    scrollbarWidth: "thin", // Firefox
                    scrollbarColor: "rgba(0,0,0,0.5) transparent",
                  }}
                >
                  <ChatBubble message="Xin chào! Tôi có thể giúp gì cho bạn?" />
                  <ChatBubble
                    message="Cho tôi xem giao diện chat nhé."
                    isUser
                  />
                  <ChatBubble message="Xin chào! Tôi có thể giúp gì cho bạn?" />
                  <ChatBubble
                    message="Cho tôi xem giao diện chat nhé."
                    isUser
                  />
                  <ChatBubble message="Xin chào! Tôi có thể giúp gì cho bạn?" />
                  <ChatBubble
                    message="Cho tôi xem giao diện chat nhé."
                    isUser
                  />
                  <ChatBubble message="Xin chào! Tôi có thể giúp gì cho bạn?" />
                  <ChatBubble
                    message="Cho tôi xem giao diện chat nhé."
                    isUser
                  />
                  <ChatBubble message="Xin chào! Tôi có thể giúp gì cho bạn?" />
                  <ChatBubble
                    message="1. Khung chat hơi nhỏ so với màn hình .
                Với không gian nền khá lớn, hộp chat bị lọt thỏm vào giữa.
                          Bạn có thể tăng width 10–20% hoặc đặt max-width ~600–700px để cân bằng hơn.
2. Tỉ lệ tin nhắn chưa hài hòa

Các bong bóng khá ngắn (chiều ngang nhỏ), khiến văn bản xuống dòng nhiều hơn cần thiết.

Có thể tăng width bong bóng hoặc cho phép bong bóng tự co theo nội dung tối đa.

3. Độ trong suốt/mờ của khung chat hơi quá mạnh

Vì nền nhiều chi tiết, độ blur + transparency mạnh khiến chữ hơi khó tập trung.

Nên giảm opacity nền (vd: rgba(255,255,255,0.7) → 0.8–0.9).

4. Lặp lại tin nhắn nhiều gây cảm giác rối"
                    isUser
                  />
                </Box>
              </GlassCard>
            </Box>

            {/* Input */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",

                  "& .custom-textarea": {
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,0,0,0.3)",
                    background: "rgba(255,255,255,0.85)",
                    color: "black",
                    fontSize: "1rem",
                    outline: "none",
                    resize: "none",
                    overflow: "auto",

                    // Firefox
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.5) transparent",
                  },

                  // ⭐ Scrollbar
                  "& .custom-textarea::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "& .custom-textarea::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: "3px",
                  },
                  "& .custom-textarea::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(0,0,0,0.8)",
                  },
                  "& .custom-textarea::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                }}
              >
                <TextareaAutosize
                  className="custom-textarea"
                  minRows={2}
                  maxRows={6}
                  placeholder="Nhập tin nhắn..."
                />
              </Box>

              <GlassCard>
                <Box
                  sx={{
                    padding: "12px 20px",
                    cursor: "pointer",
                    borderRadius: "14px",
                    backdropFilter: "blur(15px)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "black", fontWeight: "600" }}>Gửi</span>
                  <TbSend size={20} color="black" />
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
