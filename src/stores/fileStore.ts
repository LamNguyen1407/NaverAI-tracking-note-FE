import {create} from 'zustand'

interface FileStore {
    reloadFlag: number;
    triggerReload: () => void;
}

export const useFileStore = create<FileStore>((set) => ({
    reloadFlag: 0,
    triggerReload: () => set((state) => ({ reloadFlag: state.reloadFlag + 1 }))
}))