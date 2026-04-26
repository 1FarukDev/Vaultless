const SECRET_PATTERNS = [
    // env files - only match actual values, not process.env references
    { pattern: /^[A-Z_]+=(?!["']?\s*$).+$/m, type: "env variable" },
  
    // generic secrets - only flag hardcoded string values
    { pattern: /api[_-]?key\s*=\s*["'][a-zA-Z0-9_\-]{8,}["']/i, type: "API key" },
    { pattern: /secret\s*=\s*["'][a-zA-Z0-9_\-]{8,}["']/i, type: "secret" },
    { pattern: /password\s*=\s*["'][a-zA-Z0-9_\-]{8,}["']/i, type: "password" },
    { pattern: /token\s*=\s*["'][a-zA-Z0-9_\-]{8,}["']/i, type: "token" },
  
    // cloud providers - these are very specific so no false positives
    { pattern: /AKIA[0-9A-Z]{16}/, type: "AWS access key" },
    { pattern: /AIza[0-9A-Za-z\-_]{35}/, type: "Google API key" },
    { pattern: /sk-[a-zA-Z0-9]{48}/, type: "OpenAI API key" },
    { pattern: /gh[pousr]_[A-Za-z0-9]{36}/, type: "GitHub token" },
  
    // connection strings
    { pattern: /mongodb(\+srv)?:\/\/.+:.+@/i, type: "MongoDB URI" },
    { pattern: /postgres:\/\/.+:.+@/i, type: "Postgres URI" },
    { pattern: /mysql:\/\/.+:.+@/i, type: "MySQL URI" },
  ]
  
  // lines containing these are safe and should be skipped
  const SAFE_PATTERNS = [
    /process\.env\./,           // reading from env vars
    /searchParams\.get/,        // reading URL params
    /generateToken/,            // generating tokens in code
    /encodeURIComponent/,       // encoding tokens for URLs
    /sessionStorage\.getItem/,  // reading from session storage
    /localStorage\.getItem/,    // reading from local storage
    /req\.headers/,             // reading from request headers
    /authHeader/,               // auth header handling
    /typeof\s+\w+\s*===/,       // type checking
    /\.replace\(/,              // string manipulation
    /\/\/.*/,                   // commented out lines
    /\*.*\*/,                   // block comment lines
  ]
  
  export function scanContent(content: string) {
    const lines = content.split("\n")
    const findings: { line: number; type: string; preview: string }[] = []
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
  
      // skip empty lines
      if (!line.trim()) continue
  
      // skip lines that match safe patterns
      if (SAFE_PATTERNS.some(p => p.test(line))) continue
  
      for (const { pattern, type } of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          findings.push({
            line: i + 1,
            type,
            preview: line.trim().slice(0, 60) + "...",
          })
          break // avoid duplicate findings on same line
        }
      }
    }
  
    return findings
  }