import { FolderOpen, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface HeaderProps {
  projectPath: string
  onProjectChange: () => void
}

export function Header({ projectPath, onProjectChange }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3 shadow-sm animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 animate-in fade-in duration-500 delay-100">
          <span className="text-xl transition-transform hover:scale-110" role="img" aria-label="Hedgehog">
            🦔
          </span>
          <h1 className="text-lg font-semibold text-foreground">
            Jin
          </h1>
        </div>

        <div className="flex items-center gap-2 animate-in fade-in duration-500 delay-200">
          <Button variant="ghost" size="sm" onClick={onProjectChange} className="gap-2 hover:scale-105 active:scale-95 transition-all">
            <FolderOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="max-w-xs truncate text-sm font-mono text-muted-foreground">{projectPath}</span>
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="hover:scale-110 active:scale-95 transition-all animate-in fade-in duration-500 delay-300"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </header>
  )
}
