"use client";

import React from "react";
import { useState } from "react";
import { Box, TextField } from "@mui/material";
import { GlassCard } from "@developer-hub/liquid-glass";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"; // style highlight
// Style chung cho Glassmorphism
const glassmorphismStyle = {
  // backgroundColor: 'rgba(2, 83, 104, 0.5)', // Màu xanh mòng két (teal) trong suốt
  // backgroundColor: 'rgba(25, 55, 90, 0.5)',
  background:
    "linear-gradient(180deg, rgba(17,51,32,0.6), rgba(38,141,124,0.6), rgba(194,255,180,0.6))",

  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  borderRadius: "15px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const TextEditor = () => {
  const [value, setValue] = useState("");
  return (
    // <GlassCard cornerRadius={50}>
    <Box
      sx={{
        ...glassmorphismStyle,
        background: `linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.6),
          rgba(255, 255, 255, 0.8),
          rgba(245, 245, 245, 0.45)
        )`,

        width: { xs: "90vw", md: "50vw" }, // Responsive
        height: "90vh",
        padding: "24px",
        boxSizing: "border-box",
        display: "flex", // Sử dụng flex để TextField lấp đầy
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          bgcolor: "white",
          p: 2,
          borderRadius: 2,
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Lớp Markdown highlight */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: 2,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "black",
            pointerEvents: "none", // Không cho click
            overflowY: "auto",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {value || "Bắt đầu ghi chú..."}
          </ReactMarkdown>
        </Box>

        {/* Lớp textarea gõ chữ */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            padding: "16px",
            width: "100%",
            height: "100%",
            resize: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "black", // chữ trong suốt
            caretColor: "black", // chỉ hiện con trỏ
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            lineHeight: "1.5",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        />
      </Box>
    </Box>
    // </GlassCard>
  );
};

export default TextEditor;
