import { useMemo, useCallback, useEffect, useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { toast, Toaster } from "sonner";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Header } from "./components/Header";
import { IssuesPanel } from "./components/IssuesPanel";
import { ConfigMatrix } from "./components/ConfigMatrix";
import { Footer } from "./components/Footer";
import { OnboardingTour } from "./components/OnboardingTour";
import { useScan } from "./store/useScan";
import { useFileWatcher } from "./store/useFileWatcher";
import type { ScanResult } from "./types";

const TOUR_COMPLETED_KEY = "jin-onboarding-tour-completed";

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

  // Onboarding tour state
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);

  // File watcher state
  const isWatching = useFileWatcher((state) => state.isWatching);
  const setWatching = useFileWatcher((state) => state.setWatching);

  // Calculate issue count
  const issueCount = useMemo(
    () =>
      issues.duplicates.length +
      issues.missingByEnvFile.length +
      issues.parseErrors.length,
    [issues]
  );

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

  const handleExport = useCallback(async (format: 'env' | 'json' | 'yaml') => {
    if (!projectPath || entries.length === 0) {
      toast.error("No data to export", {
        description: "Please scan a project folder first"
      });
      return;
    }

    try {
      // Determine file extension and filter based on format
      const fileExtensions: Record<'env' | 'json' | 'yaml', { name: string; extensions: string[]; defaultName: string }> = {
        env: { name: 'Environment Files', extensions: ['example', 'env'], defaultName: '.env.example' },
        json: { name: 'JSON Files', extensions: ['json'], defaultName: 'config.example.json' },
        yaml: { name: 'YAML Files', extensions: ['yaml', 'yml'], defaultName: 'config.example.yaml' },
      };

      const fileConfig = fileExtensions[format];

      // Show save dialog to choose export location
      const outputPath = await save({
        defaultPath: `${projectPath}/${fileConfig.defaultName}`,
        filters: [{
          name: fileConfig.name,
          extensions: fileConfig.extensions
        }],
        title: 'Save Environment Template'
      });

      // User cancelled the dialog
      if (!outputPath) {
        return;
      }

      // Call backend to export
      await invoke<string>("export_env_example_cmd", {
        outputPath,
        entries,
        format,
      });

      const formatLabels: Record<'env' | 'json' | 'yaml', string> = {
        env: '.env',
        json: 'JSON',
        yaml: 'YAML',
      };

      toast.success("Environment template created!", {
        description: `Exported ${entries.length} keys as ${formatLabels[format]}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (errorMessage.includes("permission")) {
        toast.error("Export failed", {
          description: "You don't have permission to write to this location"
        });
      } else {
        toast.error("Export failed", {
          description: errorMessage
        });
      }
    }
  }, [projectPath, entries]);

  // Check if user has completed the tour
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      setShouldShowTour(true);
    }
  }, []);

  // Show tour after first scan completes (if user hasn't seen it)
  useEffect(() => {
    if (shouldShowTour && projectPath && !isScanning && files.length > 0) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        setIsTourOpen(true);
        setShouldShowTour(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, projectPath, isScanning, files.length]);

  const handleTourClose = useCallback(() => {
    setIsTourOpen(false);
    localStorage.setItem(TOUR_COMPLETED_KEY, "true");
  }, []);

  const handleRestartTour = useCallback(() => {
    if (projectPath) {
      setIsTourOpen(true);
    } else {
      toast.info("Open a project first to start the tour");
    }
  }, [projectPath]);

  const handleToggleWatch = useCallback(async () => {
    try {
      if (isWatching) {
        // Stop watching
        await invoke("stop_file_watching");
        setWatching(false, null);
        toast.success("Stopped watching for file changes");
      } else {
        // Start watching
        if (!projectPath) {
          toast.error("No project folder selected");
          return;
        }
        await invoke("start_file_watching", { path: projectPath });
        setWatching(true, projectPath);
        toast.success("Now watching for file changes");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error("Failed to toggle file watching", {
        description: errorMessage
      });
    }
  }, [isWatching, projectPath, setWatching]);

  // Listen for file change events from the watcher
  useEffect(() => {
    const unlisten = listen("config-files-changed", async () => {
      if (projectPath && isWatching) {
        toast.info("Config files changed, rescanning...");
        await scanFolder(projectPath);
      }
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [projectPath, isWatching, scanFolder]);

  // Check watcher status on mount
  useEffect(() => {
    const checkWatcherStatus = async () => {
      try {
        const [watching, path] = await invoke<[boolean, string | null]>("get_file_watching_status");
        setWatching(watching, path);
      } catch (err) {
        console.error("Failed to check watcher status:", err);
      }
    };
    checkWatcherStatus();
  }, [setWatching]);

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
          handleExport('env');
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
        <Toaster position="top-right" richColors closeButton />
      </>
    );
  }

  // Show main workspace
  return (
    <div className="flex flex-col h-screen">
      <Header
        projectPath={projectPath}
        onProjectChange={handleChooseFolder}
        onRestartTour={handleRestartTour}
        isWatching={isWatching}
        onToggleWatch={handleToggleWatch}
      />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <IssuesPanel issues={issues} />
        <ConfigMatrix
          entries={entries}
          files={files}
          onRescan={handleRescan}
        />
      </div>

      <Footer
        issueCount={issueCount}
        onExport={handleExport}
      />

      <Toaster position="top-right" richColors closeButton />

      <OnboardingTour isOpen={isTourOpen} onClose={handleTourClose} />

      {isScanning && (
        <div className="fixed inset-0 bg-background/95 z-50 animate-in fade-in duration-300">
          <div className="flex h-full">
            {/* Skeleton Header */}
            <div className="absolute top-0 left-0 right-0 h-[57px] border-b border-border bg-card px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                    <div className="w-12 h-6 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="w-48 h-8 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-muted rounded animate-pulse"></div>
                  <div className="w-9 h-9 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Issues Panel */}
            <div className="w-80 flex-shrink-0 border-r border-border bg-card mt-[57px] p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-5 bg-muted rounded animate-pulse"></div>
                  <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton Main Content with Loading Message */}
            <div className="flex-1 mt-[57px] p-6 flex flex-col items-center justify-center">
              <div className="max-w-md w-full space-y-6">
                {/* Animated loader */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full"></div>
                    <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-t-primary/50 rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Loading text */}
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold text-foreground">Scanning project...</p>
                  <p className="text-sm text-muted-foreground animate-pulse">Discovering config files</p>
                </div>

                {/* Skeleton table preview */}
                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-8 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex-1 h-12 bg-muted rounded animate-pulse" style={{ animationDelay: `${(i + j) * 50}ms` }}></div>
                      ))}
                    </div>
                  ))}
                </div>
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
