"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, CssBaseline, TextareaAutosize } from "@mui/material";
import Sidebar from "@/components/Editor/Sidebar";
import { GlassCard } from "@developer-hub/liquid-glass";
import SendIcon from "@mui/icons-material/Send";
import { TbSend } from "react-icons/tb";

import LiquidGlassWrapper from "@/components/Chat/LiquidGlass";
import ChatBubble from "@/components/Chat/ChatBubble";
import { useSidebar } from "@/context/SidebarContext";

const MENU_ICON_URL = "/assets/starfish.png";
const MAIN_BG_URL = "/assets/chat2.png";

function Chat() {
  const { toggleSidebar } = useSidebar();
  // const [isSidebarOpen, setSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setSidebarOpen(!isSidebarOpen);
  // };
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [rows, setRows] = useState(2);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;

    const style = window.getComputedStyle(el);
    const lineHeight = parseInt(style.lineHeight);
    const paddingTop = parseInt(style.paddingTop);
    const paddingBottom = parseInt(style.paddingBottom);

    const usableHeight = el.scrollHeight - paddingTop - paddingBottom;

    let rows = Math.round(usableHeight / lineHeight);

    // clamp min/max nếu muốn
    rows = Math.max(2, Math.min(6, rows));

    console.log("rows:", rows);

    setRows(rows);
  };

  const [maxHeight, setMaxHeight] = useState("40rem");
  const calcMaxHeight = (rows: number): string => {
    if (rows <= 2) return "40rem";
    if (rows === 3) return "39rem";
    if (rows === 4) return "38rem";
    if (rows === 5) return "36rem";
    return "35rem";
  };
  useEffect(() => {
    const newMax = calcMaxHeight(rows);
    setMaxHeight(newMax);
    console.log("maxHeight mới:", newMax);
  }, [rows]);

  useEffect(() => {
    console.log("rows updated:", rows);
  }, [rows]);

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
            // opacity: isSidebarOpen ? 0.8 : 1,
          }}
        />

        {/* <Sidebar open={isSidebarOpen} onClose={toggleSidebar} current="Chat" /> */}

        {/* Chat area*/}
        {/* Chat area */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",

            mt: 1,
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
            {/* <Box sx={{ flex: 1 }}> */}
            {/* <LiquidGlassWrapper borderRadius={14} blur={7}> */}
            <GlassCard>
              <Box
                sx={{
                  width: "800px",
                  height: "100%",

                  padding: "0 25px",
                  boxSizing: "border-box",
                  marginTop: "5px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: "12px",
                  borderRadius: "50px",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    maxHeight: maxHeight,
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
                </Box>
              </Box>
            </GlassCard>
            {/* </Box> */}
            {/* </LiquidGlassWrapper> */}
            {/* </Box> */}

            {/* Input */}
            <Box
              sx={{
                mb: 1,
                mt: 1,
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

                    lineHeight: "20px",

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
                  ref={textareaRef}
                  onChange={handleChange}
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
