/** One detected secret on a line */
export type Finding = {
  line: number;
  type: string;
  preview: string;
};

/** Aggregated findings for a single file */
export type ScanResult = {
  file: string;
  findings: Finding[];
  commitSha?: string;
  commitDate?: string;
};

/** API `meta` object — shape varies slightly by quick vs deep mode */
export type ScanMeta = {
  mode: "quick" | "deep";
  scannedFiles: number;
  maxFiles?: number;
  maxCommits?: number;
  maxFilesPerCommit?: number;
  maxHistoryFiles?: number;
  commitsScanned?: number;
  skippedLargeFilesOverBytes?: number;
};

export type ScanResponse = {
  results: ScanResult[];
  meta: ScanMeta;
};
