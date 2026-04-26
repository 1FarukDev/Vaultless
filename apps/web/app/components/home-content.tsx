"use client";

import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GITHUB_OAUTH_SCOPE } from "@/lib/github-oauth-scope";

const ACCENT = "#00FF85";
const INSTALL_CMD = "npm install -g vaultless";
/** Published scope may differ; npm page documents install. */
const CLI_PACKAGE_URL = "https://www.npmjs.com/package/vaultless";

const reveal: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
};

const revealViewport = { once: true, amount: 0.35 };
const revealTransition: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
};

const features = [
  "GitHub OAuth login, no account setup",
  "Scans .env files, source, and configs",
  "Finds secrets in YAML, JSON, and TOML",
  "Detailed, file-level detection reports",
  "Auto-commits cleaned files to your repo",
  "Stateless architecture with no data storage",
];

const steps = ["Connect", "Scan", "Clean"];

const CLI_TERMINAL_FRAMES = [
  `$ vaultless scan

  ⚠ 1 secret found in 1 file

  src/app/page.tsx
    L11  [token]  const GITHUB_TOKEN = "ghp_█████..."

  Run vaultless clean to fix`,
  `$ vaultless clean

  ✓ Rewrote src/app/page.tsx
  ✓ 1 file updated — review changes before commit`,
];

function BrowserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 8h18" strokeLinecap="round" />
      <circle cx="6" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 10l3 2-3 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 14h4" strokeLinecap="round" />
    </svg>
  );
}

function AnimatedCliTerminal() {
  const [displayed, setDisplayed] = useState("");
  const [frameIndex, setFrameIndex] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const full = CLI_TERMINAL_FRAMES[frameIndex] ?? "";
    let i = 0;

    const typeNext = () => {
      if (cancelled) return;
      if (i <= full.length) {
        setDisplayed(full.slice(0, i));
        const delay =
          i > 0 && full[i - 1] === "\n" ? 48 : i === 0 ? 0 : 22;
        i += 1;
        timeoutRef.current = setTimeout(typeNext, delay);
      } else {
        timeoutRef.current = setTimeout(() => {
          if (cancelled) return;
          setFrameIndex((f) => (f + 1) % CLI_TERMINAL_FRAMES.length);
        }, 2400);
      }
    };

    typeNext();

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [frameIndex]);

  return (
    <pre className="min-h-[200px] overflow-x-auto rounded-xl border border-white/15 bg-black/60 p-4 text-left text-xs leading-relaxed text-white/85 md:text-sm">
      {displayed}
      <span
        className="inline-block w-2 tabular-nums"
        style={{ color: cursorOn ? ACCENT : "transparent" }}
      >
        ▍
      </span>
    </pre>
  );
}

type HomeContentProps = {
  repositoriesSection: React.ReactNode;
};

