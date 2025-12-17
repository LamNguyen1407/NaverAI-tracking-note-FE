import { Box, Grid } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LinkIcon from "@mui/icons-material/Link";
import NotesIcon from "@mui/icons-material/Notes";
import { useState, useEffect } from "react";

const DocumentList = ({
  doc,
  handleOpen,
  sourceCache,
  setSourceCache,
}: {
  doc: any;
  handleOpen: (doc: any) => void;
  sourceCache: any;
  setSourceCache: any;
}) => {
  const isPdf = doc.file_name.endsWith(".pdf");
  const isText = doc.file_name.endsWith(".txt");
  const isLink = doc.file_name.endsWith(".json");

  useEffect(() => {
    if (!isLink) return;
    if (sourceCache[doc.file_name]) return;

    fetch(
      `${
        process.env.NEXT_PUBLIC_API_NOTEBOOK
      }/api/sources/${doc.file_name.replace(".json", "")}`
    )
      .then((r) => r.json())
      .then((data) => {
        setSourceCache((prev: any) => ({
          ...prev,
          [doc.file_name]: data,
        }));
      })
      .catch(() => {});
  }, []);

  return (
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
          background: isPdf
            ? "linear-gradient(135deg, rgba(211,47,47,0.5), rgba(211,47,47,0.5))"
            : isText
            ? "linear-gradient(135deg, rgba(46,125,50,0.5), rgba(46,125,50,0.5))"
            : isLink
            ? "linear-gradient(135deg, rgba(123,31,162,0.5), rgba(123,31,162,0.5))"
            : "linear-gradient(135deg, rgba(25,118,210,0.5), rgba(25,118,210,0.5))",

          // "&:hover": {
          //   background: doc.file_name.endsWith(".pdf")
          //     ? "linear-gradient(135deg, rgba(211,47,47,0.5), rgba(211,47,47,0.5))"
          //     : "linear-gradient(135deg, rgba(25,118,210,0.5), rgba(25,118,210,0.5))",
          //   boxShadow: "0 6px 28px rgba(0,0,0,0.8)",
          // },
        }}
      >
        {isPdf ? (
          <PictureAsPdfIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
        ) : isText ? (
          <NotesIcon sx={{ fontSize: 32, color: "#2e7d32" }} />
        ) : isLink ? (
          <LinkIcon sx={{ fontSize: 32, color: "#7b1fa2" }} />
        ) : (
          <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#2a3b8f" }} />
        )}

        <Box>
          <strong>
            {isLink
              ? sourceCache[doc.file_name]?.title || "Loading title..."
              : isText
              ? "Text note"
              : doc.file_name}
          </strong>

          <p style={{ margin: 0 }}>
            {isLink
              ? "External source"
              : "Size: " + (doc.size / 1024).toFixed(2) + " KB"}
          </p>

          <p style={{ margin: 0 }}>
            {"Last Modified: " + doc.last_modified.slice(0, 10)}
          </p>
        </Box>
      </Box>
    </Grid>
  );
};

export default DocumentList;
