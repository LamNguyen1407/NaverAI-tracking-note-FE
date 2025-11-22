"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  CssBaseline,
  TextareaAutosize,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
  ListItemButton,
} from "@mui/material";
import Sidebar from "@/components/Editor/Sidebar";
import { GlassCard } from "@developer-hub/liquid-glass";
import { TbSend } from "react-icons/tb";
import SourceIcon from "@mui/icons-material/Source"; // Icon cho nút chọn source
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

import LiquidGlassWrapper from "@/components/Chat/LiquidGlass";
import ChatBubble from "@/components/Chat/ChatBubble";
import { useSidebar } from "@/context/SidebarContext";

const MENU_ICON_URL = "/assets/starfish.png";
const MAIN_BG_URL = "/assets/chat2.png";

interface ChatMessage {
  id: number;
  message: string;
  isUser: boolean;
}

// --- MOCK DATA & API SIMULATION ---

const MOCK_MESSAGES = [
  {
    id: 1,
    message: "Sáng nay build bị fail hoài, chắc do version mismatch.",
    isUser: false,
  },
  { id: 2, message: "Để tôi check lại file config xem sao.", isUser: true },
  {
    id: 3,
    message: "Hình như BE mới đổi endpoint mà không báo.",
    isUser: false,
  },
  { id: 4, message: "À đúng rồi, tôi thấy trong log báo 404.", isUser: true },
  {
    id: 5,
    message: "Tôi sẽ cập nhật tài liệu API lại cho team.",
    isUser: false,
  },
  { id: 6, message: "Ok gửi tôi luôn nhé, tôi sửa FE theo.", isUser: true },
  { id: 7, message: "UI hôm qua bạn gửi nhìn khá đẹp đó.", isUser: false },
  { id: 8, message: "Tôi test thử animation thấy mượt hơn rồi.", isUser: true },
  { id: 9, message: "Nhưng cái header bị lệch trên mobile.", isUser: false },
  { id: 10, message: "Ừ để tôi chỉnh lại breakpoint.", isUser: true },
  { id: 11, message: "Sáng nay server dev down 5 phút.", isUser: false },
  { id: 12, message: "Tôi tưởng do code tôi làm nó crash chứ.", isUser: true },
  { id: 13, message: "Không sao, do BE deploy nhầm lúc 8h.", isUser: false },
  { id: 14, message: "May quá, đỡ lo.", isUser: true },
  {
    id: 15,
    message: "Pagination hôm qua bạn push chạy ổn rồi đó.",
    isUser: false,
  },
  { id: 16, message: "Tôi mới optimize thêm đoạn load nữa.", isUser: true },
  {
    id: 17,
    message: "Flow tạo tài khoản hơi dài, có rút gọn được không?",
    isUser: false,
  },
  { id: 18, message: "Được, tôi merge hai bước lại thành một.", isUser: true },
  { id: 19, message: "Nay có họp nhanh lúc 3h chiều nha.", isUser: false },
  { id: 20, message: "Ok để tôi chuẩn bị slide.", isUser: true },
];

const MOCK_SOURCES_DATA = {
  notes: [
    { id: 1, title: "Ghi chú họp team Đổi Đồ", date: "20/11/2025" },
    { id: 2, title: "Ý tưởng UI Glassmorphism", date: "19/11/2025" },
    { id: 3, title: "Danh sách API cần viết", date: "18/11/2025" },
    { id: 4, title: "Bug fix scrollbar", date: "17/11/2025" },
  ],
  sources: [
    { id: 101, title: "Tài liệu ReactJS nang cao.pdf", type: "PDF" },
    { id: 102, title: "Video demo sản phẩm.mp4", type: "Video" },
    { id: 103, title: "Slide thuyết trình.pptx", type: "Slide" },
    { id: 104, title: "Link tham khảo Github", type: "Link" },
    { id: 105, title: "Design System Figma", type: "Link" },
  ],
};

// Hàm Mock API: Fetch tin nhắn lịch sử
const fetchHistoryMessages = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MESSAGES);
    }, 500); // Giả lập delay mạng
  });
};

// Hàm Mock API: Fetch danh sách Source/Note
const fetchSourceFiles = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SOURCES_DATA);
    }, 300);
  });
};

// ----------------------------------

