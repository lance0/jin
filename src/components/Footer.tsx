import { memo } from "react";
import { FileDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FooterProps {
  onExport: () => void
  issueCount: number
}

export const Footer = memo(function Footer({ onExport, issueCount }: FooterProps) {
  const { toast } = useToast()

  const handleExport = () => {
    onExport()
    toast({
      title: ".env.example saved",
      description: "Your environment template has been created.",
      action: (
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <ExternalLink className="h-3 w-3" />
          Reveal
        </Button>
      ),
    })
  }

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
        <Button onClick={handleExport} className="gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-transform">
          <FileDown className="h-4 w-4" />
          Export .env.example
        </Button>
      </div>
    </footer>
  )
});
