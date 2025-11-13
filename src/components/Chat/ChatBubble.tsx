"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  visible?: boolean;
}

import { GlassCard } from "@developer-hub/liquid-glass";
export default function ChatBubble({
  message,
  isUser,
  visible,
}: ChatBubbleProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          minWidth: "30%",
          maxWidth: "70%",
          px: 2,
          py: 1.5,
          borderRadius: "16px",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          color: "black",
        }}
      >
        <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.4 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
