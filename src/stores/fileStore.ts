import { create } from 'zustand';

interface FileStore {
  reloadFlag: number;
  reloadNoteFlag: number;
  shouldReload: boolean;
  triggerReload: () => void;
  triggerReloadNote: () => void;
  clearReloadFlag: () => void; // dùng để reset shouldReload sau khi fetch
}

export const useFileStore = create<FileStore>((set) => ({
  reloadFlag: 0,
  reloadNoteFlag: 0,
  shouldReload: false,

  triggerReload: () => set((state) => ({
    reloadFlag: state.reloadFlag + 1,
    shouldReload: true,
  })),

  triggerReloadNote: () => set((state) => ({
    reloadFlag: state.reloadNoteFlag + 1,
  })),

  clearReloadFlag: () => set({ shouldReload: false }),
}));
