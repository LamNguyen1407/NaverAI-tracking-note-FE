"use client";

import { useState } from "react";
import Sidebar from "@/components/Editor/Sidebar";
import { SidebarContext } from "@/context/SidebarContext";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ toggleSidebar }}>
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
      {children}
    </SidebarContext.Provider>
  );
}
