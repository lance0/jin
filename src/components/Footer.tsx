import { memo, useState } from "react";
import { FileDown, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { ExportFormat } from "@/types"

interface FooterProps {
  onExport: (format: ExportFormat) => void
  issueCount: number
}

export const Footer = memo(function Footer({ onExport, issueCount }: FooterProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("env");

  const formatLabels: Record<ExportFormat, string> = {
    env: ".env",
    json: "JSON",
    yaml: "YAML",
  };

  return (
    <footer className="flex items-center justify-between border-t border-border bg-card px-6 py-4 shadow-sm">
      <div className="text-xs text-muted-foreground">
        {issueCount === 0 ? (
          <span className="text-success font-medium">✓ No issues detected</span>
        ) : (
          <span className="text-warning font-medium">
            {issueCount} {issueCount === 1 ? "issue" : "issues"} found
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:scale-105 active:scale-95 transition-transform">
          Learn best practices
          <ExternalLink className="h-3 w-3" />
        </Button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    {formatLabels[exportFormat]}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Choose export format</TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                <DropdownMenuRadioItem value="env">.env Format</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="json">JSON Format</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="yaml">YAML Format</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onExport(exportFormat)}
                className="gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-transform export-button"
              >
                <FileDown className="h-4 w-4" />
                Export Template
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export config template (⌘E / Ctrl+E)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  )
});
