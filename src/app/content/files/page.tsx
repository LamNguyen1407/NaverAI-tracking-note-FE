"use client";

import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "@/components/Editor/Sidebar";
import Grid from "@mui/material/Grid";
import { GlassCard } from "@developer-hub/liquid-glass";

import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { useSidebar } from "@/context/SidebarContext";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { renderAsync } from "docx-preview";
import { set } from "zod";

const MENU_ICON_URL = "/assets/starfish.png";
const MAIN_BG_URL = "/assets/files5.png";

// mockData để giả lập API
// const mockData = {
//   notes: [
//     { id: 1, title: "Note 1", content: "Nội dung note 1" },
//     { id: 2, title: "Note 2", content: "Nội dung note 2" },
//     { id: 3, title: "Meeting Notes", content: "Kết luận buổi họp sáng nay." },
//     { id: 4, title: "Todo Today", content: "Hoàn thiện UI, sửa lỗi API." },
//     { id: 5, title: "Ideas", content: "Thử làm hiệu ứng 3D hover cho card." },
//     { id: 6, title: "Study Plan", content: "React + Next.js chuyên sâu." },
//     { id: 7, title: "Note 7", content: "Ghi chú linh tinh về dự án." },
//     { id: 8, title: "Quick Draft", content: "Concept UI landing biển." },
//     { id: 9, title: "Checklist", content: "Deploy + Test + Fix layout." },
//     { id: 10, title: "Reminder", content: "Gửi email báo cáo trước 5h." },
//   ],

//   documents: [
//     { id: 1, name: "Document 1.pdf", size: "2MB" },
//     { id: 2, name: "Document 2.pdf", size: "1.2MB" },
//     { id: 3, name: "Project-Overview.pdf", size: "3.1MB" },
//     { id: 4, name: "Meeting-Minutes.docx", size: "860KB" },
//     { id: 5, name: "Financial-Report-2024.pdf", size: "2.8MB" },
//     { id: 6, name: "Team-Profile.docx", size: "740KB" },
//     { id: 7, name: "UI-Design.pdf", size: "4.2MB" },
//     { id: 8, name: "Requirements.pdf", size: "990KB" },
//     { id: 9, name: "Manual-Guide.docx", size: "1.6MB" },
//     { id: 10, name: "New-Client-Briefing.docx", size: "720KB" },
//     { id: 11, name: "Marketing-Slides.pdf", size: "2.4MB" },
//     { id: 12, name: "Onboarding.docx", size: "650KB" },
//   ],
// };

function MarkdownPreview({ blob }: { blob: Blob }) {
  const [text, setText] = useState("");

  useEffect(() => {
    blob.text().then(setText);
  }, [blob]);

  return <ReactMarkdown>{text}</ReactMarkdown>;
}

