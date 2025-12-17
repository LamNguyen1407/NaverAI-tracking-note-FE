"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { GlassCard } from "@developer-hub/liquid-glass";
import { TbSend } from "react-icons/tb";
import SourceIcon from "@mui/icons-material/Source";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import ChatBubble from "@/components/Chat/ChatBubble";
import { useSidebar } from "@/context/SidebarContext";

const MENU_ICON_URL = "/assets/starfish.png";
const MAIN_BG_URL = "/assets/chat2.png";

type ApiChatMsg = {
  id: string;
  type: "human" | "ai";
  content: string;
  timestamp: any;
};

type UiMsg = {
  id: string;
  message: string;
  isUser: boolean;
};

const STORAGE_SESSION_KEY = "chat_session_id";
const STORAGE_NOTEBOOK_KEY = "notebook_id"; // bạn đang dùng sẵn ở fetchSourcesAndNotes
const STORAGE_MESSAGES_PREFIX = "chat_messages_";

const fetchSourcesAndNotes = async () => {
  const notebook_id = localStorage.getItem(STORAGE_NOTEBOOK_KEY);
  if (!notebook_id) throw new Error("Missing notebook_id");

  const [sourcesRes, notesRes] = await Promise.all([
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_NOTEBOOK
      }/api/sources?notebook_id=${encodeURIComponent(
        notebook_id
      )}&limit=50&offset=0&sort_by=updated&sort_order=desc`,
      { headers: { accept: "application/json" } }
    ),
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_NOTEBOOK
      }/api/notes?notebook_id=${encodeURIComponent(notebook_id)}`,
      { headers: { accept: "application/json" } }
    ),
  ]);

  if (!sourcesRes.ok || !notesRes.ok) {
    throw new Error("Failed to fetch sources or notes");
  }

  const sources = await sourcesRes.json();
  const notes = await notesRes.json();

  return { sources, notes };
};

function mapApiMessages(apiMessages: ApiChatMsg[]): UiMsg[] {
  return apiMessages.map((m) => ({
    id: m.id,
    message: m.content ?? "",
    isUser: m.type === "human",
  }));
}

