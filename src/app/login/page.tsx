"use client";

import React from "react";
import { GlassCard } from "@developer-hub/liquid-glass";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/content/editor");
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video background */}
      {/* <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/wave2.mp4" // đặt video trong public/videos
        autoPlay
        loop
        muted
        playsInline
      /> */}
      <img
        src="/assets/login4.png"
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="background"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10">
        <GlassCard blurAmount={0} cornerRadius={100} shadowMode={false}>
          <div className="flex flex-col justify-center items-center space-y-6 p-10 text-center w-[560px] max-w-[94vw] min-h-[300px]">
            <h3 className="text-4xl font-bold text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
              Welcome Back
            </h3>

            <div className="text-lg text-white/90 leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] max-w-[480px] text-center">
              <p>YOUR NOTES. YOUR KNOWLEDGE.</p>
              <p>SMARTER WITH AI</p>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-[380px]">
              <input
                type="text"
                placeholder="Username"
                className="w-full py-3 px-5 rounded-full bg-white/20 text-white placeholder-white/60 outline-none focus:bg-white/30 transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 px-5 rounded-full bg-white/20 text-white placeholder-white/60 outline-none focus:bg-white/30 transition"
              />
              <button
                onClick={handleLogin}
                className="cursor-pointer py-3 mt-2 w-full bg-orange-700 border border-orange-700 text-white rounded-full hover:bg-orange-600 transition"
              >
                Login
              </button>
            </div>

            <p className="text-sm text-white/70 mt-6">
              Don’t have an account?{" "}
              <a href="#" className="text-orange-400 hover:underline">
                Create one now
              </a>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
