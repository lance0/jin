export type SourceFormat = 'env' | 'yaml' | 'json' | 'toml';

export type ExportFormat = 'env' | 'json' | 'yaml';

export type InferredType = 'string' | 'number' | 'boolean' | 'null' | 'unknown';

export interface NormalizedEntry {
  key: string;
  value?: string | number | boolean | null;
  sourceFile: string; // relative to root
  sourceFormat: SourceFormat;
  inferredType: InferredType;
  isSecretGuess?: boolean;
}

export interface DiscoveredFile {
  path: string;
  format: SourceFormat;
  count: number;
}

export interface Duplicate {
  key: string;
  files: string[];
}

export interface MissingKeys {
  file: string;
  missingKeys: string[];
}

export interface ParseError {
  file: string;
  message: string;
}

export interface ScanIssues {
  duplicates: Duplicate[];
  missingByEnvFile: MissingKeys[];
  parseErrors: ParseError[];
}

export interface ScanSummary {
  totalFiles: number;
  totalKeys: number;
  uniqueKeys: number;
}

export interface ScanResult {
  root: string;
  files: DiscoveredFile[];
  entries: NormalizedEntry[];
  issues: ScanIssues;
  summary: ScanSummary;
}