function Chat() {
  const { toggleSidebar } = useSidebar();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // --- STATE QUẢN LÝ ---
  const [messages, setMessages] = useState<any[]>([]); // State lưu tin nhắn
  const [rows, setRows] = useState(2);
  const [maxHeight, setMaxHeight] = useState("40rem");
  const [inputMessage, setInputMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // State cho Dialog Source
  const [openSourceDialog, setOpenSourceDialog] = useState(false);
  const [availableSources, setAvailableSources] = useState<{
    notes: any[];
    sources: any[];
  }>({ notes: [], sources: [] });
  const [searchQuery, setSearchQuery] = useState("");

  // --- EFFECT: FETCH DATA BAN ĐẦU ---
  useEffect(() => {
    const initData = async () => {
      try {
        // Gọi API fetch tin nhắn cũ
        const data: any = await fetchHistoryMessages();
        setMessages(data);

        // Tiện thể gọi luôn API lấy source để sẵn sàng hiển thị
        const sourceData: any = await fetchSourceFiles();
        setAvailableSources(sourceData);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIC XỬ LÝ TEXTAREA (GIỮ NGUYÊN) ---
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    const style = window.getComputedStyle(el);
    const lineHeight = parseInt(style.lineHeight);
    const paddingTop = parseInt(style.paddingTop);
    const paddingBottom = parseInt(style.paddingBottom);
    const usableHeight = el.scrollHeight - paddingTop - paddingBottom;
    let rows = Math.round(usableHeight / lineHeight);
    rows = Math.max(2, Math.min(6, rows));
    setRows(rows);
  };

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
  }, [rows]);

  // --- HANDLERS CHO DIALOG ---
  const handleOpenSourceDialog = () => setOpenSourceDialog(true);
  const handleCloseSourceDialog = () => setOpenSourceDialog(false);

  // Mock API gửi tin nhắn
  const sendMessageAPI = async (text: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          message: text,
          isUser: true,
        });
      }, 300);
    });
  };

  const mockBotReplyAPI = async (text: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now() + 1,
          message: "Tôi nhận được: " + text,
          isUser: false,
        });
      }, 600);
    });
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;

    setInputMessage(""); // clear input

    // 1. gửi message của user
    const newUserMessage = await sendMessageAPI(userText);

    setMessages((prev) => [...prev, newUserMessage]);

    // 2. mô phỏng API trả lời AI
    const botReply = await mockBotReplyAPI(userText);

    setMessages((prev) => [...prev, botReply]);
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

      {/* Button mở sidebar (Giữ nguyên) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
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
          }}
        />

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
              width: "800px",
              height: "95vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
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
                    overflowY: "auto",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(0,0,0,0.8)",
                    },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.5) transparent",
                  }}
                >
                  {/* Nếu không có message → hiển thị lời chào */}
                  {messages.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "10px",
                        paddingBottom: "10px",
                        color: "black",
                        opacity: 0.75,
                      }}
                    >
                      Hello, how can I help you?
                    </div>
                  ) : (
                    /* Nếu có message → render danh sách tin nhắn */
                    messages.map((msg) => (
                      <ChatBubble
                        key={msg.id}
                        message={msg.message}
                        isUser={msg.isUser}
                      />
                    ))
                  )}
                  <div ref={bottomRef} />
                </Box>
              </Box>
            </GlassCard>

            {/* Input Area */}
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
                  flex: 1, // Đổi width: 100% thành flex: 1 để nhường chỗ cho nút Source
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
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.5) transparent",
                  },
                  "& .custom-textarea::-webkit-scrollbar": { width: "6px" },
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
                  onChange={(e) => {
                    handleChange(e);
                    setInputMessage(e.target.value);
                  }}
                  value={inputMessage}
                  className="custom-textarea"
                  minRows={2}
                  maxRows={6}
                  placeholder="Nhập tin nhắn..."
                />
              </Box>

              {/* --- NÚT SELECT SOURCE --- */}
              <GlassCard>
                <Box
                  onClick={handleOpenSourceDialog}
                  sx={{
                    height: "100%",
                    padding: "12px",
                    cursor: "pointer",
                    borderRadius: "14px",
                    backdropFilter: "blur(15px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50px", // Cân đối với textarea
                  }}
                >
                  <SourceIcon sx={{ color: "black", fontSize: 28 }} />
                </Box>
              </GlassCard>

              {/* Nút Gửi */}
              <GlassCard>
                <Box
                  onClick={handleSend}
                  sx={{
                    padding: "12px 20px",
                    cursor: "pointer",
                    borderRadius: "14px",
                    backdropFilter: "blur(15px)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "50px",
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

      {/* --- DIALOG CHỌN SOURCE --- */}
      <Dialog
        open={openSourceDialog}
        onClose={handleCloseSourceDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          Chọn nguồn dữ liệu
          <IconButton onClick={handleCloseSourceDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Ô tìm kiếm */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm Note hoặc Source..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, mt: 1 }}
          />

          {/* Phần Notes */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Notes
            </Typography>
            <Box
              sx={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "8px",
              }}
            >
              <List dense>
                {availableSources.notes.length > 0 ? (
                  availableSources.notes.map((note) => (
                    <ListItem key={note.id}>
                      <ListItemButton>
                        <ListItemIcon sx={{ minWidth: "35px" }}>
                          <DescriptionIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.title}
                          secondary={note.date}
                          primaryTypographyProps={{ fontSize: "0.95rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Không có ghi chú nào." />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Phần Sources */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "secondary.main", mb: 1 }}
            >
              Source Files
            </Typography>
            <Box
              sx={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: "8px",
              }}
            >
              <List dense>
                {availableSources.sources.length > 0 ? (
                  availableSources.sources.map((src) => (
                    <ListItem key={src.id}>
                      <ListItemButton>
                        <ListItemIcon sx={{ minWidth: "35px" }}>
                          <ArticleIcon color="action" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={src.title}
                          secondary={src.type}
                          primaryTypographyProps={{ fontSize: "0.95rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Không có source nào." />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Chat;
