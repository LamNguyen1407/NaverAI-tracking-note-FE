"use client";

import React, { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";

import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { GlassCard } from "@developer-hub/liquid-glass";
import { ca } from "zod/v4/locales";
import { toast } from "react-toastify";
import { useFileStore } from "@/stores/fileStore";

const SIDEBAR_BG_URL = "/assets/jellyfish.png";
const SIDEBAR_WIDTH = 280;

const glassmorphismStyle = {
  backgroundColor: "rgba(1, 62, 106, 0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "12px",
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  current?: string;
}

interface FileMeta {
  file_name: string;
  size: number;
  last_modified: string;
  etag: string;
  preview_url: string;
}

// const mockData: Record<string, string[]> = {
//   Note: ["Ghi chú 1", "Ghi chú 2", "Ghi chú 3", "Ghi chú 4"],
//   Files: ["File A", "File B", "File C"],
//   Chat: ["Chat 1", "Chat 2"],
// };

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {


  const [tab, setTab] = useState<"Note" | "Files" | "Chat">("Note");
  const [selectedNote, setSelectedNote] = useState<FileMeta | null>(null);
  const [notes, setNotes] = useState<FileMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const router = useRouter();
  const pathname = usePathname();

  const triggerReload = useFileStore((state) => state.triggerReload);

  const handleLogout = () => {
    router.push("/login");
  };

  const handleClick = (file: FileMeta) => {
    setSelectedNote(file);
    router.push(`/content/editor/${file.etag}`);
  }

  const handleCreateNote = () => {
    router.push("/content/editor");
  }

  const handleUploadFile = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*/*";

  input.multiple = false;

  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Kiểm tra extension
    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop()?.toLowerCase();

    // Kiểm tra MIME type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!ext || !allowedExtensions.includes(ext) || !allowedTypes.includes(file.type)) {
      toast.error("Chỉ được upload file PDF hoặc DOC/DOCX");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/files/upload/document`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      toast.success(data.message || "Upload successful!");
      triggerReload();
    } catch (error: any) {
      console.log(error);
      toast.error(error.details || error.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  input.click();
};


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/files/metadata/note`
        );
        const json = await res.json();

        setNotes(json.files); // ❗ lưu full metadata
      } catch (e) {
        console.error("Failed to fetch note metadata", e);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    switch (pathname) {
      case "/content/editor":
        setTab("Note");
        break;
      case "/content/files":
        setTab("Files");
        break;
      case "/content/chat":
        setTab("Chat");
        break;
    }
  },[pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          borderRadius: "50px",
          height: "97vh",
          margin: "1.5vh auto",
          marginLeft: "0.5vw",
          background: `
            // url(${SIDEBAR_BG_URL}),
            transparent
          `,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          // backdropFilter: "blur(15px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          boxSizing: "border-box",
          boxShadow: "none",
          overflow: "hidden",
        },
      }}
    >
      <GlassCard>
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            borderRadius: "50px",
            height: "97vh",

            // margin: "1.5vh auto",
            // marginLeft: "0.5vw",

            // boxSizing: "border-box",
            // boxShadow: "none",
            background: `
              url(${SIDEBAR_BG_URL}),
              transparent
            `,
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
            backgroundRepeat: "no-repeat, no-repeat",

            overflow: "hiddent",
          }}
        >
          <Box sx={{ padding: 2, overflow: "auto" }}>
            <Typography
              variant="h6"
              sx={{ color: "white", mb: 2, textAlign: "center" }}
            >
              Menu
            </Typography>

            {/* Tabs category */}
            <Tabs
              value={tab}
              onChange={(e, v) => {
                setTab(v);

                const target =
                  v === "Note"
                    ? "/content/editor"
                    : v === "Files"
                    ? "/content/files"
                    : "/content/chat";

                // ⚡ Check nếu đang ở trang đó rồi thì không chuyển
                if (pathname !== target) router.push(target as any);
              }}
              TabIndicatorProps={{ style: { backgroundColor: "black" } }}
              sx={{
                mb: 2,
                ".MuiTab-root": {
                  color: "white",
                  fontWeight: 600,
                  transition: "0.25s ease",
                  borderRadius: "10px",
                  minHeight: "25px",
                  padding: "4px 0",
                  marginRight: "2px",
                  backgroundColor: "rgba(10, 35, 25, 0.6)",
                  minWidth: "81px",
                  fontSize: "10px",
                },
                ".MuiTab-root.Mui-selected": {
                  color: "black",
                  backgroundColor: "rgba(80, 200, 220, 0.55)",
                  backdropFilter: "blur(4px)",
                },
              }}
            >
              <Tab
                icon={<NoteOutlinedIcon sx={{ fontSize: 20 }} />}
                iconPosition="top"
                label="Note"
                value="Note"
              />
              <Tab
                icon={<FolderOutlinedIcon sx={{ fontSize: 20 }} />}
                iconPosition="top"
                label="Files"
                value="Files"
              />
              <Tab
                icon={<ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />}
                iconPosition="top"
                label="Chat"
                value="Chat"
              />
            </Tabs>

            {/* Nội dung thay đổi theo tab */}
              {/* Note List */}
                <List>
                  {tab === "Note" && 
                  <Button 
                        onClick={() => handleCreateNote()}
                        startIcon={<NoteAltIcon sx={{ fontSize: 22 }} />}
                        sx={{
                          width: "100%",
                          padding: "12px 16px",
                          marginBottom: "20px",
                          backgroundColor: "rgba(1, 62, 106, 0.6)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          borderRadius: "12px",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "14px",
                          textTransform: "none",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          "&:hover": {
                            backgroundColor: "rgba(67, 209, 255, 0.5)",
                            border: "1px solid rgba(67, 209, 255, 0.8)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 16px rgba(67, 209, 255, 0.3)",
                          },
                          "&:active": {
                            transform: "translateY(0px)",
                          },
                        }}
                      >
                        Create Note
                      </Button>
                  }
                  {tab === "Note" && 
                  notes.map((item , index ) => (
                    <ListItemButton
                      className={selectedNote?.etag === item.etag ? "selected" : ""}
                      onClick={() => handleClick(item)}
                      key={index}
                      sx={{
                        ...glassmorphismStyle,
                        marginBottom: "10px",
                        "&:hover": {
                          backgroundColor: "rgba(67, 209, 255, 0.4)",
                        },
                        "&:hover .MuiListItemText-primary": {
                          color: "black", // đổi màu chữ khi hover
                        },
                      }}
                    >
                      <ListItemText primary={item.file_name} sx={{ color: "white" }} />
                    </ListItemButton>
                  ))}

                    {tab === "Files" && 
                      <Button 
                        onClick={() => handleUploadFile()}
                        startIcon={<CloudUploadIcon sx={{ fontSize: 22 }} />}
                        disabled={isLoading}
                        sx={{
                          width: "100%",
                          padding: "12px 16px",
                          marginBottom: "10px",
                          backgroundColor: isLoading 
                            ? "rgba(255,255,255,0.3)" 
                            : "rgba(1, 62, 106, 0.6)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          borderRadius: "12px",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "14px",
                          textTransform: "none",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          "&:hover": {
                            backgroundColor: "rgba(67, 209, 255, 0.5)",
                            border: "1px solid rgba(67, 209, 255, 0.8)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 16px rgba(67, 209, 255, 0.3)",
                          },
                          "&:active": {
                            transform: "translateY(0px)",
                          },
                        }}
                      >
                        {isLoading ? "Đang upload..." : "Upload File"}
                      </Button>
                    }
                </List>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              padding: "10px 16px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.2,
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "rgba(255,255,255,0.28)",
              },
            }}
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
            Đăng xuất
          </Box>
        </Box>
      </GlassCard>
    </Drawer>
  );
};

export default Sidebar;