function Files() {
  const { toggleSidebar } = useSidebar();


  // const handleOpen = async (file: any) => {
  //   setSelectedFile(file);

  //   const res = await fetch(`/api/files/${file.id}`);
  //   const blob = await res.blob();

  //   setFileBlob(blob);
  //   setOpenDialog(true);
  // };
  const handleOpen = async (file: any) => {
    setSelectedFile(file);
    const res = await fetch(file.preview_url);
    const blob = await res.blob();

    setFileBlob(blob);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (openDialog && fileBlob && selectedFile?.file_name.endsWith(".docx")) {
      const container = document.getElementById("docx-container");
      if (!container) return;

      container.innerHTML = "";
      renderAsync(fileBlob, container as HTMLElement);
    }
  }, [openDialog, fileBlob]);

  useEffect(() => {
  const fetchFiles = async () => {
    try {
      // Lấy Note
      const noteRes = await fetch(`${process.env.NEXT_PUBLIC_API}/files/metadata/note`);
      const noteData = await noteRes.json();
      setNotes(noteData.files)
      // setNotes(noteData.files.map((f: any, idx: number) => ({
      //   id: idx + 1,
      //   title: f.file_name,
      //   size: `${f.size} KB`,
      //   last_modified: f.last_modified
      // })));

      // Lấy Document
      const docRes = await fetch(`${process.env.NEXT_PUBLIC_API}/files/metadata/document`);
      const docData = await docRes.json();
      setDocuments(docData.files)
      // setDocuments(docData.files.map((f: any, idx: number) => ({
      //   id: idx + 1,
      //   name: f.file_name,
      //   size: `${(f.size / 1024).toFixed(2)} KB`,
      //   last_modified: f.last_modified
      // })));
    } catch (err) {
      console.error("Failed to fetch files metadata", err);
    }
  };

  fetchFiles();
}, []);

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

      {/* Button mở sidebar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // không muốn ở giữa màn hình
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

        {/* <Sidebar open={isSidebarOpen} onClose={toggleSidebar} current="Files" /> */}

        {/* Khu vực hiển thị file */}
        <Box
          sx={{
            padding: 4,
            color: "black",
            width: "80vw",
          }}
        >
          {/* Notes */}
          <Box
            sx={{
              marginBottom: 4,
              paddingRight: "4px",
            }}
          >
            <Box
              sx={{
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: 2,
                borderLeft: "5px solid #4A148C",
                padding: "0 10px",
                textShadow: "0 1px 1px rgba(255,255,255,0.4)",

                // 🔥 Background chỉ dài bằng chữ
                display: "inline-block",

                // ✨ Hiệu ứng glass mờ nhẹ
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",

                borderRadius: "8px",
              }}
            >
              Notes
            </Box>

            <Box
              sx={{
                maxHeight: "35vh",
                overflowY: "auto",
                paddingRight: "6px",

                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <Grid container spacing={2}>
                {notes.map((note) => (
                  <Grid key={note.etag} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Box
                      className="
                        backdrop-blur-md
                        rounded-xl
                        border border-white/20
                        shadow-[0_4px_18px_rgba(0,0,0,0.25)]
                        transition-all duration-300
                        hover:bg-white/15
                        hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)]
                        hover:-translate-y-1
                      "
                      onClick={() => handleOpen(note)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        padding: 2,
                        color: "black",
                        background: `linear-gradient(
                        135deg,
                        rgba(255, 193, 7, 0.5),
                        rgba(255, 152, 0, 0.5)
                      )`,
                        cursor: "pointer",
                      }}
                    >
                      {/* 🎨 NOTE ICON → tím gradient */}
                      <NoteOutlinedIcon
                        sx={{
                          fontSize: 32,
                        }}
                      />

                      <Box>
                        <strong>{note.file_name}</strong>
                        <p style={{ margin: 0 }}>Size: {note.size} B</p>
                        <p style={{ margin: 0 }}>Last Modified: {note.last_modified.slice(0, 10)}</p>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Documents */}
          <Box
            sx={{
              paddingRight: "4px",
            }}
          >
            <Box
              sx={{
                color: "black",
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: 2,
                borderLeft: "5px solid #1B5E20",
                padding: "0 10px",
                textShadow: "0 1px 1px rgba(255,255,255,0.4)",

                // // 🔥 Background chỉ dài bằng chữ
                display: "inline-block",

                // // ✨ Hiệu ứng glass mờ nhẹ
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",

                borderRadius: "8px",
              }}
            >
              Documents
            </Box>

            <Box
              sx={{
                maxHeight: "35vh",
                overflowY: "auto",
                paddingRight: "6px",

                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <Grid container spacing={2}>
                {documents.map((doc) => (
                  <Grid key={doc.etag} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Box
                      className="
                      backdrop-blur-md
                      rounded-xl
                      border border-white/20
                      shadow-[0_4px_18px_rgba(0,0,0,0.25)]
                      transition-all duration-300
                      hover:bg-white/15
                      hover:shadow-[0_6px_28px_rgba(0,0,0,0.35)]
                      hover:-translate-y-1
                    "
                      onClick={() => handleOpen(doc)}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        padding: 2,
                        color: "white",
                        background: doc.file_name.endsWith(".pdf")
                          ? "linear-gradient(135deg, rgba(211,47,47,0.5), rgba(211,47,47,0.5))"
                          : "linear-gradient(135deg, rgba(25,118,210,0.5), rgba(25,118,210,0.5))",
                        "&:hover": {
                          background: doc.file_name.endsWith(".pdf")
                            ? "linear-gradient(135deg, rgba(211,47,47,0.5), rgba(211,47,47,0.5))"
                            : "linear-gradient(135deg, rgba(25,118,210,0.5), rgba(25,118,210,0.5))",
                          boxShadow: "0 6px 28px rgba(0,0,0,0.8)",
                        },
                      }}
                    >
                      {/* 🎨 PDF icon → màu đỏ */}
                      {doc.file_name.endsWith(".pdf") ? (
                        <PictureAsPdfIcon
                          sx={{ fontSize: 32, color: "#d32f2f" }}
                        />
                      ) : (
                        /* 🎨 DOCX icon → xanh dương */
                        <DescriptionOutlinedIcon
                          sx={{ fontSize: 32, color: "#2a3b8f" }}
                        />
                      )}

                      <Box>
                        <strong>{doc.file_name}</strong>
                        <p style={{ margin: 0 }}>{"Size: " +(doc.size/1024).toFixed(2)} KB</p>
                        <p style={{ margin: 0 }}>{"Last Modified: " +doc.last_modified.slice(0, 10)}</p>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFile?.title || selectedFile?.file_name}</DialogTitle>

        <DialogContent
          sx={{
            overflowY: "hidden", // ✨ chặn scroll dọc
            padding: 0, // (optional) bỏ padding để iframe/docx fullscreen đẹp hơn
          }}
        >
          {/* Markdown */}
          {/* {selectedFile?.content && fileBlob && (
            <MarkdownPreview blob={fileBlob} />
          )} */}

          {/* PDF */}
          {/* {String(selectedFile?.file_name || "")
            .toLowerCase()
            .endsWith(".pdf") &&
            fileBlob && (
              <iframe
                src={URL.createObjectURL(fileBlob)}
                style={{ width: "100%", height: "80vh", border: "none" }}
              />
            )} */}

          {/* DOCX */}
          {/* {String(selectedFile?.file_name || "")
            .toLowerCase()
            .endsWith(".docx") &&
            fileBlob && (
              <div
                id="docx-container"
                style={{ height: "80vh", overflow: "auto" }}
              />
            )} */}

            {/* MARKDOWN FILE */}
              {selectedFile?.file_name?.endsWith(".md") && fileBlob && (
                <MarkdownPreview blob={fileBlob} />
              )}

              {/* PDF */}
              {selectedFile?.file_name?.endsWith(".pdf") && fileBlob && (
                <iframe
                  src={URL.createObjectURL(fileBlob)}
                  style={{ width: "100%", height: "80vh", border: "none" }}
                />
              )}

              {/* DOCX */}
              {selectedFile?.file_name?.endsWith(".docx") && fileBlob && (
                <div id="docx-container" style={{ height: "80vh", overflow: "auto" }} />
              )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Files;
