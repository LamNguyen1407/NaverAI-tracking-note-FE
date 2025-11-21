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
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Conflict
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Improvement
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt"; // Hallucination
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// --- 1. Types definitions based on New JSON ---

interface ConflictItem {
  new_note_sentence: string;
  evidence_from_sources: string[];
  reason: string;
  suggested_rewrite: string;
}

interface ImprovementItem {
  new_note_sentence: string;
  missing_context: string;
  suggested_addition: string;
}

interface HallucinationItem {
  new_note_sentence: string;
  reason: string;
  suggested_rewrite: string;
}

interface AIResponse {
  conflicts: ConflictItem[];
  improvements: ImprovementItem[];
  hallucinations: HallucinationItem[];
  summary: string;
}

// --- 2. Unified Type for Rendering (Normalized) ---
// Để dễ map trong JSX, ta gộp 3 loại trên về 1 chuẩn chung
interface UnifiedResultItem {
  id: string;
  type: "conflict" | "improvement" | "hallucination";

  // Row 1 Data
  displayMessage: string; // Message ngắn gọn

  // Row 2 Data
  sentence: string; // new_note_sentence

  // Row 3 Data
  reason: string; // reason HOẶC missing_context

  // Row 4 Data
  suggestion: string; // suggested_rewrite HOẶC suggested_addition

  // Expandable Data
  sources?: string[]; // evidence_from_sources (chỉ conflict mới có trong mẫu)

  expanded: boolean; // State UI
}

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

// ... (Phần render bên dưới)

