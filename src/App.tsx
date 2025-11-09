import { useMemo, useCallback, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { toast, Toaster } from "sonner";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Header } from "./components/Header";
import { IssuesPanel } from "./components/IssuesPanel";
import { ConfigMatrix } from "./components/ConfigMatrix";
import { Footer } from "./components/Footer";
import { useScan } from "./store/useScan";
import type { ScanResult } from "./types";

function App() {
  // Use selective Zustand subscriptions to prevent unnecessary re-renders
  const projectPath = useScan((state) => state.projectPath);
  const files = useScan((state) => state.files);
  const entries = useScan((state) => state.entries);
  const issues = useScan((state) => state.issues);
  const isScanning = useScan((state) => state.isScanning);
  const error = useScan((state) => state.error);
  const setScanResult = useScan((state) => state.setScanResult);
  const setIsScanning = useScan((state) => state.setIsScanning);
  const setError = useScan((state) => state.setError);

  const scanFolder = useCallback(async (path: string) => {
    try {
      setIsScanning(true);
      setError(null);

      const result = await invoke<ScanResult>("scan_folder", { path });
      setScanResult(result);

      const { totalFiles, uniqueKeys } = result.summary;
      const issueCount = result.issues.duplicates.length +
                         result.issues.missingByEnvFile.length +
                         result.issues.parseErrors.length;

      if (issueCount > 0) {
        toast.warning(`Found ${issueCount} issue${issueCount === 1 ? '' : 's'} across ${totalFiles} config files`, {
          description: `Scanned ${uniqueKeys} unique keys`
        });
      } else {
        toast.success(`All config files look good!`, {
          description: `${totalFiles} files, ${uniqueKeys} keys`
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);

      // Provide more helpful error messages
      if (errorMessage.includes("does not exist")) {
        toast.error("Folder not found", {
          description: "The selected folder no longer exists or you don't have permission to access it."
        });
      } else if (errorMessage.includes("not a directory")) {
        toast.error("Invalid selection", {
          description: "Please select a folder, not a file."
        });
      } else {
        toast.error("Scan failed", {
          description: errorMessage
        });
      }
    } finally {
      setIsScanning(false);
    }
  }, [setScanResult, setIsScanning, setError]);

  const handleChooseFolder = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Choose a project folder",
      });

      if (selected && typeof selected === "string") {
        await scanFolder(selected);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Failed to open folder dialog", {
        description: errorMessage
      });
    }
  }, [scanFolder]);

  const handleRescan = useCallback(() => {
    if (projectPath) {
      scanFolder(projectPath);
    }
  }, [projectPath, scanFolder]);

  const handleExport = useCallback(async () => {
    if (!projectPath || entries.length === 0) {
      toast.error("No data to export", {
        description: "Please scan a project folder first"
      });
      return;
    }

    try {
      const path = await invoke<string>("export_env_example_cmd", {
        path: projectPath,
        entries,
      });
      toast.success(".env.example created!", {
        description: `Exported ${entries.length} keys to project root`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("permission")) {
        toast.error("Export failed", {
          description: "You don't have permission to write to this folder"
        });
      } else {
        toast.error("Export failed", {
          description: errorMessage
        });
      }
    }
  }, [projectPath, entries]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === 'o') {
        e.preventDefault();
        handleChooseFolder();
      } else if (modKey && e.key === 'r') {
        e.preventDefault();
        if (projectPath) {
          handleRescan();
        } else {
          toast.info("No project opened yet");
        }
      } else if (modKey && e.key === 'e') {
        e.preventDefault();
        if (projectPath) {
          handleExport();
        } else {
          toast.info("No project opened yet");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChooseFolder, handleRescan, handleExport, projectPath]);

  // Show welcome screen if no project selected
  if (!projectPath) {
    return (
      <>
        <WelcomeScreen onChooseFolder={handleChooseFolder} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Show main workspace
  return (
    <div className="flex flex-col h-screen">
      <Header projectPath={projectPath} onProjectChange={handleChooseFolder} />

      <div className="flex flex-1 overflow-hidden">
        <IssuesPanel issues={issues} />
        <ConfigMatrix
          entries={entries}
          files={files}
          onRescan={handleRescan}
        />
      </div>

      <Footer
        issueCount={useMemo(
          () =>
            issues.duplicates.length +
            issues.missingByEnvFile.length +
            issues.parseErrors.length,
          [issues]
        )}
        onExport={handleExport}
      />

      <Toaster position="top-right" richColors />

      {isScanning && (
        <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-card p-8 rounded-lg shadow-2xl border border-border animate-in zoom-in duration-300 delay-100">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="animate-spin h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full"></div>
                <div className="absolute inset-0 h-12 w-12 border-4 border-transparent border-t-primary/50 rounded-full animate-ping"></div>
              </div>
              <div className="text-center">
                <span className="text-lg font-medium text-foreground">
                  Scanning project...
                </span>
                <p className="text-sm text-muted-foreground mt-1 animate-pulse">
                  Finding config files
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-2xl border border-destructive-foreground/20 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-destructive-foreground/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚠</span>
            </div>
            <div>
              <strong className="font-semibold">Error:</strong> {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
