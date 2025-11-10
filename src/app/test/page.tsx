// ParallaxThreePage.tsx
"use client";

import { useState } from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { Box, Typography } from "@mui/material";
import { GlassCard } from "@developer-hub/liquid-glass";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
// Ảnh nền trong thư mục /public/assets/
const bg1 = "/assets/bg1.png";
const bg2 = "/assets/bg2.png";
const bg3 = "/assets/bg3.png";

export default function ParallaxThreePage() {
  const [showCard, setShowCard] = useState(true);
  const router = useRouter();

  // Hàm xử lý việc chuyển hướng
  const handleLogin = () => {
    // Chỉ cần gọi router.push() với đường dẫn đích
    router.push('/login'); 
  };
  return (
    <ParallaxProvider>
      <Box className="text-white overflow-x-hidden">
        {/* ===== SECTION 1 ===== */}
        <section className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden z-30">
          <Parallax
            speed={-20}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg1})`,
              mixBlendMode: "screen",
            }}
          />

          {/* ==== TEXT PHÍA SAU ==== */}
          <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-between pointer-events-none z-0 p-20">
            {/* NAVER - Trên, lệch trái */}
            <h1
              className="font-serif tracking-tight leading-none text-left"
              style={{
                fontSize: "11rem",
                fontWeight: 800,
                color: "#111",
                WebkitTextStroke: "3px white",
                lineHeight: 1,
              }}
            >
              NAVER
            </h1>

            {/* NOTE - Dưới, lệch phải */}
            <h1
              className="font-bold leading-none text-right"
              style={{
                fontSize: "14rem",
                fontWeight: 900,
                color: "#FFD600",
                letterSpacing: "-6px",
                lineHeight: 1,
              }}
            >
              NOTE
            </h1>
          </div>


          {/* ==== GLASS CARD ==== */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.2}
            whileTap={{ cursor: "grabbing" }}
            initial={{ x: 1000, y: '-50%'}}
            // animate={showCard ? { x: '-50%', y: '-50%' } : {}}
animate={showCard 
  ? { 
      x: '-50%', 
      y: '-50%',
      transition: { duration: 4, ease: 'easeInOut' } // <== di chuyển 1 lần
    } 
  : {}
}

whileInView={{
  borderRadius: [
    '70% 30% 80% 20% / 60% 40% 70% 30%',
    '35% 65% 25% 75% / 65% 35% 75% 25%',
    '80% 20% 60% 40% / 55% 75% 25% 45%',
    '60% 40% 70% 30% / 50% 60% 40% 50%'
  ],
  scale: [0.96, 1.06, 1],
  transition: {
    duration: 7,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'mirror'
  }
}}


            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              // transform: "translate(-50%, -50%)",
              cursor: "grab",
              zIndex: 10,
              // borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              // borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              
              overflow: "hidden", 
            }}
          >
            <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
              {/* Thêm 'relative' vào div cha */}
              <div className="h-80 w-80 relative"> 
                <img
                  src="/assets/bubble2.png"
                  alt="Beach Wave"
                  className="object-cover w-full h-full"
                  draggable={false} 
                />
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* ===== SECTION 2 ===== */}
        <section className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden z-20">
          <Parallax
            speed={-10}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg2})`,
              mixBlendMode: "screen",
            }}
          />
          <Typography
            variant="h2"
            className="relative z-10 text-5xl font-bold drop-shadow-lg"
          >
            Trang 2
          </Typography>
        </section>

        {/* ===== SECTION 3 ===== */}
        <section className="sticky top-0 h-screen flex items-center justify-center bg-black overflow-hidden z-10">
          <Parallax
            speed={-5}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg3})`,
              mixBlendMode: "screen",
            }}
          />
          <Typography
            variant="h2"
            className="relative z-10 text-5xl font-bold drop-shadow-lg"
          >
            Trang 3
          </Typography>
        </section>
      </Box>
    </ParallaxProvider>
  );
}
