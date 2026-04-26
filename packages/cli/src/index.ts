#!/usr/bin/env node
import { program } from "commander"
import { scanCommand } from "./commands/scan"
import { cleanCommand } from "./commands/clean"

program
  .name("vaultless")
  .description("Scan and clean secrets from your project")
  .version("1.0.0")

program
  .command("scan")
  .description("Scan current directory for exposed secrets")
  .option("--deep", "Scan git commit history as well")
  .action(scanCommand)

program
  .command("clean")
  .description("Clean hardcoded secrets from files")
  .option("--pr", "Open a GitHub PR with the fixes")
  .option("--direct", "Commit fixes directly to main branch")
  .action(cleanCommand)

program.parse()