function Chat() {
  const { toggleSidebar } = useSidebar();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [rows, setRows] = useState(2);
  const [maxHeight, setMaxHeight] = useState("40rem");

  const [inputMessage, setInputMessage] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [openSourceDialog, setOpenSourceDialog] = useState(false);
  const [availableSources, setAvailableSources] = useState<{
    notes: any[];
    sources: any[];
  }>({ notes: [], sources: [] });

  const [searchQuery, setSearchQuery] = useState("");

  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<UiMsg[]>([]);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    severity: "success" | "info" | "warning" | "error";
    message: string;
  }>({ open: false, severity: "info", message: "" });

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableSources.notes;
    return availableSources.notes.filter(
      (n) =>
        (n?.title ?? "").toLowerCase().includes(q) ||
        (n?.created ?? "").toLowerCase().includes(q)
    );
  }, [availableSources.notes, searchQuery]);

  const filteredSources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return availableSources.sources;
    return availableSources.sources.filter((s) => {
      const title = (s?.title ?? "").toLowerCase();
      const path = (s?.asset?.file_path ?? "").toLowerCase();
      const url = (s?.asset?.url ?? "").toLowerCase();
      return title.includes(q) || path.includes(q) || url.includes(q);
    });
  }, [availableSources.sources, searchQuery]);

  const createNewChatSession = async (): Promise<string> => {
    const DEFAULT_SESSION = "chat_session:30wpa839l1ljs289fnwf";

    try {
      const notebooks = [
        "notebook:vs1gylamwxphz18rjc53",
        "notebook:c37uf28s3x8t7k2uqw8l",
      ];

      const randomIndex = Math.floor(Math.random() * notebooks.length);
      const notebook_id = notebooks[randomIndex];
      const title = `Chat session - notebook ${randomIndex + 1}`;

      const payload = { notebook_id, title };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/chat/sessions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data?.id) return data.id;
      return DEFAULT_SESSION;
    } catch (err) {
      console.error("Error creating chat session:", err);
      return DEFAULT_SESSION;
    }
  };

  // (1) Giữ nguyên session cho tới khi logout: lấy từ localStorage, nếu chưa có thì tạo 1 lần.
  useEffect(() => {
    const init = async () => {
      try {
        setIsBootLoading(true);

        let sid = localStorage.getItem(STORAGE_SESSION_KEY) || "";
        if (!sid) {
          sid = await createNewChatSession();
          localStorage.setItem(STORAGE_SESSION_KEY, sid);
        }
        setSessionId(sid);

        // restore messages theo session (giữ chat khi refresh)
        const cached = localStorage.getItem(`${STORAGE_MESSAGES_PREFIX}${sid}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as UiMsg[];
            setMessages(Array.isArray(parsed) ? parsed : []);
          } catch {
            setMessages([]);
          }
        } else {
          setMessages([]);
        }

        const sourceData = await fetchSourcesAndNotes();
        setAvailableSources({
          sources: sourceData.sources,
          notes: sourceData.notes,
        });
      } catch (e) {
        console.error(e);
        setToast({
          open: true,
          severity: "error",
          message: "Không tải được dữ liệu ban đầu.",
        });
      } finally {
        setIsBootLoading(false);
      }
    };

    init();
  }, []);

  // persist messages theo session
  useEffect(() => {
    if (!sessionId) return;
    localStorage.setItem(
      `${STORAGE_MESSAGES_PREFIX}${sessionId}`,
      JSON.stringify(messages)
    );
  }, [messages, sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    const style = window.getComputedStyle(el);
    const lineHeight = parseInt(style.lineHeight);
    const paddingTop = parseInt(style.paddingTop);
    const paddingBottom = parseInt(style.paddingBottom);
    const usableHeight = el.scrollHeight - paddingTop - paddingBottom;
    let r = Math.round(usableHeight / lineHeight);
    r = Math.max(2, Math.min(6, r));
    setRows(r);
  };

  const calcMaxHeight = (r: number): string => {
    if (r <= 2) return "40rem";
    if (r === 3) return "39rem";
    if (r === 4) return "38rem";
    if (r === 5) return "36rem";
    return "35rem";
  };

  useEffect(() => {
    setMaxHeight(calcMaxHeight(rows));
  }, [rows]);

  const handleOpenSourceDialog = () => setOpenSourceDialog(true);
  const handleCloseSourceDialog = () => setOpenSourceDialog(false);

  // (3) Send thật: append human -> gọi /execute -> render messages trả về, có loading + error
  const handleSend = async () => {
    const text = inputMessage.trim();
    if (!text) {
      setToast({
        open: true,
        severity: "warning",
        message: "Không được gửi tin nhắn rỗng.",
      });
      return;
    }
    if (!sessionId) {
      setToast({
        open: true,
        severity: "error",
        message: "Chưa có session chat.",
      });
      return;
    }
    if (isSending) return;

    setInputMessage("");

    // optimistic UI: thêm message của user ngay
    const optimistic: UiMsg = {
      id: `local-${Date.now()}`,
      message: text,
      isUser: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setIsSending(true);

    const sourceIds = selectedIds
      .filter((id) => id.startsWith("source:"))
      .map((id) => ({ id }));
    const noteIds = selectedIds
      .filter((id) => id.startsWith("note:"))
      .map((id) => ({ id }));

    const payload = {
      session_id: sessionId,
      message: text,
      context: { sources: sourceIds, notes: noteIds },
      model_override: "model:kv3pmgczupuc15whfoe8",
    };

    try {
      console.log(
        "Chat Screen: Sending message payload:",
        JSON.stringify(payload)
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_NOTEBOOK}/api/chat/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        setToast({
          open: true,
          severity: "error",
          message:
            "Có lỗi xảy ra với server (API AI đã hết quota. Vui lòng thử lại sau hoặc đổi model)",
        });
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Chat Screen: Received response data:", JSON.stringify(data));
      // nếu backend trả session_id (có thể giống) thì sync lại
      if (data?.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem(STORAGE_SESSION_KEY, data.session_id);
      }

      // render “real conversation” theo response: { messages: [...] }
      if (Array.isArray(data?.messages)) {
        setMessages(mapApiMessages(data.messages as ApiChatMsg[]));
      } else {
        // fallback: giữ optimistic
        setToast({
          open: true,
          severity: "warning",
          message: "API không trả về danh sách messages.",
        });
      }
    } catch (err) {
      console.error("Send message error:", err);
      setToast({
        open: true,
        severity: "error",
        message:
          "Gửi tin nhắn thất bại. (API AI đã hết quota, vui lòng thử lại sau hoặc đổi model)",
      });
    } finally {
      setIsSending(false);
    }
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
                  minHeight: "75vh",
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
                    maxHeight: "75vh",
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
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.5) transparent",
                  }}
                >
                  {isBootLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                        color: "black",
                        opacity: 0.75,
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={18} />
                      <span>Đang tải…</span>
                    </Box>
                  ) : messages.length === 0 ? (
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
                    messages.map((msg) => (
                      <ChatBubble
                        key={msg.id}
                        message={msg.message}
                        isUser={msg.isUser}
                      />
                    ))
                  )}

                  {isSending && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} />
                      <ChatBubble message="AI đang trả lời…" isUser={false} />
                    </Box>
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
                  flex: 1,
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
                  disabled={isSending || isBootLoading}
                />
              </Box>

              {/* Select Source */}
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
                    minHeight: "50px",
                    transition: "transform 0.15s, filter 0.15s",
                    "&:hover": { transform: "translateY(-1px)" },
                  }}
                >
                  <SourceIcon sx={{ color: "black", fontSize: 28 }} />
                </Box>
              </GlassCard>

              {/* (2) Nút gửi có hover + chặn gửi rỗng (toast đã ở handleSend) */}
              <GlassCard>
                <Box
                  onClick={handleSend}
                  sx={{
                    padding: "12px 20px",
                    cursor:
                      isSending || isBootLoading ? "not-allowed" : "pointer",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "50px",
                    opacity: isSending || isBootLoading ? 0.6 : 1,
                    transition:
                      "transform 0.15s, box-shadow 0.15s, filter 0.15s",
                    "&:hover": {
                      transform:
                        isSending || isBootLoading
                          ? "none"
                          : "translateY(-1px)",
                      filter:
                        isSending || isBootLoading
                          ? "none"
                          : "brightness(1.05)",
                    },
                    "&:active": {
                      transform:
                        isSending || isBootLoading ? "none" : "translateY(0px)",
                    },
                  }}
                >
                  <span style={{ color: "black", fontWeight: "600" }}>
                    {isSending ? "Đang gửi" : "Gửi"}
                  </span>
                  <TbSend size={20} color="black" />
                </Box>
              </GlassCard>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Dialog chọn source */}
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

          {/* Notes */}
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
              <List dense>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <ListItem key={note.id} disablePadding>
                      <ListItemButton onClick={() => toggleSelect(note.id)}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <Checkbox checked={selectedIds.includes(note.id)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={note.title}
                          secondary={note.created}
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

          {/* Sources */}
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
              <List dense>
                {filteredSources.length > 0 ? (
                  filteredSources.map((src) => (
                    <ListItem key={src.id} disablePadding>
                      <ListItemButton onClick={() => toggleSelect(src.id)}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <Checkbox checked={selectedIds.includes(src.id)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={src.title}
                          secondary={src.asset?.file_path || src.asset?.url}
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

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Chat;
