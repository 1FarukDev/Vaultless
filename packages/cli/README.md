```markdown
# Vaultless

> Scan and remove exposed secrets from your project — right from your terminal.

[![npm version](https://img.shields.io/npm/v/vaultless)](https://www.npmjs.com/package/vaultless)
[![license](https://img.shields.io/npm/l/vaultless)](https://github.com/1FarukDev/Vaultless/blob/main/LICENSE)

---

## Install

```bash
npm install -g vaultless
```

---

## Usage

Run inside any project folder:

```bash
# scan current directory for exposed secrets
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

---

## Example

```bash
$ vaultless scan

  Vaultless — Secret Scanner

  Scanned 30 files

  ⚠ 1 secret found in 1 file

  src/app/page.tsx
    L11  [token]  const GITHUB_TOKEN = "ghp_█████████████..."

  Run `vaultless clean` to fix these issues
```

After running `vaultless clean`:

```bash
$ vaultless clean

  Vaultless — Secret Cleaner

  ✓ 1 file cleaned

  src/app/page.tsx
    L11 — token replaced with process.env

  ⚠ Rotate your secrets immediately — they may still exist in git history
```

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

## How it works

1. Vaultless scans all files in your current directory recursively
2. Binary files, lockfiles, and common non-secret files are skipped automatically
3. Each file is checked against a set of secret detection patterns
4. Flagged lines are shown with the line number, secret type, and a redacted preview
5. Running `vaultless clean` rewrites flagged lines to use `process.env.VARIABLE_NAME` instead

---

## Flags

| Command | Flag | Description |
|---------|------|-------------|
| `scan` | `--deep` | Also scan local git commit history |
| `clean` | `--pr` | Push a branch and open a GitHub PR with fixes |
| `clean` | `--direct` | Commit fixes directly to the default branch |

---

## Security note

> ⚠️ Cleaning a file replaces the hardcoded value in your working files but does **not** rewrite Git history. The original commit still exists. Always **revoke and rotate** any exposed secret immediately at the provider level — AWS console, OpenAI dashboard, GitHub settings, etc.

---

## Web app

Prefer a visual interface? Vaultless also ships as a web app with GitHub OAuth, a step-by-step wizard, a results dashboard, and one-click PR creation.

👉 [github.com/1FarukDev/Vaultless](https://github.com/1FarukDev/Vaultless)

---

## Links

- [GitHub repo](https://github.com/1FarukDev/Vaultless)
- [npm package](https://www.npmjs.com/package/vaultless)
- [Report an issue](https://github.com/1FarukDev/Vaultless/issues)

---

## License

MIT
```

---

After saving it, add it to your `packages/cli/package.json` so npm picks it up automatically:

```json
{
  "name": "vaultless",
  "readme": "README.md",
  ...
}
```

Then bump the version and republish:

```bash
npm version patch
npm run build
npm publish
```