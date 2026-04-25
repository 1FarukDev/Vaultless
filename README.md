# Vaultless

Vaultless is a developer-focused web app that helps teams **find and remove exposed secrets** in GitHub repositories. The product direction is: connect GitHub → scan repos (`.env`, source, configs) → review findings → optionally auto-commit cleaned files — with a **stateless, privacy-minded** posture.

This repository is a **Next.js (App Router)** frontend and GitHub integration shell: landing page, GitHub OAuth via NextAuth, and a **server-rendered list of repositories** (with client-side search and pagination) when the user is signed in.

## Features (current)

- **Landing page** — minimal black-and-white UI, Framer Motion scroll reveals (`app/components/home-content.tsx`).
- **GitHub sign-in** — NextAuth + GitHub provider (`app/api/auth/[...nextauth]/route.ts`).
- **Repository list (authenticated)** — server-side fetch with Octokit using the session access token; search + pagination in the browser (`app/components/repository-list-section.tsx`, `app/components/repository-list-client.tsx`).
- **Session + access token** — OAuth access token attached to the session for API calls (see `types/next-auth.d.ts`).

Scanning, reporting, and auto-commit flows are **not** implemented here yet; the **Scan** buttons are placeholders.

## Tech stack

| Area        | Choice |
|------------|--------|
| Framework  | Next.js **16** (App Router) |
| UI         | React **19**, Tailwind CSS **4** |
| Motion     | Framer Motion |
| Auth       | NextAuth.js **v4** (`next-auth`) |
| GitHub API | `@octokit/rest` |
| Language   | TypeScript |

## Prerequisites

- **Node.js** (LTS recommended, e.g. 20+)
- **npm** (or compatible package manager)
- A **GitHub OAuth App** (see below) — **not** a GitHub App’s client ID/secret for classic OAuth scope behavior

## GitHub OAuth setup (important)

Vaultless expects credentials from a classic **OAuth App**:

1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Application name**: e.g. `Vaultless (local)`.
3. **Homepage URL**: `http://localhost:3000` (or your deployed URL).
4. **Authorization callback URL**:  
   `http://localhost:3000/api/auth/callback/github`  
   (in production, use your real origin, e.g. `https://yourdomain.com/api/auth/callback/github`).
5. Create the app, then copy **Client ID** and generate a **Client secret**.

### Why OAuth App (not GitHub App) for this codebase

If you use **GitHub App** user tokens (`ghu_…`), GitHub often reports **empty `x-oauth-scopes`**, and **private repository listing** may not work the same way as with a classic OAuth App token that includes the `repo` scope. This project’s comments and `lib/github-oauth-scope.ts` assume a **classic OAuth App**.

### Scopes

Requested scopes are defined in `lib/github-oauth-scope.ts`:

`read:user user:email repo read:org`

- **`repo`** — needed for private repos you can access (and for future commit/scan features).
- **`read:org`** — helps with org-related visibility where applicable.

**Organization private repos** may still require org admins to **approve the OAuth app** and, if the org uses **SAML SSO**, users may need to **authorize the app for SSO**.

After changing scopes or switching OAuth apps, users should **sign out and sign in again** so GitHub issues a new token.

## Environment variables

Create a `.env.local` in the project root (do not commit secrets). Typical variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_CLIENT_ID` | Yes | OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Yes | OAuth App Client secret |
| `NEXTAUTH_URL` | Production / some setups | Public origin of the app, e.g. `http://localhost:3000` or `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | Production | Random secret for signing cookies/JWT (e.g. `openssl rand -base64 32`) |

NextAuth v4: set `NEXTAUTH_SECRET` in any shared or deployed environment.

**Never** commit `.env` or `.env.local`. **Never** expose access tokens in API responses or client-side logs.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run lint      # ESLint
npm run build     # Production build
npm run start     # Production server (after build)
npx tsc --noEmit  # Typecheck
```

## Project structure

```
app/
  api/
    auth/[...nextauth]/route.ts   # NextAuth handler + exported authOptions
    debug/route.ts                # Debug helper (does not return raw tokens)
  components/
    home-content.tsx              # Client: landing UI, sign-in/out
    repository-list-section.tsx   # Server: session + Octokit fetch
    repository-list-client.tsx    # Client: search + pagination
  layout.tsx                      # Root layout, fonts, Providers wrapper
  page.tsx                        # Server: composes Home + repo section
  providers.tsx                   # Client: SessionProvider
lib/
  github-oauth-scope.ts           # OAuth scope string (single source of truth)
types/
  next-auth.d.ts                  # Session/JWT typings (accessToken)
```

## How auth and repo listing work

1. User clicks **Connect with GitHub** → `signIn("github", …)` with `prompt: consent` and explicit `scope` (`app/components/home-content.tsx`).
2. NextAuth completes OAuth and stores the GitHub **access token** in the JWT, then exposes `session.accessToken` (`app/api/auth/[...nextauth]/route.ts`).
3. `RepositoryListSection` runs on the server: `getServerSession(authOptions)` → `Octokit({ auth: session.accessToken })` → `repos.listForAuthenticatedUser` with `visibility: "all"`, `affiliation: "owner,collaborator,organization_member"`, sorted by `updated`.
4. Results are passed to `RepositoryListClient` for filtering and paging.

If the user is not signed in, the repo section returns `null` (nothing below the hero).

## Debugging

`GET /api/debug` returns GitHub API metadata and scope **headers** only — it does **not** return the raw token. Prefer using it in development only; remove or protect it in production.

## Contributing

1. Fork the repo and branch (`feat/…`, `fix/…`).
2. Run **`npm run lint`** and **`npx tsc --noEmit`** before opening a PR.
3. Keep changes focused; one concern per PR when possible.
4. **Security** — never log tokens, leak secrets in APIs, or commit env files. Redact tokens in issues and screenshots.
5. **OAuth / GitHub** — when changing scopes or API usage, update `lib/github-oauth-scope.ts` and this README.

### Ideas for contributions

- Wire **Scan** to a real scan job or API route.
- Server-driven pagination over GitHub’s API (`page` / Link headers) beyond the first page of results.
- Tests (auth mocks, Octokit mocks).
- Harden or remove `/api/debug` for production.

## License

Specify a license in a `LICENSE` file when the project owners choose one.

## Links

- [Next.js documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [GitHub REST API – Repositories](https://docs.github.com/en/rest/repos/repos)
- [Octokit REST](https://github.com/octokit/rest.js)
