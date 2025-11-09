import { memo, useState } from "react";
import { FolderOpen, Moon, Sun, Info, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { AboutDialog } from "./AboutDialog"

interface HeaderProps {
  projectPath: string
  onProjectChange: () => void
  onRestartTour: () => void
  isWatching: boolean
  onToggleWatch: () => void
}

export const Header = memo(function Header({ projectPath, onProjectChange, onRestartTour, isWatching, onToggleWatch }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl transition-transform hover:scale-110" role="img" aria-label="Hedgehog">
            🦔
          </span>
          <h1 className="text-lg font-semibold text-foreground">
            Jin
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onProjectChange} className="gap-2 hover:scale-105 active:scale-95 transition-transform">
            <FolderOpen className="h-4 w-4" />
            <span className="max-w-xs truncate text-sm font-mono text-muted-foreground">{projectPath}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isWatching ? "default" : "ghost"}
          size="icon"
          onClick={onToggleWatch}
          aria-label={isWatching ? "Stop watching files" : "Watch files for changes"}
          className="hover:scale-110 active:scale-95 transition-transform relative"
          title={isWatching ? "Auto-rescan enabled" : "Click to enable auto-rescan"}
        >
          {isWatching ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          {isWatching && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-success rounded-full animate-pulse" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAboutOpen(true)}
          aria-label="About Jin"
          className="hover:scale-110 active:scale-95 transition-transform"
        >
          <Info className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="hover:scale-110 active:scale-95 transition-transform"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>

      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} onRestartTour={onRestartTour} />
    </header>
  )
})
