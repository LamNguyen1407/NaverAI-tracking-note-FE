"use client";

import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ===== MOCK DATA =====
import DescriptionIcon from "@mui/icons-material/Description";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { GlassCard } from "@developer-hub/liquid-glass";

const cloudLeft = "/assets/cloud_left.png";
const cloudRight = "/assets/cloud_right.png";
const island = "/assets/island4.png";
const bg1 = "/assets/hero_section4.png";
const ship = "/assets/ship.png";
const bottle = "/assets/bottle3.png";
const woodenSignboard = "/assets/wooden_signboard2.png";

const FEATURE_CARDS = [
  {
    id: 1,
    icon: <DescriptionIcon fontSize="large" className="text-[#FFE0A8]" />,
    title: "One workspace for AI, search, and structured notes",
    p1: "No more switching between ChatGPT, Gemini, Grok, and browser tabs. Everything you need sits in one unified space.",
    p2: "Search across your own documents and take clean, structured notes directly in context.",
    glow: "shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
  },
  {
    id: 2,
    icon: <FactCheckIcon fontSize="large" className="text-[#9BE7FF]" />,
    title: "Verify the web with a single highlight",
    p1: "Select any passage online, choose the sources you trust, and run an instant verification check.",
    p2: "We reveal conflicts, alignments, and missing information—right when you need it.",
    glow: "shadow-[0_18px_60px_rgba(0,25,80,0.45)]",
  },
  {
    id: 3,
    icon: <AutoAwesomeIcon fontSize="large" className="text-[#F9C3FF]" />,
    title: "Auto-structured summaries for your content",
    p1: "Drop in PDFs, articles, or long notes and get a clean, consistent summary without manual cleanup.",
    p2: "Important insights, decisions, and follow-ups are extracted automatically.",
    glow: "shadow-[0_18px_60px_rgba(40,0,80,0.45)]",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const handleLogin = () => router.push("/login");
  const [ready, setReady] = useState(false);

  return (
    <Box className="text-white overflow-x-hidden">
      <div className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* ===== BACKGROUND (island reveal) ===== */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Island background (ở dưới cùng) */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${island})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          />

          {/* Cloud Left */}
          <motion.div
            className="absolute top-0 left-0 h-full w-[120%]"
            style={{
              WebkitMaskImage: `url(${cloudLeft})`,
              maskImage: `url(${cloudLeft})`,
              WebkitMaskSize: "cover",
              maskSize: "cover",
              backgroundImage: `url(${cloudLeft})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            initial={{ x: 0 }}
            animate={{ x: "-120%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 2 }}
          />

          {/* Cloud Right */}
          <motion.div
            className="absolute top-0 right-0 h-full w-[120%]"
            style={{
              WebkitMaskImage: `url(${cloudRight})`,
              maskImage: `url(${cloudRight})`,
              WebkitMaskSize: "cover",
              maskSize: "cover",
              backgroundImage: `url(${cloudRight})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            initial={{ x: 0 }}
            animate={{ x: "120%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          />

          <motion.button
            onClick={() => window.open("https://google.com", "_blank")}
            initial={{ opacity: 0, x: -40 }} // ← từ trái đi ra
            animate={{ opacity: 1, x: 0 }} // → cùng timeline START
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 1,
            }}
            className="
    absolute 
    left-30 bottom-10
    w-[300px] h-[200px]
    flex items-start justify-start
    pt-[50px] pl-[90px]
    font-bold text-[#3A1F0B]
    text-2xl
    cursor-pointer z-50
    hover:scale-105 transition-all duration-200
  "
            style={{
              backgroundImage: `url(${woodenSignboard})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            Extension
          </motion.button>
        </div>

        {/* ===== MAIN CONTENT (FLEX) ===== */}
        <div className="relative w-[80%] h-full flex items-center justify-between select-none">
          {/* ========================= */}
          {/*     SLIDER LEFT (65%)     */}
          {/* ========================= */}
          <div
            className={`
              transition-opacity duration-300 ${
                ready ? "opacity-100" : "opacity-0"
              }
              w-[55%] flex flex-col justify-between
            `}
          >
            <Swiper
              modules={[EffectCoverflow, Pagination, Navigation]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2}
              coverflowEffect={{
                rotate: 0,
                stretch: 20,
                depth: 200,
                modifier: 2,
                slideShadows: false,
              }}
              pagination={false}
              navigation={true} // giữ logic navigation, chỉ ẩn icon UI
              className="w-full h-[500px] relative"
              onSwiper={() => setTimeout(() => setReady(true), 20)}
            >
              {FEATURE_CARDS.map((item) => (
                <SwiperSlide key={item.id} className="flex justify-center">
                  {/* Custom glassmorphism card */}
                  <div
                    className="
                      rounded-3xl p-6 flex flex-col
                      backdrop-blur-2xl
                      border border-[rgba(255,255,255,0.4)]
                      shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_0_12px_rgba(255,255,255,0.08)]
                      bg-[rgba(255,255,255,0.08)]
                    "
                    style={{
                      WebkitBackdropFilter: "blur(34px)",
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(180,220,255,0.06))",
                    }}
                  >
                    {/* <div className="mb-4 scale-[1.15]">{item.icon}</div> */}

                    {/* TITLE */}
                    <h2
                      className="text-[1.35rem] font-semibold mb-4 text-black"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        lineHeight: 1.25,
                      }}
                    >
                      {item.title}
                    </h2>

                    {/* PARAGRAPH 1 */}
                    <p
                      className="text-[0.95rem] leading-relaxed mb-3 text-slate-100/95"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {item.p1}
                    </p>

                    {/* PARAGRAPH 2 */}
                    <p
                      className="text-[0.95rem] leading-relaxed text-slate-100/85"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {item.p2}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Ẩn icon mũi tên trái/phải của Swiper + fade slide phụ */}
            <style>{`
              .swiper-button-next,
              .swiper-button-prev {
                display: none !important;
              }
              .swiper-slide {
                opacity: 0.35;
                transition: opacity .3s ease;
              }
              .swiper-slide-active {
                opacity: 1 !important;
              }
              .swiper-pagination {
                display: none !important;
              }

            `}</style>
          </div>

          {/* ========================= */}
          {/*   HERO TEXT RIGHT (35%)   */}
          {/* ========================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-[30%] text-right"
          >
            <div className="h-screen flex flex-col justify-between gap-10">
              <>
                <div className="relative w-full h-full select-none mt-7">
                  {/* NAVER */}
                  <h1
                    className="w-full ml-[100px] text-center leading-none"
                    style={{
                      fontSize: "5rem",
                      fontWeight: 800,
                      color: "#469B4D",
                      WebkitTextStroke: "2px #512B00",
                      textShadow: "0 6px 18px rgba(0,0,0,0.45)",
                      lineHeight: 1,
                      fontFamily: "var(--font-super-maples), sans-serif",
                    }}
                  >
                    NAVER
                  </h1>

                  {/* Noveri */}
                  <h1
                    className="text-center mr-[100px] font-bold leading-none"
                    style={{
                      fontSize: "7rem",
                      fontWeight: 900,
                      color: "#D8A24A",
                      WebkitTextStroke: "1px #5A3600",

                      textShadow: "0 8px 22px rgba(0,0,0,0.55)",

                      letterSpacing: "-6px",
                      lineHeight: 1,
                      fontFamily: "var(--font-super-maples), sans-serif",
                    }}
                  >
                    Noveri
                  </h1>
                </div>

                <GlassCard cornerRadius={25}>
                  <p
                    className="text-lg mt-4 px-4 py-2 rounded-2xl pl-[50px] ml-[50px]"
                    style={{
                      color: "rgba(0,0,0,0.8)",
                      // background: "rgba(255,255,255,0.2)", // 6% white
                      // backdropFilter: "blur(6px)", // soft glass
                      textShadow: "0 0 8px rgba(255,255,255,0.55)",
                      fontWeight: 500,
                    }}
                  >
                    A unified space to think, verify, and store what actually
                    matters. Built for long-term knowledge, not just one-off
                    answers.
                  </p>
                </GlassCard>
              </>

              <div>
                <div className="relative">
                  <img
                    src={bottle}
                    alt="bottle"
                    className="ml-[100px] w-[1200px] h-auto object-cover"
                  />
                  {/* 
                  <span
                    className="absolute text-4xl font-extrabold"
                    style={{
                      left: "70%",
                      bottom: "40%",
                      transform: "translateX(-50%)",
                      color: "black",
                      textShadow: "0 0 8px #FFEDF2, 0 0 16px rgba(0,0,0,0.35)",
                      pointerEvents: "none",
                    }}
                  >
                    START
                  </span> */}

                  <button
                    onClick={handleLogin}
                    style={{
                      left: "70%",
                      bottom: "40%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "40px",
                    }}
                    className="
                      absolute rounded-xl cursor-pointer
                      bg-white/10 border-[3px] border-white/40
                      backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]
                      text-black
                      hover:bg-[rgba(140,100,70,0.5)]
                      hover:border-[rgba(150,110,80,0.45)]
                      hover:shadow-[0_6px_18px_rgba(90,60,40,0.25)]
                      hover:text-[#fffaf3]

                    "
                  >
                    START
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Box>
  );
}
