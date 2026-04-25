"use client";

import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { GITHUB_OAUTH_SCOPE } from "@/lib/github-oauth-scope";

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

type HomeContentProps = {
  repositoriesSection: React.ReactNode;
};

export default function HomeContent({ repositoriesSection }: HomeContentProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

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
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  isAuthenticated
                    ? signOut({ callbackUrl: "/" })
                    : signIn("github", { callbackUrl: "/" }, {
                        prompt: "consent",
                        scope: GITHUB_OAUTH_SCOPE,
                      })
                }
                className="inline-flex h-11 items-center rounded-full border border-white bg-white px-6 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
              >
                {isAuthenticated ? "Disconnect GitHub" : "Connect with GitHub"}
              </button>
              {isAuthenticated && (
                <p className="text-xs text-white/60">
                  Connected as {session?.user?.name ?? session?.user?.email ?? "GitHub user"}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/2 p-6 font-mono text-sm leading-relaxed text-white/80">
            <p className="mb-3 text-white/50">$ vaultless scan owner/repo</p>
            <p>Scanning tracked files...</p>
            <p>Found 4 exposed values in 2 files.</p>
            <p>Replaced sensitive values with placeholders.</p>
            <p>Committed changes to `security/vaultless-cleanup`.</p>
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
                <span className="mb-5 inline-flex size-8 items-center justify-center rounded-full border border-white/25 font-mono text-xs text-white/70">
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
                <p className="text-base leading-relaxed text-white/85">{feature}</p>
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
