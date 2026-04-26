"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanCommand = scanCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const glob_1 = require("glob");
const fs_1 = require("fs");
const scanner_1 = require("@vaultless/scanner");
async function scanCommand(options) {
    console.log(chalk_1.default.green("\n  Vaultless — Secret Scanner\n"));
    const spinner = (0, ora_1.default)("Fetching files...").start();
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
    spinner.text = `Scanning ${scannable.length} files...`;
    const results = [];
    for (const file of scannable) {
        try {
            const content = (0, fs_1.readFileSync)(file, "utf-8");
            const findings = (0, scanner_1.scanContent)(content);
            if (findings.length > 0) {
                results.push({ file, findings });
            }
        }
        catch {
            // skip unreadable files
        }
    }
    spinner.stop();
    // print summary
    console.log(chalk_1.default.gray(`  Scanned ${scannable.length} files\n`));
    if (results.length === 0) {
        console.log(chalk_1.default.green("  ✓ No secrets found — your project is clean\n"));
        return;
    }
    console.log(chalk_1.default.red(`  ⚠ ${results.reduce((acc, r) => acc + r.findings.length, 0)} secret(s) found in ${results.length} file(s)\n`));
    for (const result of results) {
        console.log(chalk_1.default.white.bold(`  ${result.file}`));
        for (const finding of result.findings) {
            console.log(chalk_1.default.gray(`    L${finding.line}  `) +
                chalk_1.default.yellow(`[${finding.type}]  `) +
                chalk_1.default.gray(finding.preview));
        }
        console.log();
    }
    console.log(chalk_1.default.gray("  Run ") + chalk_1.default.white("`vaultless clean`") + chalk_1.default.gray(" to fix these issues\n"));
}
