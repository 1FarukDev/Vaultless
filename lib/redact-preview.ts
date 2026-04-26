/**
 * Redact likely secret material in a single-line preview for safe UI display.
 */
export function redactPreview(text: string): string {
  let s = text;

  s = s.replace(
    /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/gi,
    (_match, srvMarker, user) => {
      const proto = srvMarker ? "mongodb+srv" : "mongodb";
      return `${proto}://${String(user)}:█████@`;
    },
  );
  s = s.replace(/postgres:\/\/([^:]+):([^@]+)@/gi, "postgres://$1:█████@");
  s = s.replace(/mysql:\/\/([^:]+):([^@]+)@/gi, "mysql://$1:█████@");

  s = s.replace(/gh[pousr]_[A-Za-z0-9_]+/gi, "█████");
  s = s.replace(/sk-[a-zA-Z0-9]+/gi, "█████");
  s = s.replace(/AKIA[0-9A-Z]{16}/g, "█████");
  s = s.replace(/AIza[0-9A-Za-z\-_]{20,}/g, "█████");

  s = s.replace(
    /(api[_-]?key|secret|password|token)\s*=\s*["']([^"']{4,})["']/gi,
    '$1="█████"',
  );

  s = s.replace(/^[A-Z_][A-Z0-9_]*=(?!["']?\s*$)(.+)$/gm, (_line, value) => {
    return _line.replace(String(value).trim(), "█████");
  });

  return s;
}
