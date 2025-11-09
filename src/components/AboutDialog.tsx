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
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";
import packageJson from "../../package.json";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestartTour: () => void;
}

export const AboutDialog = memo(function AboutDialog({ open, onOpenChange, onRestartTour }: AboutDialogProps) {
  const version = packageJson.version;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-center mb-2">
          <div className="text-4xl" role="img" aria-label="Hedgehog">
            🦔
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Jin</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Config File Guardian
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
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
          <div className="bg-muted/50 rounded-lg p-3 text-center space-y-1.5">
            <p className="text-sm font-medium text-foreground">
              In loving memory of Jin
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              Dedicated to Jin the hedgehog, who brought joy and warmth to everyone. May your variables always be cozy. 🦔💚
            </p>
            <p className="text-xs text-muted-foreground italic">
              2019 - 2025
            </p>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">What is Jin?</h4>
            <p className="text-xs text-muted-foreground leading-snug">
              Manage configuration files across your projects. Scan for .env, YAML, JSON, and TOML files, detect inconsistencies, and export templates—all locally.
            </p>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Features</h4>
            <ul className="text-xs text-muted-foreground space-y-0.5 pl-4">
              <li>• Multi-format support (.env, YAML, JSON, TOML)</li>
              <li>• Issue detection (missing keys, duplicates, errors)</li>
              <li>• Secret masking and click-to-reveal</li>
              <li>• Export templates in multiple formats</li>
              <li>• 100% local - no data leaves your machine</li>
            </ul>
          </div>

          <Separator />

          {/* Onboarding Tour */}
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Need Help?</h4>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                onOpenChange(false);
                onRestartTour();
              }}
            >
              <PlayCircle className="h-4 w-4" />
              Restart Onboarding Tour
            </Button>
          </div>

          <Separator />

          {/* Keyboard Shortcuts */}
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground text-sm">Keyboard Shortcuts</h4>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div className="flex justify-between items-center">
                <span>Open project</span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘O / Ctrl+O</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Rescan</span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘R / Ctrl+R</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Export</span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘E / Ctrl+E</kbd>
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
