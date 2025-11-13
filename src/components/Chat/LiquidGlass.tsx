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

    /* ⭐ gần như trong hoàn toàn */
    background: "rgba(255, 255, 255, 0.015)",

    /* ⭐ blur rất nhẹ → giữ nền rõ nhưng vẫn có glass */
    backdropFilter: `blur(${blur}px) saturate(160%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,

    /* ⭐ Viền glass nhẹ — KHÔNG sáng */
    border: "1px solid rgba(255, 255, 255, 0.18)",

    /* ⭐ Depth: tạo cảm giác “liquid” nhưng không chói */
    boxShadow: `
    inset 0 0 8px rgba(255, 255, 255, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.12)
  `,

    ...style,
  };

  return (
    <div className={className} style={glassStyle}>
      {children}
    </div>
  );
}
