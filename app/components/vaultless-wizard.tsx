"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { GITHUB_OAUTH_SCOPE } from "@/lib/github-oauth-scope";
import type { RepoListItem } from "@/lib/types/repo";
import type { ScanMeta, ScanResult } from "@/lib/types/scan";
import { redactPreview } from "@/lib/redact-preview";
import {
  parseGithubRepoUrl,
  repoListItemFromGithubRef,
} from "@/lib/parse-github-repo-url";

type Step = 1 | 2 | 3 | 4;

type ScanMode = "quick" | "deep";

type CleanSuccess =
  | { mode: "pr"; prUrl: string }
  | { mode: "main"; branch: string };

const STEP_LABELS = [
  "Connect",
  "Select Repo",
  "Scan",
  "Clean & Fix",
] as const;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function typeBadgeClass(type: string): string {
  const k = type.toLowerCase();
  if (k.includes("token")) return "border-[#00FF85]/50 bg-[#00FF85]/15 text-white";
  if (k.includes("api")) return "border-white/35 bg-white/10 text-white/90";
  if (k.includes("password") || k.includes("secret"))
    return "border-white/30 bg-white/8 text-white/85";
  return "border-white/25 bg-white/6 text-white/80";
}

export type VaultlessWizardProps = {
  initialRepos: RepoListItem[];
  isAuthenticated: boolean;
};