const TextEditor = ({ content }: any) => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [showSidebar, setShowSidebar] = useState(true);
  // State lưu danh sách kết quả Mock
  // const [results, setResults] = useState<VerificationResult[]>([]);

  const handleEditorChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  // // --- LOGIC 1: Giả lập gọi API tạo Mock Data ---
  // const simulateApiCall = (text: string) => {
  //   const newId = Date.now().toString();

  //   const newItem: VerificationResult = {
  //     id: newId,
  //     type: "manual",
  //     status: "loading",
  //     message: `Analyzing selection (${text.length} chars)...`,
  //     selectedTextPreview:
  //       text.substring(0, 20) + (text.length > 20 ? "..." : ""),
  //     rawText: text, // lưu bản gốc để hiển thị row 2
  //     timestamp: new Date().toLocaleTimeString(),
  //     expanded: false, // default đóng
  //     sources: [],
  //   };

  //   setResults((prev) => [newItem, ...prev]);

  //   setTimeout(() => {
  //     const isConflict = Math.random() > 0.5;

  //     setResults((prev) =>
  //       prev.map((item) =>
  //         item.id === newId
  //           ? {
  //               ...item,
  //               status: isConflict ? "conflict" : "safe",
  //               message: isConflict
  //                 ? `Ambiguous content found.`
  //                 : `Content verified successfully.`,
  //               sources: isConflict
  //                 ? [
  //                     "Policy 12.4 — Misinformation Clause: Điều khoản này nhấn mạnh rằng những nội dung có khả năng gây hiểu nhầm hoặc được diễn giải sai theo ngữ cảnh phải được kiểm duyệt cẩn thận. Quy tắc này được áp dụng đặc biệt với các cụm từ dễ mang nhiều lớp nghĩa, có thể dẫn đến hiểu lầm trong môi trường chính sách hoặc pháp lý.",

  //                     "Rule 8 — Sensitive Variants: Quy định này mô tả các biến thể ngôn ngữ nhạy cảm, bao gồm từ, cụm từ, hoặc cấu trúc câu có khả năng bị hiểu theo hướng tiêu cực hoặc nguy hiểm. Những biến thể này phải được đánh giá dựa trên ngữ cảnh sử dụng và khả năng gây ra ảnh hưởng tiêu cực.",

  //                     "Matched Phrase: “danger zone”: Cụm từ này thường được xem là mơ hồ trong những tài liệu phân tích rủi ro hoặc cảnh báo an toàn. Tùy theo bối cảnh, 'danger zone' có thể ám chỉ khu vực vật lý nguy hiểm, trạng thái rủi ro chính trị, hoặc điều kiện không an toàn. Vì vậy, hệ thống đánh dấu nó như một cụm từ cần xem xét thêm khi đánh giá nội dung.",
  //                   ]
  //                 : [],
  //             }
  //           : item
  //       )
  //     );
  //   }, 1500);
  // };

  const [results, setResults] = useState<UnifiedResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const simulateApiCall = ({ selectedText }: any) => {
    setLoading(true);
    setResults([]); // Clear cũ

    setTimeout(() => {
      // MOCK RESPONSE TỪ AI
      const apiResponse: AIResponse = {
        conflicts: [
          {
            new_note_sentence:
              "Bộ ba Tam đầu chế đầu tiên. Đây là một thỏa thuận bí mật giữa ba người đàn ông quyền lực nhất lúc bấy giờ: Julius Caesar, Pompey Đại đế, và Augustus.",
            evidence_from_sources: [
              "Bộ ba Tam đầu chế đầu tiên gồm Caesar, Pompey và Crassus.",
            ],
            reason:
              "Augustus không thuộc Bộ ba Tam đầu chế đầu tiên; thay vì Augustus, người là thừa kế của Caesar, một phần của liên minh là Crassus.",
            suggested_rewrite:
              "Bộ ba Tam đầu chế đầu tiên gồm Julius Caesar, Pompey Đại đế và Marcus Licinius Crassus.",
          },
          {
            new_note_sentence:
              "Augustus đã bị giết trong một trận chiến ở phía Đông, chống lại người Hy Lạp, vào khoảng năm 53 TCN.",
            evidence_from_sources: [
              "Crassus bị tiêu diệt tại Trận Carrhae (53 TCN)...",
            ],
            reason:
              "Không Augustus mà Crassus là người chết tại thời điểm này.",
            suggested_rewrite:
              "Marcus Licinius Crassus đã bị tiêu diệt tại Trận Carrhae ở phía Đông vào năm 53 TCN.",
          },
          {
            new_note_sentence:
              "Caesar được giết vào ngày Ides of March (15 tháng 3), năm 49 TCN...",
            evidence_from_sources: [
              "Caesar bị ám sát vào ngày Ides of March năm 44 TCN.",
            ],
            reason: "Năm ám sát Caesar là 44 TCN, không 49 TCN.",
            suggested_rewrite:
              "Caesar được giết vào ngày Ides of March năm 44 TCN.",
          },
        ],
        improvements: [
          {
            new_note_sentence:
              "Caesar vượt sông Rubicon cùng với quân đoàn của mình vào năm 49 TCN, nói lời 'Alea iacta est', mở đầu cuộc nội chiến chống lại Pompey.",
            missing_context:
              "Câu 'Alea iacta est' (con xúc xắc đã được gieo) là một víêt quan trọng của Caesar khi vượt sông Rubicon.",
            suggested_addition:
              "Caesar vượt sông Rubicon cùng với quân đoàn và nói lời 'Alea iacta est', mở đầu cuộc nội chiến chống lại Pompey.",
          },
        ],
        hallucinations: [
          {
            new_note_sentence:
              "Augustus là hoàng đế đầu tiên, nhưng ông ta đủ thông minh để không bao giờ tự gọi mình như vậy.",
            reason:
              "Augustus thực sự xác nhận danh hiệu 'Augustus' và 'Imperator'.",
            suggested_rewrite:
              "Augustus giữ danh hiệu 'Augustus' và 'Princeps', nhưng quyền lực thực tế của ông ta khởi đầu Đế chế La Mã.",
          },
          {
            new_note_sentence:
              "Ông ta tuyên bố từ bỏ tất cả quyền lực phi thường của mình và trao lại quyền lực cho Thượng viện và Nhân dân Rome.",
            reason:
              "Augustus giữ quyền lực thực tế thông qua các danh hiệu cộng hòa (tribunician power, imperium).",
            suggested_rewrite:
              "Augustus giữ quyền lực thực tế thông qua các danh hiệu cộng hòa và kiểm soát quân đội, dưới bức màn 'phục hồi cộng hòa'.",
          },
        ],
        summary:
          "Note có nhiều lỗi: Augustus không thuộc Bộ ba Tam đầu chế đầu tiên, Crassus chết tại Carrhae, Caesar bị giết năm 44 TCN. Cần sửa nhân vật và lịch sử. Cũng cần chỉ ra rằng Augustus giữ quyền lực thực tế dưới dạng 'phục hồi cộng hòa'.",
      };

      // --- TRANSFORM DATA ---
      // Chuyển đổi JSON cục thành mảng phẳng để render list
      const newItems: UnifiedResultItem[] = [];

      // 1. Process Conflicts
      apiResponse.conflicts.forEach((item) => {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "conflict",
          displayMessage: "Detected Contradiction", // Message ngắn gọn
          sentence: item.new_note_sentence,
          reason: item.reason,
          suggestion: item.suggested_rewrite,
          sources: item.evidence_from_sources,
          expanded: false,
        });
      });

      // 2. Process Improvements
      apiResponse.improvements.forEach((item) => {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "improvement",
          displayMessage: "Context Suggestion", // Message ngắn gọn
          sentence: item.new_note_sentence,
          reason: item.missing_context, // Map missing_context vào reason để hiển thị
          suggestion: item.suggested_addition,
          sources: [],
          expanded: false,
        });
      });

      // 3. Process Hallucinations
      apiResponse.hallucinations.forEach((item) => {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          type: "hallucination",
          displayMessage: "Unverified Info", // Message ngắn gọn
          sentence: item.new_note_sentence,
          reason: item.reason,
          suggestion: item.suggested_rewrite,
          sources: [], // Hallucination thường ko có source chứng minh (vì tìm ko thấy)
          expanded: false,
        });
      });

      setResults(newItems);
      setLoading(false);
    }, 1500);
  };

  // Helper toggle expand
  const toggleExpand = (id: string) => {
    setResults((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
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

  // Helper lấy màu và icon dựa trên type
  const getTypeConfig = (type: UnifiedResultItem["type"]) => {
    switch (type) {
      case "conflict":
        return {
          color: "#ff5050", // Đỏ
          bg: "rgba(255, 80, 80, 0.1)",
          border: "rgba(255, 80, 80, 0.3)",
          icon: <WarningAmberIcon sx={{ color: "#ff5050", fontSize: 20 }} />,
        };
      case "hallucination":
        return {
          color: "#ffa726", // Cam
          bg: "rgba(255, 167, 38, 0.1)",
          border: "rgba(255, 167, 38, 0.3)",
          icon: <PsychologyAltIcon sx={{ color: "#ffa726", fontSize: 20 }} />,
        };
      case "improvement":
        return {
          color: "#29b6f6", // Xanh dương sáng
          bg: "rgba(41, 182, 246, 0.1)",
          border: "rgba(41, 182, 246, 0.3)",
          icon: <AutoFixHighIcon sx={{ color: "#29b6f6", fontSize: 20 }} />,
        };
    }
  };

  return (
    <Box>
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

              {results.map((res, index) => {
                const config = getTypeConfig(res.type);

                return (
                  <Card
                    key={res.id}
                    sx={{
                      mb: 2,
                      background: "rgba(255,255,255,0.06)", // Glass base
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid",
                      borderColor: config.border, // Màu viền theo loại
                      borderRadius: "16px",
                      boxShadow: "0 4px 24px -1px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 30px -2px rgba(0,0,0,0.15)",
                        borderColor: config.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: "16px !important" }}>
                      {/* --- ROW 1: Icon + Message | Index --- */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between", // Để đẩy số thứ tự sang phải
                          alignItems: "center",
                          mb: 1.5,
                          pb: 1,
                          borderBottom: `1px solid ${config.border}`, // Line ngăn cách nhẹ
                        }}
                      >
                        {/* Left: Icon & Message */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {config.icon}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: config.color,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {res.displayMessage}
                          </Typography>
                        </Box>

                        {/* Right: Index Number */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            fontWeight: 600,
                            fontFamily: "monospace",
                            fontSize: "0.85rem",
                          }}
                        >
                          #{String(index + 1).padStart(2, "0")}
                        </Typography>
                      </Box>

                      {/* --- ROW 2: Sentence (New Note Sentence) --- */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          fontSize: "0.95rem",
                          mb: 1,
                          lineHeight: 1.5,
                        }}
                      >
                        "{res.sentence}"
                      </Typography>

                      {/* --- ROW 3: Reason / Missing Context --- */}
                      <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            minWidth: "60px",
                          }}
                        >
                          Analysis:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                        >
                          {res.reason}
                        </Typography>
                      </Box>

                      {/* --- ROW 4: Suggested Rewrite / Addition --- */}
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          gap: 1,
                          p: 1,
                          borderRadius: "8px",
                          bgcolor: "rgba(255,255,255,0.03)", // Highlight nhẹ phần suggest
                          border: "1px dashed rgba(255,255,255,0.15)",
                        }}
                      >
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            color: "#4caf50", // Xanh lá cho suggestion
                            fontWeight: 700,
                            minWidth: "60px",
                            pt: 0.2,
                          }}
                        >
                          Suggest:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontSize: "0.875rem",
                            fontStyle: "italic",
                          }}
                        >
                          {res.suggestion}
                        </Typography>
                      </Box>

                      {/* --- Expandable Sources Toggle (Chỉ hiện nếu có sources) --- */}
                      {res.sources && res.sources.length > 0 && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              mt: 1,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() => toggleExpand(res.id)}
                              startIcon={
                                res.expanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              }
                              sx={{
                                textTransform: "none",
                                fontSize: "0.75rem",
                                color: "text.secondary",
                                minWidth: 0,
                                p: "2px 8px",
                              }}
                            >
                              {res.expanded ? "Hide Evidence" : "View Evidence"}
                            </Button>
                          </Box>

                          {res.expanded && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1.5,
                                borderRadius: "8px",
                                bgcolor: "rgba(0,0,0,0.2)",
                              }}
                            >
                              {res.sources.map((src, i) => (
                                <Typography
                                  key={i}
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    color: "text.secondary",
                                    fontFamily: "monospace",
                                    mb: 0.5,
                                    "&:last-child": { mb: 0 },
                                  }}
                                >
                                  • {src}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TextEditor;
