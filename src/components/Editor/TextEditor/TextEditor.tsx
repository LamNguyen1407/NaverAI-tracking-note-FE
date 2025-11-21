"use client";

import React, { useState } from "react";
// Import UI Components
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
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

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
// import { GlassCard } from "@developer-hub/liquid-glass";
import { initialMarkdown } from "./initialMarkdown";

// --- Types cho Mock Data ---
interface VerificationResult {
  id: string;
  type: "manual";
  status: "loading" | "conflict" | "safe";
  message: string;
  selectedTextPreview?: string;
  timestamp: string;

  rawText?: string; // nội dung người dùng select (để hiển thị row 2)
  sources?: string[]; // danh sách nguồn API trả về
  expanded?: boolean; // state để toggle mở/đóng
}

const TextEditor = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [showSidebar, setShowSidebar] = useState(true);
  // State lưu danh sách kết quả Mock
  const [results, setResults] = useState<VerificationResult[]>([]);

  const handleEditorChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  // --- LOGIC 1: Giả lập gọi API tạo Mock Data ---
  const simulateApiCall = (text: string) => {
    const newId = Date.now().toString();

    const newItem: VerificationResult = {
      id: newId,
      type: "manual",
      status: "loading",
      message: `Analyzing selection (${text.length} chars)...`,
      selectedTextPreview:
        text.substring(0, 20) + (text.length > 20 ? "..." : ""),
      rawText: text, // lưu bản gốc để hiển thị row 2
      timestamp: new Date().toLocaleTimeString(),
      expanded: false, // default đóng
      sources: [],
    };

    setResults((prev) => [newItem, ...prev]);

    setTimeout(() => {
      const isConflict = Math.random() > 0.5;

      setResults((prev) =>
        prev.map((item) =>
          item.id === newId
            ? {
                ...item,
                status: isConflict ? "conflict" : "safe",
                message: isConflict
                  ? `Ambiguous content found.`
                  : `Content verified successfully.`,
                sources: isConflict
                  ? [
                      "Policy 12.4 — Misinformation Clause: Điều khoản này nhấn mạnh rằng những nội dung có khả năng gây hiểu nhầm hoặc được diễn giải sai theo ngữ cảnh phải được kiểm duyệt cẩn thận. Quy tắc này được áp dụng đặc biệt với các cụm từ dễ mang nhiều lớp nghĩa, có thể dẫn đến hiểu lầm trong môi trường chính sách hoặc pháp lý.",

                      "Rule 8 — Sensitive Variants: Quy định này mô tả các biến thể ngôn ngữ nhạy cảm, bao gồm từ, cụm từ, hoặc cấu trúc câu có khả năng bị hiểu theo hướng tiêu cực hoặc nguy hiểm. Những biến thể này phải được đánh giá dựa trên ngữ cảnh sử dụng và khả năng gây ra ảnh hưởng tiêu cực.",

                      "Matched Phrase: “danger zone”: Cụm từ này thường được xem là mơ hồ trong những tài liệu phân tích rủi ro hoặc cảnh báo an toàn. Tùy theo bối cảnh, 'danger zone' có thể ám chỉ khu vực vật lý nguy hiểm, trạng thái rủi ro chính trị, hoặc điều kiện không an toàn. Vì vậy, hệ thống đánh dấu nó như một cụm từ cần xem xét thêm khi đánh giá nội dung.",
                    ]
                  : [],
              }
            : item
        )
      );
    }, 1500);
  };

  const shortenText = (text: string) => {
    if (!text) return "";

    // Nếu text ngắn thì giữ nguyên
    if (text.length < 200) return text;

    // Lấy đoạn đầu (100–180 ký tự)
    const start = text.slice(0, 160).trim();

    // Lấy đoạn cuối (50–80 ký tự)
    const end = text.slice(-80).trim();

    return `${start}     ··· ··· ···     ${end}`;
  };

  // --- LOGIC 2: Xử lý nút "Check Selection" ---
  const handleCheckSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : "";

    if (!selectedText || selectedText.trim() === "") {
      alert("Please select some text first!");
      return;
    }
    simulateApiCall(selectedText);
  };

  // Hàm xóa card
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
          // background:
          //   "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
          // borderRadius: "15px",
          // border: "1px solid rgba(255,255,255,0.18)",

          background:
            "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.5), rgba(255,255,255,0.3))",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",

          width: { xs: "80vw", md: "70vw" },
          height: "90vh",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* --- PHẦN 1: EDITOR (70%) --- */}
        <Box
          sx={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Nút Manual Check & Toggle Sidebar */}
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 15,
              zIndex: 100,
              display: "flex",
              gap: 1,
            }}
          >
            {/* Nút Check Selection cũ giữ nguyên ở đây */}
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
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                borderRadius: "15px",
                "&:hover": {
                  background: "rgba(21, 101, 192, 1)",
                },
              }}
            >
              Check Selection
            </Button>

            {/* --- THÊM NÚT TOGGLE SIDEBAR TẠI ĐÂY --- */}
            <IconButton
              onClick={() => setShowSidebar(!showSidebar)}
              sx={{
                background: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(4px)",
                transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.3s",
                height: 30,
                width: 30,
              }}
            >
              <MenuOpenIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              marginTop: "50px",
              padding: "0 10px",

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
          </Box>
        </Box>

        {/* --- PHẦN 2: SIDEBAR REVIEW (30%) --- */}
        <Box
          sx={{
            width: showSidebar ? "30%" : "0px",
            transition: "width 0.3s ease",
            overflow: "hidden",
            height: "90%",
            marginX: showSidebar ? "15px" : "0px",
            marginY: "auto",
            borderRadius: showSidebar ? "20px" : "0px",

            background: "rgba(255, 255, 255, 0.15)",
            // backdropFilter: "blur(0.5px)",
            WebkitBackdropFilter: "blur(2px)",
            border: showSidebar ? "1px solid rgba(255,255,255,0.22)" : "none",
            boxShadow: "0 6px 24px rgba(0,0,0,0.08)",

            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0, // để header luôn cố định
            }}
          >
            <SmartToyIcon color="action" />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.primary"
            >
              AI Analysis Log
            </Typography>
          </Box>

          {/* LAYER 2 — Nội dung sidebar (scroll) */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto", // CHỈ LAYER NÀY SCROLL
              display: "flex",
              flexDirection: "column",

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
            {/* Header Sidebar */}

            {/* List Kết quả */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
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
                  Select text and click "Check Selection".
                </Typography>
              )}

              {results.map((res) => (
                <Card
                  key={res.id}
                  sx={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",

                    borderColor:
                      res.status === "conflict"
                        ? "rgba(255, 80, 80, 0.35)"
                        : "rgba(255, 255, 255, 0.18)",

                    "&:hover": {
                      background: "rgba(255,255,255,0.10)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardContent sx={{ p: "12px !important" }}>
                    {/* Hàng 1: Icon + Reason */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {res.status === "loading" && (
                        <CircularProgress size={16} />
                      )}
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
                      >
                        {res.message}
                      </Typography>
                    </Box>

                    {/* Hàng 2: rút gọn nội dung gốc */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.78rem",
                        color: "text.secondary",
                        mb: 1,
                        pl: 3.6, // thụt vào cho thẳng hàng icon phía trên
                      }}
                    >
                      {shortenText(res.rawText || "")}
                    </Typography>

                    {/* Nút Toggle sources */}
                    {res.sources && res.sources.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() =>
                            setResults((prev) =>
                              prev.map((item) =>
                                item.id === res.id
                                  ? { ...item, expanded: !item.expanded }
                                  : item
                              )
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: "0.75rem",
                            opacity: 0.8,
                          }}
                        >
                          {res.expanded ? "Hide sources ▲" : "Show sources ▼"}
                        </Button>
                      </Box>
                    )}

                    {/* Hàng 3: List nguồn đối chứng */}
                    {res.expanded && (
                      <Box
                        sx={{
                          mt: 1,
                          pl: 4,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.7,
                        }}
                      >
                        {res.sources?.map((src, i) => (
                          <Typography
                            key={i}
                            variant="body2"
                            sx={{
                              fontSize: "0.75rem",
                              opacity: 0.9,
                            }}
                          >
                            • {src}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TextEditor;
