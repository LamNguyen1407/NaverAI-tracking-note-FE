// ParallaxThreePage.tsx
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { GlassCard } from "@developer-hub/liquid-glass";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Ảnh nền trong thư mục /public/assets/
const bg1 = "/assets/hero_section4.png";
const ship = "/assets/ship.png";

export default function ParallaxThreePage() {
  const [showCard, setShowCard] = useState(true);
  const router = useRouter();

  // Hàm xử lý việc chuyển hướng
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <Box className="text-white overflow-x-hidden">
      {/* ===== MAIN CONTENT ===== */}
      <div className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Background tĩnh */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg1})`,
            mixBlendMode: "screen",
          }}
        />
        {/* <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/wave2.mp4" // đặt video trong public/videos
          autoPlay
          loop
          muted
          playsInline
        /> */}

        <div className="relative w-[70%] h-full select-none">
          {/* NAVER */}
          <h1
            className="absolute font-serif leading-none"
            style={{
              top: "8%",
              left: "8%",
              fontSize: "9rem",
              fontWeight: 800,
              color: "#FF8A3D",
              lineHeight: 1,
              fontFamily: "var(--font-wkwk), sans-serif",
            }}
          >
            NAVER
          </h1>

          {/* NOTE */}
          <h1
            className="absolute font-bold leading-none"
            style={{
              top: "30%",
              right: "10%",
              fontSize: "11rem",
              fontWeight: 900,
              color: "#FFC107",
              letterSpacing: "-6px",
              lineHeight: 1,
              // transform: "rotate(-4deg)",
              textShadow: "3px 3px 10px rgba(0,0,0,0.25)",
              fontFamily: "var(--font-super-maples), sans-serif",
            }}
          >
            ReWrySe
          </h1>

          {/* Con thuyền */}
          <div
            className="absolute flex items-end"
            style={{
              bottom: "2%",
              left: "15%",
            }}
          >
            <div className="relative">
              <img
                src={ship}
                alt="ship"
                className="w-[600px] h-auto object-cover"
              />

              {/* Text START */}
              <span
                className="absolute text-5xl font-extrabold"
                style={{
                  left: "58%",
                  bottom: "35%",
                  transform: "translateX(-50%)",
                  color: "black",
                  textShadow:
                    "0 0 8px #FF99FF, 0 0 15px #1ABC9C, 0 0 25px rgba(255,255,255,0.8)",
                  pointerEvents: "none", // để text không ảnh hưởng click
                }}
              >
                START
              </span>

              {/* Invisible Button */}
              <button
                onClick={handleLogin}
                className="absolute"
                style={{
                  left: "58%",
                  bottom: "35%",
                  transform: "translateX(-50%)",
                  width: "180px",
                  height: "50px",
                  background: "transparent",
                  border: "3px solid #FFB38A", // chỉ shape viền
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* ==== GLASS CARD NOTE==== */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
          initial={{ x: 1000, y: "-50%" }}
          animate={showCard ? { x: "85%", y: "-75%" } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "grab",
            zIndex: 10,
          }}
        >
          <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
            <div className="h-60 w-60 relative">
              <img
                src="/assets/bubble2.png"
                alt="Bubble"
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* ==== GLASS CARD START==== */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
          initial={{ x: "-60%", y: 1000 }}
          animate={
            showCard
              ? {
                  x: "-150%",
                  y: "30%",
                  transition: { duration: 3, ease: "easeInOut" },
                }
              : {}
          }
          whileInView={{
            borderRadius: [
              "70% 30% 80% 20% / 60% 40% 70% 30%",
              "35% 65% 25% 75% / 65% 35% 75% 25%",
              "80% 20% 60% 40% / 55% 75% 25% 45%",
              "60% 40% 70% 30% / 50% 60% 40% 50%",
            ],
            scale: [0.96, 1.06, 1],
            transition: {
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            cursor: "grab",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
            <div className="h-60 w-60 relative">
              {/* <img
                src="/assets/bubble2.png"
                alt="Bubble"
                className="object-cover w-full h-full"
                draggable={false}
              /> */}
            </div>
          </GlassCard>
        </motion.div>

        {/* ==== GLASS CARD NAVER==== */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
          initial={{ x: -1000, y: -800 }}
          animate={
            showCard
              ? {
                  x: "-270%",
                  y: "-200%",
                  transition: { duration: 2, ease: "easeInOut" },
                }
              : {}
          }
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "grab",
            zIndex: 10,

            borderRadius: "58% 42% 55% 45% / 50% 60% 40% 50%",
            overflow: "hidden", // ⭐ Rất quan trọng để cắt ảnh theo shape
          }}
        >
          <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
            <div className="h-40 w-40 relative">
              <img
                src="/assets/sun3.png"
                alt="Bubble"
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Box>
  );
}
