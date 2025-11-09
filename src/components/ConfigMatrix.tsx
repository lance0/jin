import { useState, useMemo, useCallback, memo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, RefreshCw, Check, AlertTriangle, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import type { NormalizedEntry, DiscoveredFile } from "../types";

interface ConfigMatrixProps {
  entries: NormalizedEntry[];
  files: DiscoveredFile[];
  onRescan?: () => void;
}

export const ConfigMatrix = memo(function ConfigMatrix({ entries, files, onRescan }: ConfigMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

  // Get unique keys
  const uniqueKeys = useMemo(() => {
    const keys = new Set<string>();
    entries.forEach((entry) => keys.add(entry.key));
    return Array.from(keys).sort();
  }, [entries]);

  // Filter keys by search
  const filteredKeys = useMemo(() => {
    if (!searchQuery) return uniqueKeys;
    const query = searchQuery.toLowerCase();
    return uniqueKeys.filter((key) => key.toLowerCase().includes(query));
  }, [uniqueKeys, searchQuery]);

  // Create a map of key -> file -> entry
  const entryMap = useMemo(() => {
    const map = new Map<string, Map<string, NormalizedEntry>>();
    entries.forEach((entry) => {
      if (!map.has(entry.key)) {
        map.set(entry.key, new Map());
      }
      map.get(entry.key)!.set(entry.sourceFile, entry);
    });
    return map;
  }, [entries]);

  const toggleReveal = useCallback((key: string, file: string) => {
    const id = `${key}:${file}`;
    setRevealedSecrets((prev) => {
      const newRevealed = new Set(prev);
      if (newRevealed.has(id)) {
        newRevealed.delete(id);
      } else {
        newRevealed.add(id);
      }
      return newRevealed;
    });
  }, []);

  const copyToClipboard = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied "${key}" to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const maskValue = (value: any): string => {
    const str = String(value ?? "");
    if (str.length <= 4) return "****";
    return str.substring(0, 4) + "***";
  };

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-muted-foreground">No config files found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-6 py-3 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {onRescan && (
          <Button onClick={onRescan} variant="outline" size="sm" className="gap-2 bg-transparent group">
            <RefreshCw className="h-4 w-4 group-active:animate-spin" />
            Rescan
          </Button>
        )}
      </div>

      {/* Matrix table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground border-b border-border">
                Key ({filteredKeys.length})
              </th>
              {files.map((file, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-semibold font-mono text-foreground border-b border-border"
                  title={file.path}
                >
                  {file.path}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={files.length + 1} className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No keys match filter
                </td>
              </tr>
            ) : (
              filteredKeys.map((key, keyIdx) => {
                const fileEntries = entryMap.get(key)!;
                return (
                  <tr
                    key={keyIdx}
                    className={`${keyIdx % 2 === 0 ? "bg-background" : "bg-muted/30"} hover:bg-accent/50`}
                  >
                    <td className="px-6 py-3 text-sm font-mono font-medium text-foreground">{key}</td>
                    {files.map((file, fileIdx) => {
                      const entry = fileEntries.get(file.path);
                      const cellId = `${key}:${file.path}`;
                      const isRevealed = revealedSecrets.has(cellId);

                      if (!entry) {
                        return (
                          <td key={fileIdx} className="px-6 py-3 text-sm">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          </td>
                        );
                      }

                      const isSecret = entry.isSecretGuess;
                      const displayValue = isSecret && !isRevealed
                        ? "••••••••"
                        : String(entry.value ?? "");

                      return (
                        <td key={fileIdx} className="px-6 py-3 text-sm">
                          <div className="flex items-center gap-2 group">
                            <button
                              onClick={() => isSecret ? toggleReveal(key, file.path) : undefined}
                              className="flex items-center gap-2 text-success hover:text-success/80"
                            >
                              {isRevealed ? (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span className="font-mono text-xs">{displayValue}</span>
                                </>
                              ) : (
                                <>
                                  {isSecret ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                  <span className="font-mono text-xs">{displayValue}</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(String(entry.value ?? ""), key)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
                              title="Copy value"
                            >
                              <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
