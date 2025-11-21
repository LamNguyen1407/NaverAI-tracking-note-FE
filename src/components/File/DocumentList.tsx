import { Box, Grid } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const DocumentList = ({
  doc,
  handleOpen,
}: {
  doc: any;
  handleOpen: (doc: any) => void;
}) => {
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
          <PictureAsPdfIcon sx={{ fontSize: 32, color: "#d32f2f" }} />
        ) : (
          /* 🎨 DOCX icon → xanh dương */
          <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#2a3b8f" }} />
        )}

        <Box>
          <strong>{doc.file_name}</strong>
          <p style={{ margin: 0 }}>
            {"Size: " + (doc.size / 1024).toFixed(2)} KB
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
