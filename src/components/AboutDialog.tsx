import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = memo(function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const version = "1.0.0"; // TODO: Get from package.json or Tauri config

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl animate-in zoom-in duration-500" role="img" aria-label="Hedgehog">
              🦔
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Jin</DialogTitle>
          <DialogDescription className="text-center">
            Config File Guardian
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Version */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline">v{version}</Badge>
            <Badge variant="outline" className="bg-primary/10">
              Tauri 2
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              React 19
            </Badge>
          </div>

          <Separator />

          {/* Memorial */}
          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              In loving memory of Jin
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This app is dedicated to Jin the hedgehog, who brought joy and warmth to everyone around them.
              May your variables always be cozy. 🦔💚
            </p>
            <p className="text-xs text-muted-foreground italic">
              2019 - 2025
            </p>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">What is Jin?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jin helps you manage configuration files across your projects. Scan folders for .env, YAML, JSON,
              and TOML files, detect inconsistencies, and export template files—all locally on your machine.
            </p>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Features</h4>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              <li>• Multi-format support (.env, YAML, JSON, TOML)</li>
              <li>• Issue detection (missing keys, duplicates, parse errors)</li>
              <li>• Secret masking and click-to-reveal</li>
              <li>• Export templates in multiple formats</li>
              <li>• 100% local - no data leaves your machine</li>
            </ul>
          </div>

          <Separator />

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Keyboard Shortcuts</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Open project</span>
                <kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">⌘O / Ctrl+O</kbd>
              </div>
              <div className="flex justify-between">
                <span>Rescan project</span>
                <kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">⌘R / Ctrl+R</kbd>
              </div>
              <div className="flex justify-between">
                <span>Export template</span>
                <kbd className="px-2 py-0.5 rounded bg-muted font-mono text-xs">⌘E / Ctrl+E</kbd>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tech Stack */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Built with Tauri, React, Rust & love
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2025 · Privacy First · No Telemetry
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
