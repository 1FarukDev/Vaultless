function shouldSkip(path: string): boolean {
  const normalizedPath = path.toLowerCase()
  const skipExtensions = [
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".mp4", ".mp3", ".pdf", ".zip", ".tar", ".gz",
    ".lock", ".woff", ".woff2", ".ttf", ".eot",
    ".exe", ".dll", ".so", ".dylib", ".bin", ".class",
    ".jar", ".map", ".min.js",
  ]
  return skipExtensions.some(ext => normalizedPath.endsWith(ext))
}

function isLikelyScannable(path: string): boolean {
  const normalizedPath = path.toLowerCase()
  const includeExtensions = [
    ".env", ".js", ".jsx", ".ts", ".tsx", ".py", ".rb", ".go",
    ".java", ".kt", ".php", ".rs", ".c", ".cpp", ".cs", ".swift",
    ".sh", ".bash", ".zsh", ".sql", ".graphql",
    ".json", ".yaml", ".yml", ".toml", ".ini", ".conf", ".config",
    ".properties", ".xml", ".txt", ".md",
  ]

  return (
    normalizedPath.includes(".env") ||
    includeExtensions.some(ext => normalizedPath.endsWith(ext))
  )
}

export { shouldSkip, isLikelyScannable }