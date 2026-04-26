import type { Finding } from "@/lib/types/scan";

function cleanContent(content: string, findings: Finding[]) {
    const lines = content.split("\n")

    for (const finding of findings) {
        const lineIndex = finding.line - 1
        const line = lines[lineIndex]

        if (!line) continue

        // extract the variable name from the line
        // e.g. const GITHUB_TOKEN = "ghp_xxx" -> GITHUB_TOKEN
        const varNameMatch = line.match(
            /(?:const|let|var)?\s*([A-Z_a-z][A-Z_a-z0-9]*)\s*=/
        )

        if (varNameMatch) {
            const varName = varNameMatch[1].toUpperCase()
            // replace the hardcoded value with process.env reference
            lines[lineIndex] = line.replace(
                /=\s*["'][^"']+["']/,
                `= process.env.${varName}`
            )
        }
    }

    return lines.join("\n")
}

export { cleanContent }