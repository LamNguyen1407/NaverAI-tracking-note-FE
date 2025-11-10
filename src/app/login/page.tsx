"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import { Box } from "@mui/material";

const MAIN_BG_URL = "/assets/login.png"; // thay ảnh của bạn

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${MAIN_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* CARD TRÊN */}
        <GlassCard
          style={{
            width: "320px",
            height: "100px",
            borderRadius: "30px 30px 70px 70px", // bo góc uốn xuống
          }}
        >
          <div className="p-6 text-center">
            <h2>Password</h2>
            <p>Enter your secure password</p>
          </div>
        </GlassCard>

        {/* CARD DƯỚI */}
        <GlassCard
          style={{
            width: "320px",
            height: "100px",
            borderRadius: "70px 70px 30px 30px", // bo góc uốn lên
          }}
        >
          <div className="p-6 text-center">
            <h2>Username</h2>
            <p>Enter your login name</p>
          </div>
        </GlassCard>
      </Box>
    </Box>
  );
}
