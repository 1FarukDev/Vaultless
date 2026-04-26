# Vaultless

Vaultless is a developer-focused tool that helps teams **find and remove exposed secrets** in GitHub repositories. It ships as both a **web app** and a **CLI** — connect with GitHub, scan repos or local project folders, review findings, and optionally open a pull request with automatic cleanups.

The app is **stateless** — no Vaultless-owned database. All work is done with your GitHub OAuth token and GitHub's APIs.

[![npm version](https://img.shields.io/npm/v/vaultless)](https://www.npmjs.com/package/vaultless)
[![license](https://img.shields.io/npm/l/vaultless)](https://github.com/1FarukDev/Vaultless/blob/main/LICENSE)

---

## What it detects

| Type | Example |
|------|---------|
| Env variables | `API_KEY=abc123` in `.env` files |
| Hardcoded API keys | `const apiKey = "sk-abc123..."` |
| Hardcoded passwords | `const password = "mysecret"` |
| Hardcoded tokens | `const token = "ghp_abc123..."` |
| AWS access keys | `AKIA...` |
| Google API keys | `AIza...` |
| OpenAI API keys | `sk-...` |
| GitHub tokens | `ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_` |
| MongoDB URIs | `mongodb://user:pass@host` |
| Postgres URIs | `postgres://user:pass@host` |
| MySQL URIs | `mysql://user:pass@host` |

False positives are filtered — lines referencing `process.env`, URL params, type checks, and placeholder values are automatically skipped.

---

## Monorepo structure

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Motion | Framer Motion |
| Auth | NextAuth.js v4 |
| GitHub API | `@octokit/rest` |
| CLI | Commander, Chalk, Ora, Glob |
| Language | TypeScript |
| Monorepo | npm workspaces |

---

## Prerequisites

- **Node.js** LTS (20+)
- **npm**
- A classic **GitHub OAuth App** (not a GitHub App — see setup below)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/1FarukDev/Vaultless.git
cd vaultless
```

### 2. Install dependencies

Run this from the root — npm workspaces installs everything for all packages at once:

```bash
npm install
```

### 3. Create a GitHub OAuth App

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: Vaultless
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** and copy it

> **Important:** Always use a classic **OAuth App**, not a GitHub App. GitHub App tokens ignore the `scope` parameter and will not return private repos.

### 4. Set up environment variables

Create `apps/web/.env.local`:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any_random_string_here
```

Generate a secure `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

> Never commit `.env.local` — it is already in `.gitignore`.

### 5. Run the web app

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Using the web app

### Step 1 — Connect
Click **Connect with GitHub** and authorize Vaultless. You will be asked to approve access to your repositories including private ones.

### Step 2 — Select a repo
Browse or search your public and private repos. Click a repo card to select it. You can also paste a GitHub URL directly.

### Step 3 — Scan
Choose a scan mode:
- **Quick scan** — scans the current file tree at `HEAD`. Fast, results in seconds.
- **Deep scan** — walks recent commit history and surfaces secrets introduced in past commits, even if they were later deleted. Takes longer on large repos.

Click **Start Scan** and watch the live progress log.

### Step 4 — Clean & Fix
Review the findings dashboard. Each flagged file shows the line number, secret type, and a redacted preview.

Two actions are available:
- **Open a PR** — creates a new branch, replaces hardcoded secrets with `process.env.VARIABLE_NAME`, and opens a pull request for review
- **Fix directly on main** — commits the fix straight to your default branch with no PR needed

> ⚠️ Cleaning a file does **not** erase the secret from Git history. Always **revoke and rotate** any exposed secret at the provider level immediately — AWS console, OpenAI dashboard, GitHub settings, etc.

---

## Using the CLI

The CLI lets you scan and clean any local project folder directly from your terminal — no browser needed.

### Install globally from npm

```bash
npm install -g vaultless
```

### Run in any project folder

```bash
# scan current directory for secrets
vaultless scan

# scan including local git commit history
vaultless scan --deep

# clean secrets from files (rewrites files in place)
vaultless clean

# clean and open a GitHub PR with fixes
vaultless clean --pr

# clean and commit fixes directly to main
vaultless clean --direct
```

### Example output

```bash
$ vaultless scan

  Vaultless — Secret Scanner

  Scanned 30 files

  ⚠ 1 secret found in 1 file

  src/app/page.tsx
    L11  [token]  const GITHUB_TOKEN = "ghp_█████████████..."

  Run `vaultless clean` to fix these issues
```

```bash
$ vaultless clean

  Vaultless — Secret Cleaner

  ✓ 1 file cleaned

  src/app/page.tsx
    L11 — token replaced with process.env

  ⚠ Rotate your secrets immediately — they may still exist in git history
```

### CLI flags

| Command | Flag | Description |
|---------|------|-------------|
| `scan` | `--deep` | Also scan local git commit history |
| `clean` | `--pr` | Push a branch and open a GitHub PR with fixes |
| `clean` | `--direct` | Commit fixes directly to the default branch |

### Build and link locally (for contributors)

```bash
# build the shared scanner package first
cd packages/scanner
npm run build

# then build and link the CLI
cd ../cli
npm run build
npm link
```

---

## API reference

### `POST /api/scan`

Body:
```json
{ "owner": "string", "repo": "string", "mode": "quick" | "deep" }
```

Response:
```json
{
  "results": [
    {
      "file": "src/app/page.tsx",
      "findings": [{ "line": 11, "type": "token", "preview": "..." }],
      "commitSha": "optional — deep mode only",
      "commitDate": "optional — deep mode only"
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

### `POST /api/clean`

Body:
```json
{ "owner": "string", "repo": "string", "results": [] }
```

Requires `repo` scope and write access to the repository. Creates a branch `vaultless/clean-secrets-<timestamp>` from the default branch, rewrites flagged lines to `process.env.VARIABLE_NAME`, and opens a PR.

Response:
```json
{ "prUrl": "https://github.com/owner/repo/pull/123" }
```

### `GET /api/debug` *(development only)*

Returns GitHub OAuth scope headers to help debug token issues. Remove or protect behind authentication before deploying to production.

---

## Development commands

From `apps/web`:
```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # production server
npm run lint         # ESLint
npx tsc --noEmit     # typecheck only
```

From `packages/scanner` or `packages/cli`:
```bash
npm run build        # compile TypeScript
```

---

## Contributing

1. Fork the repo and create a branch (`feat/…` or `fix/…`)
2. Run `npm run lint` and `npx tsc --noEmit` before opening a PR
3. Keep changes focused — avoid leaking secrets in logs or API responses
4. When updating scan or clean rules, edit `packages/scanner/src/scan.ts` — changes apply to both the web app and CLI automatically

### Ideas for future improvements

- Auto-detect default branch instead of hardcoding `main` in `/api/clean`
- Configurable commit depth for deep scan
- Git history rewriting via `git filter-repo` in a background worker
- Pluggable detection rules via a `.vaultless.config.js` file
- Server-driven repo pagination beyond the first page
- Tests with mocked Octokit and filesystem fixtures
- Gate or remove `/api/debug` in production builds

---

## Security note

Vaultless replaces hardcoded secrets with `process.env` references in a new commit. This fixes the live code but does **not** rewrite Git history — the original commit still exists. If a secret was ever pushed to a remote repository, assume it has been seen. Revoke and rotate it immediately.

---

## License

Add a `LICENSE` file when you choose one.

---

## Links

- [npm package](https://www.npmjs.com/package/vaultless)
- [GitHub repo](https://github.com/1FarukDev/Vaultless)
- [Report an issue](https://github.com/1FarukDev/Vaultless/issues)
- [Next.js](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Octokit REST](https://github.com/octokit/rest.js)
- [Commander.js](https://github.com/tj/commander.js)
