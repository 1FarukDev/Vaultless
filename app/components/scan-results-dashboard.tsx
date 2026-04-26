"use client";

import type { Finding, ScanMeta, ScanResult } from "@/lib/types/scan";
import { redactPreview } from "@/lib/redact-preview";

export type ScanResultsDashboardProps = {
  results: ScanResult[];
  meta: ScanMeta;
};

function typeBadgeStyles(type: string): string {
  const key = type.toLowerCase();
  if (key.includes("token") || key.includes("github"))
    return "border-white/45 bg-white/12 text-white/95";
  if (key.includes("api"))
    return "border-white/35 bg-white/8 text-white/90";
  if (key.includes("password") || key.includes("secret"))
    return "border-white/30 bg-white/6 text-white/88";
  if (key.includes("aws") || key.includes("mongo") || key.includes("postgres") || key.includes("mysql"))
    return "border-white/28 bg-white/5 text-white/85";
  if (key.includes("env"))
    return "border-white/40 bg-white/10 text-white/92";
  return "border-white/25 bg-white/5 text-white/80";
}

function totalSecretCount(results: ScanResult[]): number {
  return results.reduce((n, r) => n + r.findings.length, 0);
}

export default function ScanResultsDashboard({
  results,
  meta,
}: ScanResultsDashboardProps) {
  const secrets = totalSecretCount(results);
  const filesAffected = results.length;
  const scanned = meta.scannedFiles ?? 0;
  const modeLabel = meta.mode === "deep" ? "Deep (history)" : "Quick (HEAD)";

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-[#0a0a0a] p-10 text-center">
        <div
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border-2 border-white/30 text-3xl text-white"
          aria-hidden
        >
          ✓
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-white">
          No secrets found
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
          Nothing matched the current rules in this scan. You can run a deep
          history scan or adjust patterns if you expect leaks in older commits.
        </p>
        <p className="mt-6 font-mono text-xs text-white/40">
          {scanned} files scanned · {modeLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 rounded-2xl border border-white/20 bg-[#0a0a0a] p-6 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/20 bg-white/3 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            Secrets
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-white">
            {secrets}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/3 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            Files affected
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-white">
            {filesAffected}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/3 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            Files scanned
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-white">
            {scanned}
          </p>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/3 px-4 py-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            Mode
          </p>
          <p className="mt-1 font-mono text-sm font-medium leading-snug text-white/90">
            {modeLabel}
          </p>
          {meta.mode === "deep" && meta.commitsScanned != null && (
            <p className="mt-1 font-mono text-[10px] text-white/45">
              {meta.commitsScanned} commits in window
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-white/50">
          Findings
        </h3>
        <ul className="space-y-4">
          {results.map((fileResult) => (
            <li
              key={`${fileResult.file}-${fileResult.commitSha ?? "head"}`}
              className="rounded-xl border border-white/18 bg-white/2 p-5"
            >
              <div className="mb-4 flex flex-col gap-1 border-b border-white/10 pb-3">
                <p className="break-all font-mono text-sm font-medium text-white">
                  {fileResult.file}
                </p>
                {fileResult.commitSha && (
                  <p className="font-mono text-[10px] text-white/45">
                    Commit {fileResult.commitSha.slice(0, 7)}
                    {fileResult.commitDate
                      ? ` · ${fileResult.commitDate}`
                      : ""}
                  </p>
                )}
              </div>

              <ul className="space-y-3">
                {fileResult.findings.map((finding: Finding, idx: number) => (
                  <li
                    key={`${finding.line}-${finding.type}-${idx}`}
                    className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className="inline-flex rounded border border-white/35 bg-white/8 px-2 py-0.5 font-mono text-[11px] text-white/85">
                        L{finding.line}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${typeBadgeStyles(finding.type)}`}
                      >
                        {finding.type}
                      </span>
                    </div>
                    <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs leading-relaxed text-white/80">
                      {redactPreview(finding.preview)}
                    </pre>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-white/10 pt-4">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border border-white/25 px-3 py-1.5 font-mono text-xs text-white/35"
                >
                  Clean this file
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          disabled
          className="rounded-full border border-white/20 bg-transparent px-5 py-2 font-mono text-xs text-white/35"
        >
          Download cleaned files
        </button>
        <button
          type="button"
          disabled
          className="rounded-full border border-white/20 bg-transparent px-5 py-2 font-mono text-xs text-white/35"
        >
          Commit fixes to GitHub
        </button>
      </div>
    </div>
  );
}
