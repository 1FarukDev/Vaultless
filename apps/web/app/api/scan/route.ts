import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { Octokit } from "@octokit/rest"
import { isLikelyScannable, shouldSkip } from "@/lib/helpers/skip"
import { scanContent } from "@/lib/helpers/scan"

const MAX_FILE_SIZE_BYTES = 200_000
const MAX_FILES_TO_SCAN = 250
const MAX_COMMITS_TO_SCAN = 3000
const MAX_FILES_PER_COMMIT = 120
const MAX_HISTORY_FILES_TO_SCAN = 1_000
const SCAN_CONCURRENCY = 8

type ScanMode = "quick" | "deep"

type ScanResult = {
  file: string
  findings: ReturnType<typeof scanContent>
  commitSha?: string
  commitDate?: string
}

function isScannablePath(path: string) {
  return !shouldSkip(path) && isLikelyScannable(path)
}

async function scanHead(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<{ results: ScanResult[]; scannedFiles: number }> {
  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: "HEAD",
    recursive: "true",
  })

  const files = tree.tree
    .filter((f) => {
      if (f.type !== "blob" || !f.path || !f.sha) return false
      if (!isScannablePath(f.path)) return false
      if (typeof f.size === "number" && f.size > MAX_FILE_SIZE_BYTES) return false
      return true
    })
    .slice(0, MAX_FILES_TO_SCAN)

  const results: ScanResult[] = []

  for (let i = 0; i < files.length; i += SCAN_CONCURRENCY) {
    const chunk = files.slice(i, i + SCAN_CONCURRENCY)
    const scannedChunk = await Promise.all(
      chunk.map(async (file) => {
        if (!file.path || !file.sha) return null

        try {
          const { data: blob } = await octokit.git.getBlob({
            owner,
            repo,
            file_sha: file.sha,
          })

          const content = Buffer.from(blob.content, "base64").toString("utf-8")
          const findings = scanContent(content)

          if (findings.length === 0) return null
          return { file: file.path, findings }
        } catch {
          return null
        }
      }),
    )

    for (const result of scannedChunk) {
      if (result) results.push(result)
    }
  }

  return { results, scannedFiles: files.length }
}

async function readFileContentAtCommit(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string,
) {
  const response = await octokit.repos.getContent({ owner, repo, path, ref })
  if (Array.isArray(response.data) || response.data.type !== "file") return null
  if (!response.data.content) return null

  const size = response.data.size ?? 0
  if (size > MAX_FILE_SIZE_BYTES) return null

  return Buffer.from(response.data.content, "base64").toString("utf-8")
}

async function scanCommitHistory(
  octokit: Octokit,
  owner: string,
  repo: string,
): Promise<{ results: ScanResult[]; scannedFiles: number; commitsScanned: number }> {
  const { data: commits } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: MAX_COMMITS_TO_SCAN,
  })

  const uniqueTargets = new Map<string, { path: string; sha: string; date?: string }>()

  for (const commit of commits) {
    if (!commit.sha) continue
    const { data: commitDetails } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    })

    const files = (commitDetails.files ?? []).slice(0, MAX_FILES_PER_COMMIT)
    for (const changedFile of files) {
      if (!changedFile.filename) continue
      if (!isScannablePath(changedFile.filename)) continue
      if (changedFile.status === "removed") continue
      if (typeof changedFile.changes === "number" && changedFile.changes > 2_000) continue
      if (!changedFile.sha) continue

      // Deduplicate by blob SHA so we only scan unique content once.
      if (!uniqueTargets.has(changedFile.sha)) {
        uniqueTargets.set(changedFile.sha, {
          path: changedFile.filename,
          sha: commit.sha,
          date: commit.commit?.author?.date,
        })
      }
    }

    if (uniqueTargets.size >= MAX_HISTORY_FILES_TO_SCAN) break
  }

  const targets = [...uniqueTargets.values()].slice(0, MAX_HISTORY_FILES_TO_SCAN)
  const results: ScanResult[] = []

  for (let i = 0; i < targets.length; i += SCAN_CONCURRENCY) {
    const chunk = targets.slice(i, i + SCAN_CONCURRENCY)
    const scannedChunk = await Promise.all(
      chunk.map(async (target) => {
        try {
          const content = await readFileContentAtCommit(
            octokit,
            owner,
            repo,
            target.path,
            target.sha,
          )
          if (!content) return null
          const findings = scanContent(content)
          if (findings.length === 0) return null
          return {
            file: target.path,
            findings,
            commitSha: target.sha,
            commitDate: target.date,
          }
        } catch {
          return null
        }
      }),
    )

    for (const result of scannedChunk) {
      if (result) results.push(result)
    }
  }

  return {
    results,
    scannedFiles: targets.length,
    commitsScanned: commits.length,
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not signed in" }, { status: 401 })

  const {
    owner,
    repo,
    mode = "quick",
  }: { owner?: string; repo?: string; mode?: ScanMode } = await req.json()

  if (!owner || !repo) {
    return Response.json({ error: "owner and repo are required" }, { status: 400 })
  }

  if (mode !== "quick" && mode !== "deep") {
    return Response.json({ error: "invalid mode" }, { status: 400 })
  }

  const octokit = new Octokit({ auth: session.accessToken })
  try {
    if (mode === "deep") {
      const deepResult = await scanCommitHistory(octokit, owner, repo)
      return Response.json({
        results: deepResult.results,
        meta: {
          mode,
          scannedFiles: deepResult.scannedFiles,
          commitsScanned: deepResult.commitsScanned,
          maxCommits: MAX_COMMITS_TO_SCAN,
          maxFilesPerCommit: MAX_FILES_PER_COMMIT,
          maxHistoryFiles: MAX_HISTORY_FILES_TO_SCAN,
          skippedLargeFilesOverBytes: MAX_FILE_SIZE_BYTES,
        },
      })
    }

    const quickResult = await scanHead(octokit, owner, repo)
    return Response.json({
      results: quickResult.results,
      meta: {
        mode,
        scannedFiles: quickResult.scannedFiles,
        maxFiles: MAX_FILES_TO_SCAN,
        skippedLargeFilesOverBytes: MAX_FILE_SIZE_BYTES,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to scan repository"
    return Response.json({ error: message }, { status: 500 })
  }
}