export default function HomeContent({ repositoriesSection }: HomeContentProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [copiedInstall, setCopiedInstall] = useState(false);

  const copyInstall = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const signInWithGitHub = useCallback(() => {
    signIn("github", { callbackUrl: "/" }, {
      prompt: "consent",
      scope: GITHUB_OAUTH_SCOPE,
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl gap-20">
        <motion.section
          className="grid gap-12 pt-12 lg:grid-cols-[1.2fr_1fr] lg:items-end"
          initial="initial"
          whileInView="whileInView"
          viewport={revealViewport}
          transition={revealTransition}
          variants={reveal}
        >
          <div className="space-y-8">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-white/60">
              Vaultless
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Scan GitHub repos. Remove exposed secrets automatically.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Vaultless connects to your repository, detects leaked environment
              variables and tokens, and commits clean files back in minutes.
            </p>

            <div
              id="install-cli"
              className="flex max-w-xl flex-col gap-2 scroll-mt-24 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/20 bg-black/50 py-2 pl-4 pr-2 font-mono text-sm text-white/90">
                <span className="truncate text-[#00FF85]/90">$</span>
                <code className="min-w-0 flex-1 truncate">{INSTALL_CMD}</code>
                <button
                  type="button"
                  onClick={copyInstall}
                  className="shrink-0 rounded-full border border-[#00FF85]/40 bg-[#00FF85]/10 px-3 py-1.5 font-mono text-xs font-medium text-[#00FF85] transition hover:bg-[#00FF85]/20"
                >
                  {copiedInstall ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  isAuthenticated
                    ? signOut({ callbackUrl: "/" })
                    : signInWithGitHub()
                }
                className="inline-flex h-11 items-center rounded-full border border-[#00FF85] bg-[#00FF85] px-6 text-sm font-semibold text-black transition hover:bg-[#00FF85]/90"
              >
                {isAuthenticated ? "Disconnect GitHub" : "Connect with GitHub"}
              </button>
              <Link
                href="/workflow"
                className="inline-flex h-11 items-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white/90 transition hover:border-[#00FF85]/50 hover:text-[#00FF85]"
              >
                Open guided workflow
              </Link>
              {isAuthenticated && (
                <p className="text-xs text-white/60">
                  Connected as{" "}
                  {session?.user?.name ?? session?.user?.email ?? "GitHub user"}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#00FF85]/25 bg-white/2 p-6 font-mono text-sm leading-relaxed text-white/80 shadow-[0_0_40px_-12px_rgba(0,255,133,0.35)]">
            <p className="mb-3 text-[#00FF85]/80">$ vaultless scan owner/repo</p>
            <p>Scanning tracked files...</p>
            <p>Found 4 exposed values in 2 files.</p>
            <p>Replaced sensitive values with placeholders.</p>
            <p>Committed changes to `security/vaultless-cleanup`.</p>
          </div>
        </motion.section>

        <motion.section
          className="space-y-10"
          initial="initial"
          whileInView="whileInView"
          viewport={revealViewport}
          transition={revealTransition}
          variants={reveal}
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Two ways to use Vaultless
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/55">
              Use it anywhere — in the browser or from your terminal.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl border border-white/20 bg-white/3 p-6 md:p-8">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-[#00FF85]/35 bg-[#00FF85]/10 text-[#00FF85]">
                <BrowserIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">Web App</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
                Connect your GitHub account, scan any repo, and open a PR with
                fixes — all from your browser.
              </p>
              <Link
                href="/workflow"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition hover:bg-[#00FF85]/90 sm:w-auto"
              >
                Try the web app
              </Link>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/20 bg-white/3 p-6 md:p-8">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-[#00FF85]/35 bg-[#00FF85]/10 text-[#00FF85]">
                <TerminalIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">CLI</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                Run Vaultless directly in any project folder. No browser needed.
              </p>
              <div className="mt-4">
                <AnimatedCliTerminal />
              </div>
              <a
                href={CLI_PACKAGE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-[#00FF85]/50 px-6 text-sm font-semibold text-[#00FF85] transition hover:bg-[#00FF85]/10 sm:w-auto"
              >
                Install the CLI
              </a>
              <a
                href="#install-cli"
                className="mt-3 text-center font-mono text-xs text-white/45 underline decoration-white/25 hover:text-[#00FF85] sm:text-left"
              >
                Quick install command ↑
              </a>
            </div>
          </div>
        </motion.section>

        {repositoriesSection}

        <motion.section
          className="space-y-10"
          initial="initial"
          whileInView="whileInView"
          viewport={revealViewport}
          transition={revealTransition}
          variants={reveal}
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/20 bg-white/1.5 p-6"
              >
                <span className="mb-5 inline-flex size-8 items-center justify-center rounded-full border border-[#00FF85]/30 font-mono text-xs text-[#00FF85]">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-medium">{step}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="space-y-10"
          initial="initial"
          whileInView="whileInView"
          viewport={revealViewport}
          transition={revealTransition}
          variants={reveal}
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Features built for engineering teams
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature}
                className="rounded-2xl border border-white/20 bg-white/1.5 p-6"
              >
                <p className="text-base leading-relaxed text-white/85">
                  {feature}
                </p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="space-y-8"
          initial="initial"
          whileInView="whileInView"
          viewport={revealViewport}
          transition={revealTransition}
          variants={reveal}
        >
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What Vaultless detects
          </h2>
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-black font-mono text-sm">
            <div className="border-b border-white/15 px-5 py-3 text-white/60">
              repo/.env.local
            </div>
            <pre className="overflow-x-auto p-5 text-white/80">
              {`GITHUB_TOKEN=[REDACTED]
DATABASE_URL=[REDACTED]
STRIPE_SECRET_KEY=[REDACTED]
JWT_PRIVATE_KEY=[REDACTED]

# vaultless report
# 4 secrets replaced and committed`}
            </pre>
          </div>
        </motion.section>

        <footer className="flex items-center justify-between border-t border-white/20 py-8">
          <p className="font-mono text-sm tracking-[0.18em] text-white/80">
            VAULTLESS
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/70 transition hover:text-white"
          >
            GitHub
          </a>
        </footer>
      </div>
    </main>
  );
}
