import { memo, useMemo } from "react";
import { Badge } from "./ui/badge";
import { AlertTriangle, FileWarning, Check, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import type { ScanIssues } from "../types";

interface IssuesPanelProps {
  issues: ScanIssues;
}

export const IssuesPanel = memo(function IssuesPanel({ issues }: IssuesPanelProps) {
  const totalIssues = useMemo(
    () =>
      issues.duplicates.length +
      issues.missingByEnvFile.length +
      issues.parseErrors.length,
    [issues]
  );

  if (totalIssues === 0) {
    return (
      <aside className="w-full md:w-80 flex-shrink-0 border-r md:border-r border-b md:border-b-0 border-border bg-card p-4 md:p-6 shadow-sm issues-panel">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold">Issues</h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 shadow-sm">
            <Check className="mr-1 h-3 w-3" />
            Healthy
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Celebration card */}
          <div className="rounded-lg bg-gradient-to-br from-success/10 via-success/5 to-transparent border border-success/30 p-4 md:p-6 text-center shadow-sm">
            <div className="relative inline-block mb-3">
              <Check className="h-12 w-12 text-success" />
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-success animate-pulse" />
            </div>
            <p className="text-base font-semibold text-success mb-1">All Clear!</p>
            <p className="text-sm text-foreground/80 mb-2">Your configs are in perfect harmony</p>
            <p className="text-xs text-muted-foreground">No duplicates, no missing keys, no errors</p>
          </div>

          {/* Fun tip */}
          <div className="rounded-lg bg-muted/30 border border-border/50 p-4 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Keep your variables cozy and your configs tidy!
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-80 flex-shrink-0 border-r md:border-r border-b md:border-b-0 border-border bg-card overflow-y-auto shadow-sm issues-panel">
      <div className="sticky top-0 bg-card border-b border-border p-3 md:p-4 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Issues</h2>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 shadow-sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {totalIssues}
          </Badge>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["missing", "duplicates"]} className="px-3 md:px-4 pb-4">
        {issues.missingByEnvFile.length > 0 && (
          <AccordionItem value="missing">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Missing Keys</span>
                <Badge variant="secondary" className="ml-auto">
                  {issues.missingByEnvFile.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {issues.missingByEnvFile.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-md bg-warning/5 border border-warning/20 p-3 shadow-sm hover:shadow-md hover:border-warning/30 transition-shadow"
                  >
                    <p className="text-xs font-semibold mb-1">{item.file}</p>
                    <div className="space-y-0.5">
                      {item.missingKeys.map((key, kidx) => (
                        <p key={kidx} className="text-xs font-mono text-muted-foreground">
                          {key}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {issues.duplicates.length > 0 && (
          <AccordionItem value="duplicates">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-warning" />
                <span>Duplicates</span>
                <Badge variant="secondary" className="ml-auto">
                  {issues.duplicates.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {issues.duplicates.map((dup, idx) => (
                  <div
                    key={idx}
                    className="rounded-md bg-warning/5 border border-warning/20 p-3 shadow-sm hover:shadow-md hover:border-warning/30 transition-shadow"
                  >
                    <p className="text-xs font-mono font-semibold mb-1">{dup.key}</p>
                    <p className="text-xs text-muted-foreground">Found in: {dup.files.join(", ")}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {issues.parseErrors.length > 0 && (
          <AccordionItem value="parse-errors">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <FileWarning className="h-4 w-4 text-destructive" />
                <span>Parse Errors</span>
                <Badge variant="destructive" className="ml-auto">
                  {issues.parseErrors.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {issues.parseErrors.map((err, idx) => (
                  <div
                    key={idx}
                    className="rounded-md bg-destructive/5 border border-destructive/20 p-3 shadow-sm hover:shadow-md hover:border-destructive/30 transition-shadow"
                  >
                    <p className="text-xs font-mono font-semibold mb-1">{err.file}</p>
                    <p className="text-xs text-muted-foreground">{err.message}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </aside>
  );
});
