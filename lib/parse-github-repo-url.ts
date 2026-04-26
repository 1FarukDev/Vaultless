/**
 * Parse owner/repo from common GitHub URL shapes or `owner/repo` shorthand.
 */
export function parseGithubRepoUrl(raw: string): {
  owner: string;
  repo: string;
} | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const noQuery = trimmed.split(/[?#]/)[0]?.replace(/\/+$/, "") ?? "";

  const stripGit = (name: string) => name.replace(/\.git$/i, "");

  const looksLikePlainRef =
    !noQuery.includes("://") &&
    !noQuery.toLowerCase().includes("github.com");

  if (looksLikePlainRef) {
    const parts = noQuery.split("/").filter(Boolean);
    if (parts.length === 2) {
      return { owner: parts[0], repo: stripGit(parts[1]) };
    }
  }

  try {
    const href = noQuery.includes("://") ? noQuery : `https://${noQuery}`;
    const u = new URL(href);
    if (u.hostname !== "github.com" && u.hostname !== "www.github.com") {
      return null;
    }
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const skip = new Set([
      "settings",
      "orgs",
      "login",
      "explore",
      "marketplace",
      "sponsors",
    ]);
    if (skip.has(parts[0])) return null;
    const owner = parts[0];
    const repo = stripGit(parts[1]);
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

/** Stable negative id so URL-based selection does not collide with GitHub repo ids. */
export function syntheticRepoListId(owner: string, repo: string): number {
  const s = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
  }
  return h <= 0 ? h - 1 : -h - 1;
}

export function repoListItemFromGithubRef(
  owner: string,
  repo: string,
): import("@/lib/types/repo").RepoListItem {
  return {
    id: syntheticRepoListId(owner, repo),
    owner,
    name: repo,
    description: null,
    language: null,
    private: false,
    updated_at: null,
  };
}
