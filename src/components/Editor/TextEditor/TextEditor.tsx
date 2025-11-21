"use client";

import React, { useState, useRef, useEffect } from "react";
// Import thêm các component UI để làm Sidebar đẹp
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import "@mdxeditor/editor/style.css";
import "./editorStyles.css";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  Separator,
} from "@mdxeditor/editor";
import { GlassCard } from "@developer-hub/liquid-glass";
import { initialMarkdown } from "./initialMarkdown";

// --- Types ---
interface VerificationResult {
  id: string; // ID duy nhất cho mỗi lỗi (dùng timestamp hoặc chunkIndex)
  chunkIndex: number | "manual"; // 'manual' nếu chọn tay, number nếu auto
  status: "loading" | "conflict" | "safe";
  message: string;
  timestamp: string;
}

// --- HÀM HASH ---
const generateHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

const BLOCK_SIZE = 5;

const TextEditor = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  // ⭐ STATE MỚI: Danh sách kết quả bên Sidebar
  const [results, setResults] = useState<VerificationResult[]>([]);

  const chunkHashMap = useRef(new Map<number, number>());
  const isMountedRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    // Init Hash Logic (Giữ nguyên)
    const lines = initialMarkdown.split("\n");
    const nonEmptyLineIndices = lines
      .map((line, index) => ({ text: line, originalIndex: index }))
      .filter((item) => item.text.trim().length > 0);
    const initialChunks = Math.floor(nonEmptyLineIndices.length / BLOCK_SIZE);
    for (let i = 0; i < initialChunks; i++) {
      const start = i * BLOCK_SIZE;
      const end = start + BLOCK_SIZE;
      const realStart = nonEmptyLineIndices[start].originalIndex;
      const realEnd = nonEmptyLineIndices[end - 1].originalIndex;
      const chunkContent = lines.slice(realStart, realEnd + 1).join("\n");
      chunkHashMap.current.set(i, generateHash(chunkContent));
    }
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  const handleEditorChange = (newMarkdown: string) => {
    if (!isMountedRef.current) return;
    setMarkdown(newMarkdown);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      processChunks(newMarkdown);
    }, 1000); // Tăng debounce lên 1s để đỡ spam sidebar
  };

  const processChunks = (content: string) => {
    const lines = content.split("\n");
    const nonEmptyLineIndices = lines
      .map((line, index) => ({ text: line, originalIndex: index }))
      .filter((item) => item.text.trim().length > 0);
    const fullChunksCount = Math.floor(nonEmptyLineIndices.length / BLOCK_SIZE);

    for (let i = 0; i < fullChunksCount; i++) {
      const chunkIndex = i;
      const startBlockIndex = chunkIndex * BLOCK_SIZE;
      const endBlockIndex = startBlockIndex + BLOCK_SIZE;

      if (endBlockIndex <= nonEmptyLineIndices.length) {
        const realStartIndex =
          nonEmptyLineIndices[startBlockIndex].originalIndex;
        const realEndIndex =
          nonEmptyLineIndices[endBlockIndex - 1].originalIndex;
        const chunkContent = lines
          .slice(realStartIndex, realEndIndex + 1)
          .join("\n");

        const currentHash = generateHash(chunkContent);
        const prevHash = chunkHashMap.current.get(chunkIndex);

        if (prevHash !== currentHash) {
          // CALL API AUTO
          simulateApiCall(chunkIndex, chunkContent);
          chunkHashMap.current.set(chunkIndex, currentHash);
        }
      }
    }
  };

  // --- XỬ LÝ GỌI API & HIỂN THỊ SIDEBAR ---

  const simulateApiCall = (chunkIndex: number | "manual", content: string) => {
    const newId = Date.now().toString() + Math.random();

    // 1. Tạo item trạng thái "Loading"
    const newItem: VerificationResult = {
      id: newId,
      chunkIndex: chunkIndex,
      status: "loading",
      message:
        chunkIndex === "manual"
          ? `Checking selection (${content.length} chars)...`
          : `Analyzing Chunk #${chunkIndex + 1}...`,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Đưa lên đầu danh sách
    setResults((prev) => [newItem, ...prev]);

    // 2. Giả lập gọi API (sau 2 giây trả kết quả)
    setTimeout(() => {
      // Random kết quả Conflict hoặc Safe để test UI
      const isConflict = Math.random() > 0.5;

      setResults((prev) =>
        prev.map((item) => {
          if (item.id === newId) {
            return {
              ...item,
              status: isConflict ? "conflict" : "safe",
              message: isConflict
                ? `Found conflict with Source Document A (Page 12). Content mismatch detected.`
                : `Content verifies successfully with KB.`,
            };
          }
          return item;
        })
      );
    }, 2000);
  };

  const handleCheckSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";
    if (!selectedText || selectedText.trim() === "") {
      alert("Please select some text first!");
      return;
    }
    simulateApiCall("manual", selectedText);
  };

  // Hàm xóa thông báo
  const dismissResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "none",
      }}
    >
      {/* CHIA LAYOUT: FLEX ROW */}
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.18)",
          width: { xs: "90vw", md: "80vw" }, // Tăng chiều rộng lên chút để chứa sidebar
          height: "90vh",
          display: "flex", // ⭐ Layout Flex
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* --- PHẦN 1: EDITOR (BÊN TRÁI - 70%) --- */}
        <Box
          sx={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRight: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          {/* Nút Manual Check */}
          <Box sx={{ position: "absolute", top: 15, right: 15, zIndex: 100 }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleCheckSelection}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backdropFilter: "blur(4px)",
                background: "rgba(25, 118, 210, 0.9)",
              }}
            >
              Check Selection
            </Button>
          </Box>

          <div
            style={{
              flex: 1,
              overflow: "auto",
              marginTop: "50px",
              padding: "0 10px",
            }}
          >
            <MDXEditor
              markdown={markdown}
              onChange={handleEditorChange}
              contentEditableClassName="mdxeditor-content zebra-striping"
              spellCheck={false}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                tablePlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo /> <Separator /> <BoldItalicUnderlineToggles />{" "}
                      <Separator />
                      <BlockTypeSelect /> <Separator /> <ListsToggle />{" "}
                      <Separator />
                      <CreateLink /> <Separator /> <InsertTable />
                    </>
                  ),
                }),
              ]}
            />
          </div>
        </Box>

        {/* --- PHẦN 2: SIDEBAR REVIEW (BÊN PHẢI - 30%) --- */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            background: "rgba(245, 247, 250, 0.5)", // Màu nền nhẹ cho sidebar
            borderLeft: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {/* Header Sidebar */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon color="action" />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.secondary"
            >
              AI Analysis Log
            </Typography>
          </Box>

          {/* List Kết quả (Scrollable) */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "2px",
              },
            }}
          >
            {results.length === 0 && (
              <Typography
                variant="body2"
                color="text.disabled"
                textAlign="center"
                sx={{ mt: 4 }}
              >
                No issues detected yet.
                <br />
                Start typing or select text to check.
              </Typography>
            )}

            {results.map((res) => (
              <Card
                key={res.id}
                sx={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid",
                  borderColor:
                    res.status === "conflict" ? "#ffcdd2" : "transparent",
                  backgroundColor:
                    res.status === "loading"
                      ? "rgba(255,255,255,0.8)"
                      : "white",
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: "12px !important" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={
                        res.chunkIndex === "manual"
                          ? "Manual"
                          : `Chunk #${Number(res.chunkIndex) + 1}`
                      }
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "10px", height: "20px" }}
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="caption" color="text.disabled">
                        {res.timestamp}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => dismissResult(res.id)}
                        sx={{ p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {res.status === "loading" && <CircularProgress size={16} />}
                    {res.status === "conflict" && (
                      <WarningAmberIcon color="error" fontSize="small" />
                    )}
                    {res.status === "safe" && (
                      <CheckCircleOutlineIcon
                        color="success"
                        fontSize="small"
                      />
                    )}

                    <Typography
                      variant="body2"
                      fontWeight={res.status === "loading" ? 400 : 600}
                      sx={{ lineHeight: 1.3, fontSize: "0.85rem" }}
                    >
                      {res.message}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
      </Box>
  );
};

export default TextEditor;