export default function VaultlessWizard({
  initialRepos,
  isAuthenticated: serverAuthed,
}: VaultlessWizardProps) {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<Step>(serverAuthed ? 2 : 1);
  const [repos, setRepos] = useState(initialRepos);
  const [repoQuery, setRepoQuery] = useState("");
  const [repoLinkInput, setRepoLinkInput] = useState("");
  const [repoLinkError, setRepoLinkError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<RepoListItem | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("quick");
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanMeta, setScanMeta] = useState<ScanMeta | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleaningStrategy, setCleaningStrategy] = useState<
    "pr" | "main" | null
  >(null);
  const [cleanSuccess, setCleanSuccess] = useState<CleanSuccess | null>(null);
  const [cleanError, setCleanError] = useState<string | null>(null);

  const logRef = useRef<HTMLPreElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clientAuthed = status === "authenticated";
  const authed = clientAuthed || serverAuthed;

  useEffect(() => {
    if (status !== "authenticated" || step !== 1) return;
    startTransition(() => {
      setStep(2);
    });
  }, [status, step]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (repos.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/repos");
        const data = await res.json();
        if (!cancelled && Array.isArray(data.repos)) {
          setRepos(data.repos);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, repos.length]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scanLogs]);

  const appendLog = useCallback((line: string) => {
    setScanLogs((prev) => [...prev, line]);
  }, []);

  const stopScanAnimation = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current);
      logIntervalRef.current = null;
    }
  }, []);

  const globalBusy = scanning || cleaning;

  function applyRepoFromLink() {
    setRepoLinkError(null);
    const parsed = parseGithubRepoUrl(repoLinkInput);
    if (!parsed) {
      setRepoLinkError(
        "Enter a valid GitHub URL or owner/repo (e.g. https://github.com/org/app or org/app).",
      );
      return;
    }
    setSelectedRepo(
      repoListItemFromGithubRef(parsed.owner, parsed.repo),
    );
  }

  const filteredRepos = repos.filter((r) => {
    const q = repoQuery.trim().toLowerCase();
    if (!q) return true;
    return `${r.name} ${r.description ?? ""} ${r.language ?? ""}`
      .toLowerCase()
      .includes(q);
  });

  async function runScan() {
    if (!selectedRepo) return;
    const { owner, name: repo } = selectedRepo;
    setScanning(true);
    setScanProgress(8);
    setScanLogs([]);
    setCleanSuccess(null);
    setCleanError(null);

    const idleMessages = [
      "✓ Fetching file tree...",
      "✓ Resolving repository snapshot...",
      "✓ Loading candidate files...",
    ];
    let mi = 0;
    logIntervalRef.current = setInterval(() => {
      appendLog(idleMessages[mi % idleMessages.length]);
      mi++;
    }, 550);

    progressTimerRef.current = setInterval(() => {
      setScanProgress((p) => (p < 92 ? p + 2 : p));
    }, 400);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, mode: scanMode }),
      });
      const data = await res.json();
      stopScanAnimation();
      setScanProgress(100);

      if (!res.ok) {
        appendLog(`✗ Scan failed: ${data?.error ?? res.statusText}`);
        return;
      }

      const results: ScanResult[] = Array.isArray(data.results)
        ? data.results
        : [];
      appendLog(`✓ Scan complete — ${results.length} file(s) with findings`);

      for (const r of results.slice(0, 12)) {
        appendLog(`⚠ Secret pattern in ${r.file} (${r.findings.length} finding(s))`);
      }
      if (results.length > 12) {
        appendLog(`… and ${results.length - 12} more file(s)`);
      }

      setScanResults(results);
      setScanMeta({
        mode: data.meta?.mode === "deep" ? "deep" : "quick",
        scannedFiles: data.meta?.scannedFiles ?? 0,
        maxFiles: data.meta?.maxFiles,
        maxCommits: data.meta?.maxCommits,
        commitsScanned: data.meta?.commitsScanned,
        skippedLargeFilesOverBytes: data.meta?.skippedLargeFilesOverBytes,
      });

      setStep(4);
    } catch (e) {
      stopScanAnimation();
      appendLog(
        `✗ ${e instanceof Error ? e.message : "Network error during scan"}`,
      );
    } finally {
      stopScanAnimation();
      setScanning(false);
    }
  }

  async function runClean(strategy: "pr" | "main") {
    if (!selectedRepo || scanResults.length === 0) return;
    setCleaning(true);
    setCleaningStrategy(strategy);
    setCleanSuccess(null);
    setCleanError(null);
    try {
      const res = await fetch("/api/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          results: scanResults,
          strategy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Clean failed");
      }
      if (strategy === "pr" && data.prUrl) {
        setCleanSuccess({ mode: "pr", prUrl: data.prUrl });
      } else if (strategy === "main") {
        setCleanSuccess({ mode: "main", branch: data.branch ?? "default" });
      }
    } catch (e) {
      setCleanError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setCleaning(false);
      setCleaningStrategy(null);
    }
  }

  const secretsCount = scanResults.reduce((n, r) => n + r.findings.length, 0);

  function renderStepSidebar() {
    return (
      <aside
        className={`flex w-full shrink-0 flex-col border-b border-white/10 px-6 py-8 md:w-64 md:border-b-0 md:border-r ${globalBusy ? "pointer-events-none opacity-50" : ""}`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
          Vaultless
        </p>
        <h2 className="mt-2 text-sm font-semibold tracking-tight text-white/90">
          Workflow
        </h2>
        <ol className="relative mt-8 space-y-0">
          {STEP_LABELS.map((label, i) => {
            const n = (i + 1) as Step;
            const completed = step > n;
            const active = step === n;
            return (
              <li key={label} className="relative flex gap-3 pb-8 last:pb-0">
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className="absolute left-[11px] top-6 h-[calc(100%-0.5rem)] w-px bg-white/15"
                    aria-hidden
                  />
                )}
                <div
                  className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-mono ${
                    active
                      ? "border-[#00FF85] bg-[#00FF85] text-black shadow-[0_0_14px_rgba(0,255,133,0.45)]"
                      : completed
                        ? "border-white bg-white text-black"
                        : "border-white/30 bg-transparent text-white/40"
                  }`}
                >
                  {completed ? "✓" : active ? "●" : ""}
                </div>
                <div
                  className={`min-w-0 pt-0.5 ${active ? "text-white" : completed ? "text-white/50" : "text-white/35"}`}
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    Step {n}
                  </p>
                  <p
                    className={`text-sm font-medium ${active ? "text-[#00FF85]" : ""}`}
                  >
                    {label}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white md:flex-row">
      {renderStepSidebar()}

      <div className="flex min-h-[calc(100vh-1px)] flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Vaultless
            <span className="text-[#00FF85]">.</span>
          </span>
          {authed && session?.user && (
            <div className="flex items-center gap-3">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  className="size-8 rounded-full border border-white/20"
                />
              ) : null}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-mono text-xs text-white/50 underline decoration-white/30 hover:text-white"
              >
                Sign out
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 px-6 py-8 md:px-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mx-auto flex max-w-lg flex-col items-center pt-8 md:pt-16"
              >
                <div className="w-full rounded-2xl border border-white/15 bg-white/3 p-8 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Connect your GitHub account
                  </h1>
                  <p className="mt-3 text-sm text-white/55">
                    Vaultless needs access to scan your repositories.
                  </p>
                  {clientAuthed && session?.user ? (
                    <div className="mt-8 flex flex-col items-center gap-3">
                      {session.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={session.user.image}
                          alt=""
                          className="size-16 rounded-full border-2 border-[#00FF85]/50"
                        />
                      ) : null}
                      <p className="font-medium text-white">
                        {session.user.name ?? session.user.email}
                      </p>
                      <span className="rounded-full border border-[#00FF85]/40 bg-[#00FF85]/15 px-3 py-1 font-mono text-xs text-[#00FF85]">
                        Connected
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        signIn("github", { callbackUrl: "/" }, {
                          prompt: "consent",
                          scope: GITHUB_OAUTH_SCOPE,
                        })
                      }
                      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00FF85] px-8 text-sm font-semibold text-black transition hover:bg-[#00FF85]/90"
                    >
                      <GitHubIcon className="size-5" />
                      Connect with GitHub
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl"
              >
                <h1 className="text-2xl font-semibold tracking-tight">
                  Select a repository to scan
                </h1>

                <div className="mt-8 rounded-xl border border-white/15 bg-white/3 p-5">
                  <p className="text-sm font-medium text-white/90">
                    Paste a GitHub link
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Supports{" "}
                    <span className="font-mono text-white/60">
                      https://github.com/owner/repo
                    </span>
                    ,{" "}
                    <span className="font-mono text-white/60">owner/repo</span>
                    , etc. Your account must have access to the repository.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                    <input
                      type="url"
                      value={repoLinkInput}
                      onChange={(e) => {
                        setRepoLinkInput(e.target.value);
                        setRepoLinkError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          applyRepoFromLink();
                        }
                      }}
                      placeholder="https://github.com/vercel/next.js"
                      className="min-w-0 flex-1 rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-sm outline-none placeholder:text-white/30 focus:border-[#00FF85]/50"
                    />
                    <button
                      type="button"
                      disabled={globalBusy || !repoLinkInput.trim()}
                      onClick={applyRepoFromLink}
                      className="shrink-0 rounded-xl bg-[#00FF85] px-5 py-2.5 font-mono text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Use this repo
                    </button>
                  </div>
                  {repoLinkError && (
                    <p className="mt-3 text-sm text-amber-400/90">{repoLinkError}</p>
                  )}
                  {selectedRepo && selectedRepo.id < 0 && (
                    <p className="mt-3 font-mono text-xs text-[#00FF85]">
                      Ready to scan: {selectedRepo.owner}/{selectedRepo.name}
                    </p>
                  )}
                </div>

                <p className="mt-8 text-xs font-mono uppercase tracking-[0.15em] text-white/40">
                  Or choose from your repositories
                </p>
                <input
                  type="search"
                  value={repoQuery}
                  onChange={(e) => setRepoQuery(e.target.value)}
                  placeholder="Filter repositories…"
                  className="mt-3 w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-sm outline-none placeholder:text-white/35 focus:border-[#00FF85]/50"
                />
                <div className="mt-6 max-h-[50vh] overflow-y-auto rounded-xl border border-white/10 p-2 md:max-h-[min(60vh,520px)]">
                  <ul className="grid gap-3 md:grid-cols-2">
                    {filteredRepos.map((r) => {
                      const sel =
                        selectedRepo?.id === r.id;
                      return (
                        <li key={r.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRepo(r);
                              setRepoLinkError(null);
                            }}
                            disabled={globalBusy}
                            className={`flex w-full flex-col rounded-xl border p-4 text-left transition ${
                              sel
                                ? "border-[#00FF85] bg-[#00FF85]/10 shadow-[0_0_0_1px_rgba(0,255,133,0.25)]"
                                : "border-white/15 bg-white/3 hover:border-white/25"
                            } disabled:cursor-not-allowed disabled:opacity-40`}
                          >
                            <span className="font-mono text-sm font-semibold text-white">
                              {r.name}
                            </span>
                            <span className="mt-1 line-clamp-2 text-xs text-white/50">
                              {r.description ?? "No description"}
                            </span>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/65">
                                {r.private ? "Private" : "Public"}
                              </span>
                              <span className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/65">
                                {r.language ?? "—"}
                              </span>
                            </div>
                            <span className="mt-2 font-mono text-[10px] text-white/40">
                              Updated{" "}
                              {r.updated_at
                                ? new Date(r.updated_at).toLocaleDateString()
                                : "—"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {filteredRepos.length === 0 && (
                    <p className="py-12 text-center text-sm text-white/45">
                      No repositories match your filter.
                    </p>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    disabled={!selectedRepo || globalBusy}
                    onClick={() => setStep(3)}
                    className="inline-flex h-11 items-center rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Scan selected repo
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && selectedRepo && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-3xl"
              >
                <p className="font-mono text-xs text-white/45">Selected</p>
                <h1 className="mt-1 font-mono text-xl font-semibold text-white">
                  {selectedRepo.owner}/{selectedRepo.name}
                </h1>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setScanMode("quick")}
                    disabled={scanning}
                    className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
                      scanMode === "quick"
                        ? "border-[#00FF85] bg-[#00FF85]/15 text-[#00FF85]"
                        : "border-white/25 text-white/70 hover:border-white/40"
                    } disabled:opacity-40`}
                  >
                    Quick Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setScanMode("deep")}
                    disabled={scanning}
                    className={`rounded-full border px-4 py-2 font-mono text-xs transition ${
                      scanMode === "deep"
                        ? "border-[#00FF85] bg-[#00FF85]/15 text-[#00FF85]"
                        : "border-white/25 text-white/70 hover:border-white/40"
                    } disabled:opacity-40`}
                  >
                    Deep Scan
                  </button>
                </div>
                <p className="mt-3 text-sm text-white/55">
                  Quick: current snapshot only. Deep: recent commit history —{" "}
                  <span className="text-amber-400/90">
                    may take a few minutes
                  </span>
                  .
                </p>

                {scanning && (
                  <div className="mt-8 overflow-hidden rounded-full border border-white/15 bg-white/5">
                    <div
                      className="h-2 rounded-full bg-[length:200%_100%] transition-[width] duration-300"
                      style={{
                        width: `${scanProgress}%`,
                        backgroundImage:
                          "linear-gradient(90deg, #00FF85 0%, #00FF85 40%, rgba(0,255,133,0.4) 50%, #00FF85 60%, #00FF85 100%)",
                        animation: "vaultless-shimmer 1.2s linear infinite",
                      }}
                    />
                  </div>
                )}

                <pre
                  ref={logRef}
                  className="mt-6 max-h-56 overflow-y-auto rounded-xl border border-white/15 bg-black/50 p-4 font-mono text-xs leading-relaxed text-white/75"
                >
                  {scanLogs.length === 0 && !scanning
                    ? "Output will appear here when you start the scan."
                    : scanLogs.join("\n")}
                </pre>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={scanning}
                    onClick={runScan}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {scanning ? (
                      <>
                        <Spinner className="size-4 text-black" />
                        Scanning…
                      </>
                    ) : (
                      "Start Scan"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={scanning}
                    onClick={() => setStep(2)}
                    className="rounded-full border border-white/25 px-5 py-2 font-mono text-xs text-white/70 hover:border-white/45 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && selectedRepo && (
              <motion.div
                key="s4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mx-auto max-w-4xl"
              >
                <p className="font-mono text-xs text-white/45">Repository</p>
                <h1 className="mt-1 font-mono text-lg font-semibold">
                  {selectedRepo.owner}/{selectedRepo.name}
                </h1>
                {scanMeta && (
                  <p className="mt-2 text-sm text-white/55">
                    {secretsCount} secret{secretsCount === 1 ? "" : "s"} found
                    across {scanResults.length} file
                    {scanResults.length === 1 ? "" : "s"} · {scanMeta.scannedFiles}{" "}
                    files scanned · {scanMeta.mode === "deep" ? "Deep" : "Quick"}
                  </p>
                )}

                {cleanSuccess && (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-6 rounded-xl border border-[#00FF85]/35 bg-[#00FF85]/10 px-4 py-3 text-sm text-[#00FF85]"
                  >
                    {cleanSuccess.mode === "pr" ? (
                      <>
                        PR opened successfully.{" "}
                        <a
                          href={cleanSuccess.prUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono underline"
                        >
                          View pull request
                        </a>
                      </>
                    ) : (
                      <>Files fixed on branch {cleanSuccess.branch}.</>
                    )}
                  </motion.div>
                )}

                {cleanError && (
                  <p className="mt-4 text-sm text-red-400/90">{cleanError}</p>
                )}

                {scanResults.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
                    ⚠️ Rotate your secrets immediately — the old commit still
                    exists in Git history.
                  </div>
                )}

                {scanResults.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.92 }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 flex flex-col items-center py-12 text-center"
                  >
                    <div className="mb-4 flex size-20 items-center justify-center rounded-full border-2 border-[#00FF85] text-4xl text-[#00FF85]">
                      ✓
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      No secrets found
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-white/50">
                      Your repo looks clean under the current rules.
                    </p>
                  </motion.div>
                ) : (
                  <ul className="mt-8 space-y-4">
                    {scanResults.map((fileResult) => (
                      <li
                        key={`${fileResult.file}-${fileResult.commitSha ?? "h"}`}
                        className="rounded-xl border border-white/15 bg-white/3 p-5"
                      >
                        <p className="break-all font-mono text-sm text-white">
                          {fileResult.file}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {fileResult.findings.map((f, idx) => (
                            <li
                              key={`${f.line}-${idx}`}
                              className="flex flex-col gap-2 sm:flex-row sm:items-start"
                            >
                              <div className="flex shrink-0 gap-2">
                                <span className="rounded border border-[#00FF85]/40 bg-[#00FF85]/10 px-2 py-0.5 font-mono text-[11px] text-[#00FF85]">
                                  L{f.line}
                                </span>
                                <span
                                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${typeBadgeClass(f.type)}`}
                                >
                                  {f.type}
                                </span>
                              </div>
                              <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white/80">
                                {redactPreview(f.preview)}
                              </pre>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
                  <button
                    type="button"
                    disabled={cleaning || scanResults.length === 0}
                    onClick={() => runClean("pr")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {cleaning && cleaningStrategy === "pr" ? (
                      <Spinner className="size-4 text-black" />
                    ) : null}
                    Open a PR
                  </button>
                  <button
                    type="button"
                    disabled={cleaning || scanResults.length === 0}
                    onClick={() => runClean("main")}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#00FF85]/50 px-6 text-sm font-semibold text-[#00FF85] transition enabled:hover:bg-[#00FF85]/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {cleaning && cleaningStrategy === "main" ? (
                      <Spinner className="size-4 text-[#00FF85]" />
                    ) : null}
                    Fix directly on main
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
