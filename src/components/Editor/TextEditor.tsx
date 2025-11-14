import React from "react";
import { Box } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

const TextEditor = () => {
  const [value, setValue] = React.useState<string | undefined>(
    "## Bắt đầu ghi chú..."
  );

  return (
    <Box
      data-color-mode="dark"
      sx={{
        background:
          "linear-gradient(180deg, rgba(17,51,32,0.6), rgba(38,141,124,0.6), rgba(194,255,180,0.6))",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
        borderRadius: "15px",
        border: "1px solid rgba(255,255,255,0.18)",
        width: { xs: "90vw", md: "50vw" },
        height: "90vh",
        p: 2,
        overflow: "auto",
      }}
    >
      <div style={{ height: "100%" }}>
        <MDEditor
          value={value}
          onChange={setValue}
          height="100%"
          preview="live"
          style={{
            background: "rgba(255, 255, 255, 0.15)", // nền trắng trong suốt
            backdropFilter: "blur(8px)", // làm mềm nền
            borderRadius: "10px",
          }}
          textareaProps={{
            style: {
              background: "transparent",
              color: "#000", // màu chữ editor
            },
          }}
          previewOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.10)", // preview hơi trắng
              color: "#000",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default TextEditor;
