"use client";

import { useMemo, useState } from "react";
import ScanResultsDashboard from "./scan-results-dashboard";
import type { ScanResponse } from "@/lib/types/scan";

type Repo = {
  id: number;
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  updated_at: string | null;
};

type RepositoryListClientProps = {
  repos: Repo[];
};

type ScanMode = "quick" | "deep";

const PAGE_SIZE = 10;

function formatDate(dateValue: string | null) {
  if (!dateValue) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default function RepositoryListClient({ repos }: RepositoryListClientProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [scanningRepoId, setScanningRepoId] = useState<number | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("quick");
  const [scanReport, setScanReport] = useState<ScanResponse | null>(null);

  const filteredRepos = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return repos;
    return repos.filter((repo) => {
      const haystack = `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [query, repos]);

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRepos = filteredRepos.slice(startIndex, startIndex + PAGE_SIZE);

  async function handleScan(owner: string, repo: string) {
    const activeRepoId = repos.find(
      (repository) => repository.owner === owner && repository.name === repo,
    )?.id;

    if (activeRepoId) {
      setScanningRepoId(activeRepoId);
    }
    setScanMessage(
      scanMode === "deep"
        ? `Deep scanning ${owner}/${repo} commit history...`
        : `Quick scanning ${owner}/${repo}...`,
    );

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, mode: scanMode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Scan failed");
      }

      setScanReport({
        owner,
        repo,
        results: Array.isArray(data.results) ? data.results : [],
        meta: {
          mode: data.meta?.mode === "deep" ? "deep" : "quick",
          scannedFiles: data.meta?.scannedFiles ?? 0,
          maxFiles: data.meta?.maxFiles,
          maxCommits: data.meta?.maxCommits,
          maxFilesPerCommit: data.meta?.maxFilesPerCommit,
          maxHistoryFiles: data.meta?.maxHistoryFiles,
          commitsScanned: data.meta?.commitsScanned,
          skippedLargeFilesOverBytes: data.meta?.skippedLargeFilesOverBytes,
        },
      });

      const findingsCount = Array.isArray(data?.results) ? data.results.length : 0;
      const scannedFiles = data?.meta?.scannedFiles;
      const commitsScanned = data?.meta?.commitsScanned;
      if (scanMode === "deep") {
        setScanMessage(
          `Deep scan complete for ${owner}/${repo}: ${findingsCount} files flagged across ${scannedFiles ?? 0} scanned files and ${commitsScanned ?? 0} commits.`,
        );
      } else {
        setScanMessage(
          `Quick scan complete for ${owner}/${repo}: ${findingsCount} files flagged across ${scannedFiles ?? 0} scanned files.`,
        );
      }
      console.log(data.results);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to scan repository";
      setScanMessage(message);
    } finally {
      setScanningRepoId(null);
    }
  }
  

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Repository list
        </h2>
        <p className="text-sm text-white/60">
          Showing your GitHub repositories (including private repos), sorted by
          most recently updated.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block w-full sm:max-w-sm">
          <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/55">
            Search repositories
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, description, or language"
            className="w-full rounded-xl border border-white/25 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
          />
        </label>
        <p className="text-sm text-white/60">
          {filteredRepos.length} result{filteredRepos.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs uppercase tracking-[0.15em] text-white/55">
          Scan mode
        </span>
        <button
          type="button"
          onClick={() => setScanMode("quick")}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            scanMode === "quick"
              ? "border-white bg-white text-black"
              : "border-white/35 text-white/70 hover:border-white"
          }`}
        >
          Quick (HEAD)
        </button>
        <button
          type="button"
          onClick={() => setScanMode("deep")}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            scanMode === "deep"
              ? "border-white bg-white text-black"
              : "border-white/35 text-white/70 hover:border-white"
          }`}
        >
          Deep (history)
        </button>
        <p className="text-xs text-white/50">
          Deep mode scans recent commits and takes longer.
        </p>
      </div>

      {scanMessage && (
        <p className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70">
          {scanMessage}
        </p>
      )}

      {scanReport && (
        <ScanResultsDashboard
          owner={scanReport.owner}
          repo={scanReport.repo}
          results={scanReport.results}
          meta={scanReport.meta}
        />
      )}

      <ul className="grid gap-4 md:grid-cols-2" aria-label="GitHub repository list">
        {paginatedRepos.map((repo) => (
          <li
            key={repo.id}
            className="rounded-2xl border border-white/20 bg-white/1.5 p-5"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h3 className="mr-auto font-mono text-lg font-semibold text-white">
                {repo.name}
              </h3>
              <span className="rounded-full border border-white/25 px-2.5 py-1 text-xs text-white/70">
                {repo.language ?? "Unknown"}
              </span>
              <span className="rounded-full border border-white/25 px-2.5 py-1 text-xs text-white/70">
                {repo.private ? "Private" : "Public"}
              </span>
            </div>

            {/* <p className="mb-5 min-h-11 text-sm leading-relaxed text-white/60">
              {trimDescription(repo.description)}
            </p> */}

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-white/50">
                Updated {formatDate(repo.updated_at)}
              </p>
              <button
                type="button"
                className="rounded-full border border-white/50 px-4 py-1.5 text-sm text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={scanningRepoId === repo.id}
                onClick={() => handleScan(repo.owner, repo.name)}
              >
                {scanningRepoId === repo.id ? "Scanning..." : "Scan"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredRepos.length === 0 && (
        <p className="rounded-xl border border-white/20 p-4 text-sm text-white/60">
          No repositories match your search.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-4">
        <p className="text-xs text-white/50">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-white/40 px-3 py-1.5 text-xs text-white transition enabled:hover:border-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-white/40 px-3 py-1.5 text-xs text-white transition enabled:hover:border-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
