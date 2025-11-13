"use client";

import React, { CSSProperties, ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  borderRadius?: number;
  blur?: number;
  border?: boolean;
  style?: CSSProperties;
  className?: string;
}

export default function LiquidGlassWrapper({
  children,
  borderRadius = 20,
  blur = 20,
  border = true,
  style = {},
  className,
}: LiquidGlassProps) {
  const glassStyle: CSSProperties = {
    position: "relative",
    borderRadius,
    overflow: "hidden",

    // ⭐ Gần như trong suốt hoàn toàn
    background: "rgba(255, 255, 255, 0.05)",

    // ⭐ Hiệu ứng glass blur
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,

    // ⭐ Viền glass nhẹ
    border: border ? "1px solid rgba(255, 255, 255, 0.4)" : "none",

    // ⭐ Hiệu ứng reflection nhẹ
    boxShadow: `
      inset 0 0 0.6px rgba(255, 255, 255, 0.5),
      inset 0 0 20px rgba(255, 255, 255, 0.2),
      0 4px 20px rgba(0,0,0,0.15)
    `,

    ...style,
  };

  return (
    <div className={className} style={glassStyle}>
      {children}
    </div>
  );
}
