"use client";

import React, { useState, useEffect } from "react";
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
  Paper,
  TextField,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";

import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Conflict
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"; // Improvement
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt"; // Hallucination
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  MenuOpen as MenuOpenIcon,
  Save as SaveIcon,
  Source as SourceIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify"; // Import toastify
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

const TextEditor = ({ content }: any) => {
  const [markdown, setMarkdown] = useState(content || initialMarkdown);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditorChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const [results, setResults] = useState<UnifiedResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [allSources, setAllSources] = useState([
    { id: "1", name: "Lecture_History.pdf" },
    { id: "2", name: "Augustus_Bio.docx" },

    { id: "4", name: "Data mining.pdf" },
    { id: "5", name: "Machine learning.docx" },
    { id: "6", name: "Computer vision.txt" },

    { id: "7", name: "Quantum_Physics_Intro.pdf" },
    { id: "8", name: "Roman_Empire_Trade_Routes.docx" },
    { id: "9", name: "NeuralNetworks_Notes.txt" },
    { id: "10", name: "Algorithms_Design.pdf" },
    { id: "11", name: "Blockchain_Fundamentals.docx" },
    { id: "12", name: "Genetics_and_Evolution.pdf" },

    { id: "14", name: "CyberSecurity_Checklist.txt" },
    { id: "15", name: "Deep_Learning_Course.pdf" },
    { id: "16", name: "Database_Systems_Overview.docx" },
    { id: "17", name: "OperatingSystems_Notes.txt" },
    { id: "18", name: "Medieval_Warfare.pdf" },

    { id: "20", name: "Linear_Algebra_Summary.pdf" },
    { id: "21", name: "Human_Anatomy_Ref.docx" },
    { id: "22", name: "Astronomy_Stars_and_Galaxies.pdf" },
    { id: "23", name: "Environmental_Science_Intro.docx" },
    { id: "24", name: "Ethics_in_AI.txt" },
    { id: "25", name: "Compiler_Design.pdf" },

    { id: "27", name: "Probability_Theory_Basics.pdf" },
    { id: "28", name: "Sociology_HumanBehavior.docx" },
    { id: "29", name: "Philosophy_Stoicism_Notes.txt" },
    { id: "30", name: "Renaissance_Art_History.pdf" },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSource = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredSources = allSources.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock data lịch sử cũ (hoặc gọi API lấy history tại đây)
  useEffect(() => {
    const fetchHistory = async () => {
      // Giả lập delay lấy data từ server về
      // const response = await api.getHistory();

      // Mock data cũ
      const oldHistory: UnifiedResultItem[] = [
        {
          id: "old-1",
          type: "conflict",
          displayMessage: "Detected Contradiction",
          sentence: "Lịch sử cũ: Caesar chết già.",
          reason: "Lịch sử ghi nhận Caesar bị ám sát.",
          suggestion: "Caesar bị ám sát tại Pompey Theatre.",
          sources: ["Sách Lịch sử La Mã"],
          expanded: false,
        },
      ];

      // Set vào state ban đầu
      setResults(oldHistory);
    };

    fetchHistory();
  }, []); // Chạy 1 lần khi mount

  const simulateApiCall = ({ selectedText }: any) => {
    setLoading(true);

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

      setResults((prev) => [...newItems, ...prev]);
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
  const handleDelete = async (idString: string) => {
    // Mock API Call
    // await api.deleteItem(idString);
    console.log("Deleted item:", idString);

    // Cập nhật State (Số thứ tự sẽ tự động tính lại khi render)
    setResults((prev) => prev.filter((item) => item.id !== idString));
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

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Saved!");
    }, 1500);
  };

  return (
    <Box>
      {/* Chips List */}
      <Box
        className="w-full max-w-[70vw] mb-[10px] flex gap-0.5"
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          background: "transparent",
          border: "none",
          boxShadow: "none",
          scrollbarWidth: "thin", // Firefox
          "&::-webkit-scrollbar": {
            height: 6, // thanh scroll nhỏ
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent", // trong suốt
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.8)",
          },
          scrollbarColor: "rgba(0,0,0,0.5) transparent",
        }}
      >
        {selectedIds.map((id) => {
          const file = allSources.find((s) => s.id === id);
          return file ? (
            <Chip
              key={id}
              label={file.name}
              size="small"
              onDelete={() => handleToggleSource(id)}
              sx={{
                backdropFilter: "blur(4px)",
                background: "rgba(255, 255, 255, 0.7)",
                "& .MuiChip-deleteIcon:hover": { color: "error.main" },
                display: "inline-flex",
              }}
            />
          ) : null;
        })}
      </Box>

      <Box
        sx={{
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
              justifyContent: "space-between",
              width: "100%",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={isSaving}
              startIcon={!isSaving && <SaveIcon />}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                // backdropFilter: "blur(4px)",
                borderRadius: "12px",
                // bgcolor: isSaving ? "rgba(0,0,0)" : "primary.main",
                color: "white",
                // boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  background: isSaving
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(21, 101, 192, 1)",
                },
                ml: "50px",
                "&.Mui-disabled": {
                  color: "white",
                  opacity: 0.7, // bạn có thể chỉnh mức mờ
                },
              }}
            >
              {isSaving ? "saving..." : "Save"}
            </Button>

            {/* Nút Check Selection cũ giữ nguyên ở đây */}
            <div className="flex gap-3">
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowSourceMenu(!showSourceMenu)}
                startIcon={<SourceIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  backdropFilter: "blur(4px)",
                  borderRadius: "12px",
                  bgcolor: showSourceMenu
                    ? "rgba(21, 101, 192, 1)"
                    : "primary.main",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                Select sources
              </Button>
              {showSourceMenu && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "115%",
                    right: 0,
                    width: 280,
                    maxHeight: 350,
                    // overflow: "hidden",
                    borderRadius: "12px",
                    zIndex: 999,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Box>
                  <List
                    sx={{
                      overflowY: "auto",
                      overflowX: "hidden",
                      flex: 1,
                      p: 0,
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
                    {filteredSources.map((s) => (
                      <ListItem key={s.id} disablePadding dense>
                        <ListItemButton
                          onClick={() => handleToggleSource(s.id)}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Checkbox
                              edge="start"
                              checked={selectedIds.includes(s.id)}
                              size="small"
                            />
                          </ListItemIcon>

                          <ListItemText primary={s.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

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
                  bgcolor: loading ? "warning.main" : "primary.main",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  borderRadius: "15px",
                  "&:hover": {
                    background: "rgba(21, 101, 192, 1)",
                  },
                }}
              >
                {loading ? "processing..." : "Check Selection"}
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
            </div>
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

                const displayNumber = results.length - index;
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
                      {/* --- ROW 1: Icon + Message | Index + Close Button --- */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start", // Căn lề trên để nút X không bị lệch
                          mb: 1.5,
                          pb: 1,
                          borderBottom: `1px solid ${config.border}`,
                        }}
                      >
                        {/* Left: Icon & Message */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          {config.icon}
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: config.color,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                            }}
                          >
                            {res.displayMessage}
                          </Typography>
                        </Box>

                        {/* Right: Index Number & Delete Button */}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {/* Hiển thị số thứ tự đã tính toán */}
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.disabled",
                              fontWeight: 600,
                              fontFamily: "monospace",
                              fontSize: "0.9rem",
                            }}
                          >
                            #{String(displayNumber).padStart(2, "0")}
                          </Typography>

                          {/* Nút Xóa */}
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(res.id)}
                            sx={{
                              color: "text.disabled",
                              padding: 0,
                              ml: 0.5,
                              "&:hover": {
                                color: "error.main",
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            <CloseIcon
                              fontSize="small"
                              sx={{ fontSize: "1.1rem" }}
                            />
                          </IconButton>
                        </Box>
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
                                bgcolor: "rgba(0,0,0,0.1)",
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
