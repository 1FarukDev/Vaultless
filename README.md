# Vaultless

Vaultless is a developer-focused web app that helps teams **find and reduce exposed secrets** in GitHub repositories: connect with GitHub, **scan** the repo (quick snapshot or recent commit history), review findings in a **results dashboard**, and optionally open a **pull request** that applies heuristic cleanups.

The app is **stateless** from a product perspective (no Vaultless-owned database): work is done with the user’s GitHub OAuth token and GitHub’s APIs.

## Features

| Area | What it does |
|------|----------------|
| **Landing** | Minimal black-and-white marketing page with Framer Motion reveals (`app/components/home-content.tsx`). |
| **GitHub OAuth** | NextAuth GitHub provider; access token stored on the session for API calls (`app/api/auth/[...nextauth]/route.ts`, `types/next-auth.d.ts`). |
| **Wizard UI** | Step-by-step flow: connect → pick repo or **paste a GitHub URL** (`lib/parse-github-repo-url.ts`) → scan → clean (`app/components/vaultless-wizard.tsx`). |
| **Repository list** | Optional list from `GET /api/repos` / server fetch; filterable grid in the wizard (`repository-list-section.tsx` still available for older layouts). |
| **Scan** | `POST /api/scan` — **quick** mode: `HEAD` tree + filtered files; **deep** mode: recent commits and changed files. Pattern-based detection in `lib/helpers/scan.ts` with path filtering in `lib/helpers/skip.ts`. |
| **Results UI** | Dashboard with summary stats, per-file findings, redacted previews (`lib/redact-preview.ts`), and actions (`app/components/scan-results-dashboard.tsx`). |
| **Clean / PR** | `POST /api/clean` — creates branch from **`main`**, rewrites flagged lines via `lib/helpers/clean.ts`, commits, opens a PR. Can run for all findings or a single file from the dashboard. |

**Not implemented / placeholder:** “Download cleaned files” in the UI; default branch is hard-coded to `main` in the clean route (repos using only `master` need a code or config change).

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js **16** (App Router) |
| UI | React **19**, Tailwind CSS **4** |
| Motion | Framer Motion |
| Auth | NextAuth.js **v4** |
| GitHub | `@octokit/rest` |
| Language | TypeScript |

## Prerequisites

- **Node.js** (LTS, e.g. 20+)
- **npm**
- A classic **GitHub OAuth App** (not a GitHub App client ID/secret if you need normal `repo` OAuth scopes and private repo listing — see below)

## GitHub OAuth setup

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL**: `http://localhost:3000` (or production URL).
3. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (adjust origin for production).
4. Copy **Client ID** and create a **Client secret**.

**OAuth App vs GitHub App:** GitHub App user tokens (`ghu_…`) often show empty `x-oauth-scopes` and behave differently. This project expects a **classic OAuth App**; scopes live in `lib/github-oauth-scope.ts`:

`read:user user:email repo read:org`

After changing scopes, users should **disconnect and sign in again**.

Org private repos may require org approval and **SAML SSO** authorization for the OAuth app.

## Environment variables

Create `.env.local` (never commit it):

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_CLIENT_ID` | Yes | OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Yes | OAuth App Client secret |
| `NEXTAUTH_URL` | Often | App origin, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Production | `openssl rand -base64 32` |

Do not return raw tokens from APIs or paste them in issues.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint       # ESLint
npm run build      # Production build
npm run start      # Production server
npx tsc --noEmit   # Typecheck
```

## API overview

### `POST /api/scan`

Body: `{ "owner": string, "repo": string, "mode": "quick" | "deep" }`

Returns:

```json
{
  "results": [
    {
      "file": "path/to/file.ts",
      "findings": [{ "line": 11, "type": "token", "preview": "..." }],
      "commitSha": "optional-in-deep-mode",
      "commitDate": "optional"
    }
  ],
  "meta": {
    "mode": "quick",
    "scannedFiles": 30,
    "maxFiles": 250,
    "skippedLargeFilesOverBytes": 200000
  }
}
```

**Quick mode:** tree at `HEAD`, extension/size filters, cap on files scanned, concurrent blob reads.

**Deep mode:** walks recent commits (see limits in `app/api/scan/route.ts`), dedupes by blob, fetches content at commit refs. Does **not** exhaust full git history — it is bounded for performance and rate limits.

### `POST /api/clean`

Body: `{ "owner": string, "repo": string, "results": ScanResult[] }`

Requires `repo` scope (and write access). Creates `vaultless/clean-secrets-<timestamp>` from **`heads/main`**, updates files, opens a PR. Response: `{ "prUrl": "..." }` on success.

### `GET /api/debug` (dev only)

Returns GitHub response metadata / scope headers — **not** the raw token. Remove or protect in production.

## Project structure

```
app/
  api/
    auth/[...nextauth]/route.ts   # NextAuth + exported authOptions
    scan/route.ts                 # Quick / deep scan
    clean/route.ts                # Branch, patch files, open PR
    debug/route.ts                # Safe debug metadata
  components/
    home-content.tsx              # Landing + sign in/out
    repository-list-section.tsx   # Server: repos via Octokit
    repository-list-client.tsx    # Search, pagination, scan + dashboard wiring
    scan-results-dashboard.tsx    # Findings UI + clean actions
  layout.tsx
  page.tsx
  providers.tsx                   # SessionProvider
lib/
  types/scan.ts                   # Finding, ScanResult, ScanMeta, ScanResponse
  github-oauth-scope.ts
  redact-preview.ts
  helpers/
    scan.ts                       # Pattern matching
    skip.ts                       # Path allow/skip lists
    clean.ts                      # Rewrite lines → process.env.*
types/
  next-auth.d.ts                  # Session.accessToken, JWT
```

## How the main flows fit together

1. User signs in with GitHub; `session.accessToken` is available server-side.
2. Repos load in `RepositoryListSection`; user picks **Quick** or **Deep** and clicks **Scan**.
3. Client calls `/api/scan` and stores `ScanResponse` (`owner`, `repo`, `results`, `meta`).
4. `ScanResultsDashboard` shows summaries and redacted previews; **Commit fixes to GitHub** or **Clean this file** calls `/api/clean` with the relevant `results` slice.

## Contributing

1. Fork, branch (`feat/…`, `fix/…`).
2. Run **`npm run lint`** and **`npx tsc --noEmit`** before a PR.
3. Keep changes focused; avoid leaking secrets in logs or responses.
4. When changing OAuth scopes or scan/clean behavior, update **`lib/github-oauth-scope.ts`** and this README.

### Ideas

- Configurable default branch (or auto-detect repo default) for `/api/clean`.
- Server-driven repo pagination beyond the first page of `listForAuthenticatedUser`.
- Stronger clean heuristics / pluggable rules; tests with mocked Octokit.
- Remove or gate `/api/debug` in production.

## License

Add a `LICENSE` file when you choose one.

## Links

- [Next.js](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Octokit REST](https://github.com/octokit/rest.js)
