import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Search, RefreshCw, Check, AlertTriangle, Eye, EyeOff, Copy, Columns, Files, FileSearch, SearchX } from "lucide-react";
import { toast } from "sonner";
import type { NormalizedEntry, DiscoveredFile } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface ConfigMatrixProps {
  entries: NormalizedEntry[];
  files: DiscoveredFile[];
  onRescan?: () => void;
}

export const ConfigMatrix = memo(function ConfigMatrix({ entries, files, onRescan }: ConfigMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [visibleFiles, setVisibleFiles] = useState<Set<string>>(new Set(files.map(f => f.path)));

  // Update visible files when files change
  useEffect(() => {
    setVisibleFiles(new Set(files.map(f => f.path)));
  }, [files]);

  // Filter to only visible files
  const activeFiles = useMemo(() =>
    files.filter(f => visibleFiles.has(f.path)),
    [files, visibleFiles]
  );

  const toggleFileVisibility = useCallback((path: string) => {
    setVisibleFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const showAllFiles = useCallback(() => {
    setVisibleFiles(new Set(files.map(f => f.path)));
  }, [files]);

  const hideAllFiles = useCallback(() => {
    setVisibleFiles(new Set());
  }, []);

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

  const copyAllFromFile = useCallback(async (filePath: string) => {
    try {
      // Get all entries from this file
      const fileEntries = entries.filter(e => e.sourceFile === filePath);

      // Format as KEY=VALUE lines
      const content = fileEntries
        .map(e => `${e.key}=${e.value ?? ''}`)
        .join('\n');

      await navigator.clipboard.writeText(content);
      toast.success(`Copied ${fileEntries.length} values from ${filePath.split('/').pop()}`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  }, [entries]);

  const maskValue = (value: any): string => {
    const str = String(value ?? "");
    if (str.length <= 4) return "****";
    return str.substring(0, 4) + "***";
  };

  if (files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <FileSearch className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No Config Files Found</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This folder doesn't contain any .env, YAML, JSON, or TOML config files.
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Try selecting a different folder or create some config files
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden config-matrix">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-6 py-3 shadow-sm">
        <div className="relative flex-1 max-w-sm search-bar">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Columns className="h-4 w-4" />
                  Columns ({activeFiles.length}/{files.length})
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show/hide file columns</TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={showAllFiles}>
              Show All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={hideAllFiles}>
              Hide All
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {files.map((file) => (
              <DropdownMenuCheckboxItem
                key={file.path}
                checked={visibleFiles.has(file.path)}
                onCheckedChange={() => toggleFileVisibility(file.path)}
              >
                {file.path}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {onRescan && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onRescan} variant="outline" size="sm" className="gap-2 bg-transparent group">
                <RefreshCw className="h-4 w-4 group-active:animate-spin" />
                Rescan
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rescan project (⌘R / Ctrl+R)</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Performance warning for large datasets */}
      {filteredKeys.length > 200 && (
        <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-sm text-amber-900 dark:text-amber-200">
            Showing {filteredKeys.length} keys. For better performance, try using search or hiding columns.
          </span>
        </div>
      )}

      {/* Matrix table */}
      <div className="flex-1 overflow-auto" style={{willChange: 'scroll-position'}}>
        <table className="w-full">
          <thead className="sticky top-0 bg-muted z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground border-b border-border">
                Key ({filteredKeys.length})
              </th>
              {activeFiles.map((file, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-semibold font-mono text-foreground border-b border-border"
                  title={file.path}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{file.path}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-60 hover:opacity-100 flex-shrink-0"
                          onClick={() => copyAllFromFile(file.path)}
                        >
                          <Files className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy all values from this file</TooltipContent>
                    </Tooltip>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={activeFiles.length + 1} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted p-4">
                      <SearchX className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-foreground">No matching keys</p>
                      <p className="text-xs text-muted-foreground">Try adjusting your search filter</p>
                    </div>
                  </div>
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
                    {activeFiles.map((file, fileIdx) => {
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
                            {isSecret ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => toggleReveal(key, file.path)}
                                    className="flex items-center gap-2 text-success hover:text-success/80"
                                  >
                                    {isRevealed ? (
                                      <>
                                        <Eye className="h-4 w-4" />
                                        <span className="font-mono text-xs">{displayValue}</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="h-4 w-4" />
                                        <span className="font-mono text-xs">{displayValue}</span>
                                      </>
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Click to reveal/hide secret value</TooltipContent>
                              </Tooltip>
                            ) : (
                              <button className="flex items-center gap-2 text-success hover:text-success/80">
                                <Check className="h-4 w-4" />
                                <span className="font-mono text-xs">{displayValue}</span>
                              </button>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => copyToClipboard(String(entry.value ?? ""), key)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
                                >
                                  <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Copy value</TooltipContent>
                            </Tooltip>
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
