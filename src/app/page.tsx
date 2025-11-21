"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { GlassCard } from "@developer-hub/liquid-glass";

// ===== MOCK DATA =====
import DescriptionIcon from "@mui/icons-material/Description";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const cloudLeft = "/assets/cloud_left.png";
const cloudRight = "/assets/cloud_right.png";
const island = "/assets/island4.png";

const FEATURE_CARDS = [
  {
    id: 1,
    icon: <DescriptionIcon fontSize="large" className="text-[#FFD28A]" />,
    title: "One workspace for AI, search, and structured notes",
    p1: "No more switching between ChatGPT, Gemini, Grok, and browser tabs. Everything you need sits in one unified space.",
    p2: "Search across your own documents and take clean, structured notes directly in context.",
    glow: "shadow-[0_0_40px_rgba(255,255,255,0.15)]",
  },
  {
    id: 2,
    icon: <FactCheckIcon fontSize="large" className="text-[#80E9FF]" />,
    title: "Verify the web with a single highlight",
    p1: "Select any passage online, choose the sources you trust, and run an instant verification check.",
    p2: "We reveal conflicts, alignments, and missing information—right when you need it.",
    glow: "shadow-[0_0_40px_rgba(0,200,255,0.20)]",
  },
  {
    id: 3,
    icon: <AutoAwesomeIcon fontSize="large" className="text-[#FFB6FF]" />,
    title: "Auto-structured summaries for your content",
    p1: "Drop in PDFs, articles, or long notes and get a clean, consistent summary without manual cleanup.",
    p2: "Important insights, decisions, and follow-ups are extracted automatically.",
    glow: "shadow-[0_0_40px_rgba(255,150,255,0.25)]",
  },
];

const bg1 = "/assets/hero_section4.png";
const ship = "/assets/ship.png";

export default function ParallaxThreePage() {
  const router = useRouter();
  const handleLogin = () => router.push("/login");

  return (
    <Box className="text-white overflow-x-hidden">
      <div className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* ===== BACKGROUND ===== */}
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
          {/* Cloud Left */}
          <motion.div
            className="absolute top-0 left-0 h-full w-[120%] object-cover"
            style={{
              WebkitMaskImage: `url(${cloudLeft})`,
              maskImage: `url(${cloudLeft})`,
              WebkitMaskSize: "cover",
              maskSize: "cover",
              backgroundImage: `url(${cloudLeft})`,
              backgroundSize: "cover",
            }}
            initial={{ x: 0 }}
            animate={{ x: "-120%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          />

          {/* Cloud Right */}
          {/* Cloud Right */}
          <motion.div
            className="absolute top-0 right-0 h-full w-[120%] object-cover"
            style={{
              WebkitMaskImage: `url(${cloudRight})`,
              maskImage: `url(${cloudRight})`,
              WebkitMaskSize: "cover",
              maskSize: "cover",
              backgroundImage: `url(${cloudRight})`,
              backgroundSize: "cover",
            }}
            initial={{ x: 0 }}
            animate={{ x: "120%" }}
            transition={{ duration: 2, ease: "easeOut", delay: 2 }}
          />
        </div>

        {/* ===== MAIN CONTENT (FLEX) ===== */}
        <div className="relative w-[80%] h-full flex items-center justify-between select-none">
          {/* ========================= */}
          {/*     SLIDER LEFT (65%)     */}
          {/* ========================= */}
          <div className="w-[65%]">
            <Swiper
              modules={[EffectCoverflow, Pagination, Navigation]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={2}
              // spaceBetween={5}
              coverflowEffect={{
                rotate: 0,
                stretch: 20,
                depth: 200,
                modifier: 2,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={true} // giữ logic navigation, chỉ ẩn icon UI
              className="w-full h-[340px] relative"
            >
              {FEATURE_CARDS.map((item) => (
                <SwiperSlide key={item.id} className="flex justify-center">
                  <GlassCard>
                    <div
                      className={`
      w-[320px] min-h-[260px]
      rounded-2xl
      p-6 flex flex-col
      backdrop-blur-xl bg-white/10 border border-white/18 
      ${item.glow}
    `}
                      style={{ WebkitBackdropFilter: "blur(20px)" }}
                    >
                      <div className="mb-3">{item.icon}</div>

                      <h2 className="text-lg font-semibold mb-3">
                        {item.title}
                      </h2>

                      <p className="text-sm opacity-85 leading-relaxed mb-2">
                        {item.p1}
                      </p>

                      <p className="text-sm opacity-80 leading-relaxed">
                        {item.p2}
                      </p>
                    </div>
                  </GlassCard>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Ẩn icon mũi tên trái/phải của Swiper */}
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
            <div className="flex flex-col justify-between gap-10">
              <>
                <div className="relative w-full h-full select-none">
                  {/* NAVER - chữ trên bên trái */}
                  <h1
                    className="w-full mr-[150px] text-center font-serif leading-none"
                    style={{
                      fontSize: "5rem",
                      fontWeight: 800,
                      color: "#FF8A3D",
                      lineHeight: 1,
                      fontFamily: "var(--font-super-maples), sans-serif",
                    }}
                  >
                    NAVER
                  </h1>

                  {/* Noveri - chữ dưới bên phải */}
                  <h1
                    className="text-center ml-[100px] font-bold leading-none"
                    style={{
                      fontSize: "7rem",
                      fontWeight: 900,
                      color: "#FFC107",
                      letterSpacing: "-6px",
                      lineHeight: 1,
                      textShadow: "3px 3px 10px rgba(0,0,0,0.25)",
                      fontFamily: "var(--font-super-maples), sans-serif",
                    }}
                  >
                    Noveri
                  </h1>
                </div>

                <p className="text-lg mt-4 opacity-80">
                  A unified space to think, verify, and store what actually
                  matters. Built for long-term knowledge, not just one-off
                  answers.
                </p>
              </>

              <div>
                <div className="relative">
                  <img
                    src={ship}
                    alt="ship"
                    className="w-[520px] h-auto object-cover"
                  />

                  <span
                    className="absolute text-4xl font-extrabold"
                    style={{
                      left: "55%",
                      bottom: "15%",
                      transform: "translateX(-50%)",
                      color: "black",
                      textShadow:
                        "0 0 8px #FF99FF, 0 0 15px #1ABC9C, 0 0 25px rgba(255,255,255,0.8)",
                      pointerEvents: "none",
                    }}
                  >
                    START
                  </span>

                  <button
                    onClick={handleLogin}
                    className="absolute"
                    style={{
                      left: "55%",
                      bottom: "13%",
                      transform: "translateX(-50%)",
                      width: "150px",
                      height: "50px",
                      background: "transparent",
                      border: "3px solid #FFB38A",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Box>
  );
}
