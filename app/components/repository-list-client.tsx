"use client";

import { useMemo, useState } from "react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  updated_at: string | null;
};

type RepositoryListClientProps = {
  repos: Repo[];
};

const PAGE_SIZE = 10;

function formatDate(dateValue: string | null) {
  if (!dateValue) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateValue));
}

function trimDescription(description: string | null) {
  if (!description) return "No description";
  if (description.length <= 120) return description;
  return `${description.slice(0, 117)}...`;
}

export default function RepositoryListClient({ repos }: RepositoryListClientProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

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

            <p className="mb-5 min-h-11 text-sm leading-relaxed text-white/60">
              {trimDescription(repo.description)}
            </p>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-white/50">
                Updated {formatDate(repo.updated_at)}
              </p>
              <button
                type="button"
                className="rounded-full border border-white/50 px-4 py-1.5 text-sm text-white transition hover:border-white"
              >
                Scan
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
