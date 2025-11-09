import { create } from 'zustand';
import type { ScanResult, DiscoveredFile, NormalizedEntry, ScanIssues, ScanSummary } from '../types';

interface ScanState {
  // State
  projectPath: string | null;
  files: DiscoveredFile[];
  entries: NormalizedEntry[];
  issues: ScanIssues;
  summary: ScanSummary;
  isScanning: boolean;
  error: string | null;

  // Actions
  setProjectPath: (path: string) => void;
  setScanResult: (result: ScanResult) => void;
  setIsScanning: (scanning: boolean) => void;
  setError: (error: string | null) => void;
  clearScan: () => void;
}

const initialState = {
  projectPath: null,
  files: [],
  entries: [],
  issues: {
    duplicates: [],
    missingByEnvFile: [],
    parseErrors: [],
  },
  summary: {
    totalFiles: 0,
    totalKeys: 0,
    uniqueKeys: 0,
  },
  isScanning: false,
  error: null,
};

export const useScan = create<ScanState>((set) => ({
  ...initialState,

  setProjectPath: (path) => set({ projectPath: path }),

  setScanResult: (result) => set({
    projectPath: result.root,
    files: result.files,
    entries: result.entries,
    issues: result.issues,
    summary: result.summary,
    isScanning: false,
    error: null,
  }),

  setIsScanning: (scanning) => set({ isScanning: scanning }),

  setError: (error) => set({ error, isScanning: false }),

  clearScan: () => set(initialState),
}));
