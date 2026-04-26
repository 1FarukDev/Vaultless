#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const scan_1 = require("./commands/scan");
const clean_1 = require("./commands/clean");
commander_1.program
    .name("vaultless")
    .description("Scan and clean secrets from your project")
    .version("1.0.0");
commander_1.program
    .command("scan")
    .description("Scan current directory for exposed secrets")
    .option("--deep", "Scan git commit history as well")
    .action(scan_1.scanCommand);
commander_1.program
    .command("clean")
    .description("Clean hardcoded secrets from files")
    .option("--pr", "Open a GitHub PR with the fixes")
    .option("--direct", "Commit fixes directly to main branch")
    .action(clean_1.cleanCommand);
commander_1.program.parse();
