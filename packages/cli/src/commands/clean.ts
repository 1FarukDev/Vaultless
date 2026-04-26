import chalk from "chalk"
import ora from "ora"
import { glob } from "glob"
import { readFileSync, writeFileSync } from "fs"
import { scanContent, cleanContent, shouldSkip, isLikelyScannable } from "@vaultless/scanner"

export async function cleanCommand(options: { pr?: boolean; direct?: boolean }) {
  console.log(chalk.green("\n  Vaultless — Secret Cleaner\n"))

  const spinner = ora("Scanning for secrets...").start()

  const files = await glob("**/*", {
    nodir: true,
    ignore: [
      "node_modules/**",
      ".git/**",
      "dist/**",
      ".next/**",
      "*.lock",
      "package-lock.json",
    ],
  })

  const scannable = files.filter(f => !shouldSkip(f) && isLikelyScannable(f))
  const results = []

  for (const file of scannable) {
    try {
      const content = readFileSync(file, "utf-8")
      const findings = scanContent(content)
      if (findings.length > 0) {
        results.push({ file, findings, content })
      }
    } catch {
      // skip unreadable files
    }
  }

  spinner.stop()

  if (results.length === 0) {
    console.log(chalk.green("  ✓ No secrets found — nothing to clean\n"))
    return
  }

  console.log(chalk.red(`  ⚠ ${results.length} file(s) with secrets found\n`))

  // clean each file
  const cleanSpinner = ora("Cleaning files...").start()

  for (const result of results) {
    const cleaned = cleanContent(result.content, result.findings)
    writeFileSync(result.file, cleaned, "utf-8")
    cleanSpinner.text = `Cleaned ${result.file}`
  }

  cleanSpinner.stop()

  // print what was fixed
  console.log(chalk.green(`\n  ✓ ${results.length} file(s) cleaned\n`))

  for (const result of results) {
    console.log(chalk.white(`  ${result.file}`))
    for (const finding of result.findings) {
      console.log(chalk.gray(`    L${finding.line} — ${finding.type} replaced with process.env`))
    }
  }

  console.log(
    chalk.yellow("\n  ⚠ Rotate your secrets immediately — they may still exist in git history\n")
  )

  if (options.pr) {
    console.log(chalk.gray("  --pr flag detected, opening PR...\n"))
    // wire up PR creation here in next step
  }

  if (options.direct) {
    console.log(chalk.gray("  --direct flag detected, committing to main...\n"))
    // wire up direct commit here in next step
  }
}