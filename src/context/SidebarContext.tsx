"use client";

import { createContext, useContext } from "react";

export const SidebarContext = createContext({
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
