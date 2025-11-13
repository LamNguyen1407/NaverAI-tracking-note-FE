"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

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

const mockData: Record<string, string[]> = {
  Note: ["Ghi chú 1", "Ghi chú 2", "Ghi chú 3", "Ghi chú 4"],
  Files: ["File A", "File B", "File C"],
  Chat: ["Chat 1", "Chat 2"],
};

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, current }) => {
  const [tab, setTab] = useState(current || "Note");

  const router = useRouter();
  const pathname = usePathname();
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
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          backdropFilter: "blur(15px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          boxSizing: "border-box",
          boxShadow: "none",
        },
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
        <List>
          {mockData[tab].map((item, index) => (
            <ListItemButton
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
              <ListItemText primary={item} sx={{ color: "white" }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
