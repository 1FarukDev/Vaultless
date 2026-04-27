import chalk from "chalk"
import ora from "ora"
import { glob } from "glob"
import { readFileSync } from "fs"
import { scanContent, shouldSkip, isLikelyScannable } from "../scanner"

export async function scanCommand(options: { deep?: boolean }) {
  console.log(chalk.green("\n  Vaultless — Secret Scanner\n"))

  const spinner = ora("Fetching files...").start()

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

  spinner.text = `Scanning ${scannable.length} files...`

  const results = []

  for (const file of scannable) {
    try {
      const content = readFileSync(file, "utf-8")
      const findings = scanContent(content)

      if (findings.length > 0) {
        results.push({ file, findings })
      }
    } catch {
      // skip unreadable files
    }
  }

  spinner.stop()

  // print summary
  console.log(chalk.gray(`  Scanned ${scannable.length} files\n`))

  if (results.length === 0) {
    console.log(chalk.green("  ✓ No secrets found — your project is clean\n"))
    return
  }

  console.log(chalk.red(`  ⚠ ${results.reduce((acc, r) => acc + r.findings.length, 0)} secret(s) found in ${results.length} file(s)\n`))

  for (const result of results) {
    console.log(chalk.white.bold(`  ${result.file}`))

    for (const finding of result.findings) {
      console.log(
        chalk.gray(`    L${finding.line}  `) +
        chalk.yellow(`[${finding.type}]  `) +
        chalk.gray(finding.preview)
      )
    }
    console.log()
  }

  console.log(chalk.gray("  Run ") + chalk.white("`vaultless clean`") + chalk.gray(" to fix these issues\n"))
}