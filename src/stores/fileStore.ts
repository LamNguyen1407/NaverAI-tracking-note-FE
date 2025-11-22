import { create } from 'zustand';

interface FileStore {
  reloadFlag: number;
  shouldReload: boolean;
  triggerReload: () => void;
  clearReloadFlag: () => void; // dùng để reset shouldReload sau khi fetch
}

export const useFileStore = create<FileStore>((set) => ({
  reloadFlag: 0,
  shouldReload: false,

  triggerReload: () => set((state) => ({
    reloadFlag: state.reloadFlag + 1,
    shouldReload: true,
  })),

  clearReloadFlag: () => set({ shouldReload: false }),
}));
