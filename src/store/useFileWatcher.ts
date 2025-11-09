import { create } from 'zustand';

interface FileWatcherState {
  isWatching: boolean;
  watchingPath: string | null;
  setWatching: (isWatching: boolean, path: string | null) => void;
}

export const useFileWatcher = create<FileWatcherState>((set) => ({
  isWatching: false,
  watchingPath: null,
  setWatching: (isWatching, path) => set({ isWatching, watchingPath: path }),
}));
