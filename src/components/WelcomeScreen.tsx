import { Button } from "./ui/button";
import { FolderOpen } from "lucide-react";

interface WelcomeScreenProps {
  onChooseFolder: () => void;
}

export function WelcomeScreen({ onChooseFolder }: WelcomeScreenProps) {

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

        {/* Call to action */}
        <div className="mb-6 rounded-lg border-2 border-border bg-card p-12 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-600">
          <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-6 text-sm text-muted-foreground">
            Select a project folder to begin scanning
          </p>
          <Button
            onClick={onChooseFolder}
            size="lg"
            className="gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FolderOpen className="h-5 w-5" />
            Choose Project Folder
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
