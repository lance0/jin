import { useState } from "react";
import { Button } from "./ui/button";
import { FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface WelcomeScreenProps {
  onChooseFolder: () => void;
}

export function WelcomeScreen({ onChooseFolder }: WelcomeScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // For Tauri, we need to handle file drops differently
    // The files will be available via the DataTransfer API
    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) {
      toast.error("No folder dropped. Please try again.");
      return;
    }

    // In Tauri, when you drag a folder, it comes through as a file with a path
    // We'll use the file picker instead since drag-drop of folders requires special permissions
    toast.info("Please use the folder picker button instead. Drag-and-drop requires special permissions in Tauri.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hedgehog illustration */}
        <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <div className="text-9xl animate-in zoom-in duration-500 delay-200" role="img" aria-label="Hedgehog">
            🦔
          </div>
        </div>

        {/* Main content */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          Jin
        </h1>
        <p className="mb-2 text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
          Scan your repo for .env, YAML, JSON, TOML and spot inconsistencies
        </p>
        <p className="mb-8 text-sm text-muted-foreground animate-in fade-in duration-500 delay-500">
          Local only. Nothing leaves your machine.
        </p>

        {/* Drop zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-6 rounded-lg border-2 border-dashed p-12 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-600 group ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02] shadow-xl"
              : "border-border bg-card hover:shadow-xl hover:border-primary hover:bg-accent hover:scale-[1.02]"
          }`}
        >
          <FolderOpen className={`mx-auto mb-4 h-12 w-12 transition-transform group-hover:scale-110 ${
            isDragging ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
          }`} />
          <p className="mb-4 text-sm text-muted-foreground">
            {isDragging ? "Drop folder here..." : "Drop a project folder to begin"}
          </p>
          <Button
            onClick={onChooseFolder}
            size="lg"
            className="gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FolderOpen className="h-5 w-5" />
            Choose a project folder
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground animate-in fade-in duration-500 delay-700">
          🦔 Jin — in loving memory. Keeping your variables cozy since 2025.
        </p>
      </div>
    </div>
  );
}
