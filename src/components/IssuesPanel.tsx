import { Badge } from "./ui/badge";
import { AlertTriangle, FileWarning, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import type { ScanIssues } from "../types";

interface IssuesPanelProps {
  issues: ScanIssues;
}

export function IssuesPanel({ issues }: IssuesPanelProps) {
  const totalIssues =
    issues.duplicates.length +
    issues.missingByEnvFile.length +
    issues.parseErrors.length;

  if (totalIssues === 0) {
    return (
      <aside className="w-80 flex-shrink-0 border-r border-border bg-card p-6 shadow-sm animate-in slide-in-from-left duration-500">
        <div className="flex items-center gap-2 mb-4 animate-in fade-in duration-500 delay-100">
          <h2 className="text-sm font-semibold">Issues</h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 shadow-sm">
            <Check className="mr-1 h-3 w-3" />
            Healthy
          </Badge>
        </div>

        <div className="rounded-lg bg-success/5 border border-success/20 p-6 text-center shadow-sm animate-in zoom-in duration-500 delay-200">
          <Check className="mx-auto mb-2 h-8 w-8 text-success animate-in zoom-in duration-500 delay-300" />
          <p className="text-sm font-medium text-success">Looks good!</p>
          <p className="text-xs text-muted-foreground mt-1">No issues detected</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 flex-shrink-0 border-r border-border bg-card overflow-y-auto shadow-sm animate-in slide-in-from-left duration-500">
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10 shadow-sm">
        <div className="flex items-center gap-2 animate-in fade-in duration-500 delay-100">
          <h2 className="text-sm font-semibold">Issues</h2>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 shadow-sm animate-pulse">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {totalIssues}
          </Badge>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["missing", "duplicates"]} className="px-4 animate-in fade-in duration-500 delay-200">
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
                    className="rounded-md bg-warning/5 border border-warning/20 p-3 shadow-sm hover:shadow-md hover:border-warning/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${idx * 50}ms` }}
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
                    className="rounded-md bg-warning/5 border border-warning/20 p-3 shadow-sm hover:shadow-md hover:border-warning/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${idx * 50}ms` }}
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
                    className="rounded-md bg-destructive/5 border border-destructive/20 p-3 shadow-sm hover:shadow-md hover:border-destructive/30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${idx * 50}ms` }}
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
}
