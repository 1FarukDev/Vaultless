"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanCommand = cleanCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const glob_1 = require("glob");
const fs_1 = require("fs");
const scanner_1 = require("@vaultless/scanner");
async function cleanCommand(options) {
    console.log(chalk_1.default.green("\n  Vaultless — Secret Cleaner\n"));
    const spinner = (0, ora_1.default)("Scanning for secrets...").start();
    const files = await (0, glob_1.glob)("**/*", {
        nodir: true,
        ignore: [
            "node_modules/**",
            ".git/**",
            "dist/**",
            ".next/**",
            "*.lock",
            "package-lock.json",
        ],
    });
    const scannable = files.filter(f => !(0, scanner_1.shouldSkip)(f) && (0, scanner_1.isLikelyScannable)(f));
    const results = [];
    for (const file of scannable) {
        try {
            const content = (0, fs_1.readFileSync)(file, "utf-8");
            const findings = (0, scanner_1.scanContent)(content);
            if (findings.length > 0) {
                results.push({ file, findings, content });
            }
        }
        catch {
            // skip unreadable files
        }
    }
    spinner.stop();
    if (results.length === 0) {
        console.log(chalk_1.default.green("  ✓ No secrets found — nothing to clean\n"));
        return;
    }
    console.log(chalk_1.default.red(`  ⚠ ${results.length} file(s) with secrets found\n`));
    // clean each file
    const cleanSpinner = (0, ora_1.default)("Cleaning files...").start();
    for (const result of results) {
        const cleaned = (0, scanner_1.cleanContent)(result.content, result.findings);
        (0, fs_1.writeFileSync)(result.file, cleaned, "utf-8");
        cleanSpinner.text = `Cleaned ${result.file}`;
    }
    cleanSpinner.stop();
    // print what was fixed
    console.log(chalk_1.default.green(`\n  ✓ ${results.length} file(s) cleaned\n`));
    for (const result of results) {
        console.log(chalk_1.default.white(`  ${result.file}`));
        for (const finding of result.findings) {
            console.log(chalk_1.default.gray(`    L${finding.line} — ${finding.type} replaced with process.env`));
        }
    }
    console.log(chalk_1.default.yellow("\n  ⚠ Rotate your secrets immediately — they may still exist in git history\n"));
    if (options.pr) {
        console.log(chalk_1.default.gray("  --pr flag detected, opening PR...\n"));
        // wire up PR creation here in next step
    }
    if (options.direct) {
        console.log(chalk_1.default.gray("  --direct flag detected, committing to main...\n"));
        // wire up direct commit here in next step
    }
}
