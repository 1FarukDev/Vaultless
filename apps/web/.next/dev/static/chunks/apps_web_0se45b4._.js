(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/lib/github-oauth-scope.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Space-separated scopes for GitHub OAuth App (not GitHub App) login. */ __turbopack_context__.s([
    "GITHUB_OAUTH_SCOPE",
    ()=>GITHUB_OAUTH_SCOPE
]);
const GITHUB_OAUTH_SCOPE = "read:user user:email repo read:org";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/lib/redact-preview.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Redact likely secret material in a single-line preview for safe UI display.
 */ __turbopack_context__.s([
    "redactPreview",
    ()=>redactPreview
]);
function redactPreview(text) {
    let s = text;
    s = s.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/gi, (_match, srvMarker, user)=>{
        const proto = srvMarker ? "mongodb+srv" : "mongodb";
        return `${proto}://${String(user)}:█████@`;
    });
    s = s.replace(/postgres:\/\/([^:]+):([^@]+)@/gi, "postgres://$1:█████@");
    s = s.replace(/mysql:\/\/([^:]+):([^@]+)@/gi, "mysql://$1:█████@");
    s = s.replace(/gh[pousr]_[A-Za-z0-9_]+/gi, "█████");
    s = s.replace(/sk-[a-zA-Z0-9]+/gi, "█████");
    s = s.replace(/AKIA[0-9A-Z]{16}/g, "█████");
    s = s.replace(/AIza[0-9A-Za-z\-_]{20,}/g, "█████");
    s = s.replace(/(api[_-]?key|secret|password|token)\s*=\s*["']([^"']{4,})["']/gi, '$1="█████"');
    s = s.replace(/^[A-Z_][A-Z0-9_]*=(?!["']?\s*$)(.+)$/gm, (_line, value)=>{
        return _line.replace(String(value).trim(), "█████");
    });
    return s;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/lib/parse-github-repo-url.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Parse owner/repo from common GitHub URL shapes or `owner/repo` shorthand.
 */ __turbopack_context__.s([
    "parseGithubRepoUrl",
    ()=>parseGithubRepoUrl,
    "repoListItemFromGithubRef",
    ()=>repoListItemFromGithubRef,
    "syntheticRepoListId",
    ()=>syntheticRepoListId
]);
function parseGithubRepoUrl(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const noQuery = trimmed.split(/[?#]/)[0]?.replace(/\/+$/, "") ?? "";
    const stripGit = (name)=>name.replace(/\.git$/i, "");
    const looksLikePlainRef = !noQuery.includes("://") && !noQuery.toLowerCase().includes("github.com");
    if (looksLikePlainRef) {
        const parts = noQuery.split("/").filter(Boolean);
        if (parts.length === 2) {
            return {
                owner: parts[0],
                repo: stripGit(parts[1])
            };
        }
    }
    try {
        const href = noQuery.includes("://") ? noQuery : `https://${noQuery}`;
        const u = new URL(href);
        if (u.hostname !== "github.com" && u.hostname !== "www.github.com") {
            return null;
        }
        const parts = u.pathname.split("/").filter(Boolean);
        if (parts.length < 2) return null;
        const skip = new Set([
            "settings",
            "orgs",
            "login",
            "explore",
            "marketplace",
            "sponsors"
        ]);
        if (skip.has(parts[0])) return null;
        const owner = parts[0];
        const repo = stripGit(parts[1]);
        if (!owner || !repo) return null;
        return {
            owner,
            repo
        };
    } catch  {
        return null;
    }
}
function syntheticRepoListId(owner, repo) {
    const s = `${owner.toLowerCase()}/${repo.toLowerCase()}`;
    let h = 0;
    for(let i = 0; i < s.length; i++){
        h = Math.imul(31, h) + s.charCodeAt(i);
    }
    return h <= 0 ? h - 1 : -h - 1;
}
function repoListItemFromGithubRef(owner, repo) {
    return {
        id: syntheticRepoListId(owner, repo),
        owner,
        name: repo,
        description: null,
        language: null,
        private: false,
        updated_at: null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/app/components/vaultless-wizard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VaultlessWizard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$github$2d$oauth$2d$scope$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/github-oauth-scope.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$redact$2d$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/redact-preview.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$parse$2d$github$2d$repo$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/parse-github-repo-url.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const STEP_LABELS = [
    "Connect",
    "Select Repo",
    "Scan",
    "Clean & Fix"
];
function GitHubIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        }, void 0, false, {
            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = GitHubIcon;
function Spinner({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `animate-spin ${className ?? ""}`,
        viewBox: "0 0 24 24",
        fill: "none",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c1 = Spinner;
function typeBadgeClass(type) {
    const k = type.toLowerCase();
    if (k.includes("token")) return "border-[#00FF85]/50 bg-[#00FF85]/15 text-white";
    if (k.includes("api")) return "border-white/35 bg-white/10 text-white/90";
    if (k.includes("password") || k.includes("secret")) return "border-white/30 bg-white/8 text-white/85";
    return "border-white/25 bg-white/6 text-white/80";
}
function VaultlessWizard({ initialRepos, isAuthenticated: serverAuthed }) {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(serverAuthed ? 2 : 1);
    const [repos, setRepos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialRepos);
    const [repoQuery, setRepoQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [repoLinkInput, setRepoLinkInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [repoLinkError, setRepoLinkError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedRepo, setSelectedRepo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scanMode, setScanMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("quick");
    const [scanning, setScanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scanLogs, setScanLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scanProgress, setScanProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scanResults, setScanResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scanMeta, setScanMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cleaning, setCleaning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cleaningStrategy, setCleaningStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cleanSuccess, setCleanSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cleanError, setCleanError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const logRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const progressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const logIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clientAuthed = status === "authenticated";
    const authed = clientAuthed || serverAuthed;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VaultlessWizard.useEffect": ()=>{
            if (status !== "authenticated" || step !== 1) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startTransition"])({
                "VaultlessWizard.useEffect": ()=>{
                    setStep(2);
                }
            }["VaultlessWizard.useEffect"]);
        }
    }["VaultlessWizard.useEffect"], [
        status,
        step
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VaultlessWizard.useEffect": ()=>{
            if (status !== "authenticated") return;
            if (repos.length > 0) return;
            let cancelled = false;
            ({
                "VaultlessWizard.useEffect": async ()=>{
                    try {
                        const res = await fetch("/api/repos");
                        const data = await res.json();
                        if (!cancelled && Array.isArray(data.repos)) {
                            setRepos(data.repos);
                        }
                    } catch  {
                    /* ignore */ }
                }
            })["VaultlessWizard.useEffect"]();
            return ({
                "VaultlessWizard.useEffect": ()=>{
                    cancelled = true;
                }
            })["VaultlessWizard.useEffect"];
        }
    }["VaultlessWizard.useEffect"], [
        status,
        repos.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VaultlessWizard.useEffect": ()=>{
            const el = logRef.current;
            if (el) el.scrollTop = el.scrollHeight;
        }
    }["VaultlessWizard.useEffect"], [
        scanLogs
    ]);
    const appendLog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VaultlessWizard.useCallback[appendLog]": (line)=>{
            setScanLogs({
                "VaultlessWizard.useCallback[appendLog]": (prev)=>[
                        ...prev,
                        line
                    ]
            }["VaultlessWizard.useCallback[appendLog]"]);
        }
    }["VaultlessWizard.useCallback[appendLog]"], []);
    const stopScanAnimation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "VaultlessWizard.useCallback[stopScanAnimation]": ()=>{
            if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
            }
            if (logIntervalRef.current) {
                clearInterval(logIntervalRef.current);
                logIntervalRef.current = null;
            }
        }
    }["VaultlessWizard.useCallback[stopScanAnimation]"], []);
    const globalBusy = scanning || cleaning;
    function applyRepoFromLink() {
        setRepoLinkError(null);
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$parse$2d$github$2d$repo$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseGithubRepoUrl"])(repoLinkInput);
        if (!parsed) {
            setRepoLinkError("Enter a valid GitHub URL or owner/repo (e.g. https://github.com/org/app or org/app).");
            return;
        }
        setSelectedRepo((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$parse$2d$github$2d$repo$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["repoListItemFromGithubRef"])(parsed.owner, parsed.repo));
    }
    const filteredRepos = repos.filter((r)=>{
        const q = repoQuery.trim().toLowerCase();
        if (!q) return true;
        return `${r.name} ${r.description ?? ""} ${r.language ?? ""}`.toLowerCase().includes(q);
    });
    async function runScan() {
        if (!selectedRepo) return;
        const { owner, name: repo } = selectedRepo;
        setScanning(true);
        setScanProgress(8);
        setScanLogs([]);
        setCleanSuccess(null);
        setCleanError(null);
        const idleMessages = [
            "✓ Fetching file tree...",
            "✓ Resolving repository snapshot...",
            "✓ Loading candidate files..."
        ];
        let mi = 0;
        logIntervalRef.current = setInterval(()=>{
            appendLog(idleMessages[mi % idleMessages.length]);
            mi++;
        }, 550);
        progressTimerRef.current = setInterval(()=>{
            setScanProgress((p)=>p < 92 ? p + 2 : p);
        }, 400);
        try {
            const res = await fetch("/api/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    owner,
                    repo,
                    mode: scanMode
                })
            });
            const data = await res.json();
            stopScanAnimation();
            setScanProgress(100);
            if (!res.ok) {
                appendLog(`✗ Scan failed: ${data?.error ?? res.statusText}`);
                return;
            }
            const results = Array.isArray(data.results) ? data.results : [];
            appendLog(`✓ Scan complete — ${results.length} file(s) with findings`);
            for (const r of results.slice(0, 12)){
                appendLog(`⚠ Secret pattern in ${r.file} (${r.findings.length} finding(s))`);
            }
            if (results.length > 12) {
                appendLog(`… and ${results.length - 12} more file(s)`);
            }
            setScanResults(results);
            setScanMeta({
                mode: data.meta?.mode === "deep" ? "deep" : "quick",
                scannedFiles: data.meta?.scannedFiles ?? 0,
                maxFiles: data.meta?.maxFiles,
                maxCommits: data.meta?.maxCommits,
                commitsScanned: data.meta?.commitsScanned,
                skippedLargeFilesOverBytes: data.meta?.skippedLargeFilesOverBytes
            });
            setStep(4);
        } catch (e) {
            stopScanAnimation();
            appendLog(`✗ ${e instanceof Error ? e.message : "Network error during scan"}`);
        } finally{
            stopScanAnimation();
            setScanning(false);
        }
    }
    async function runClean(strategy) {
        if (!selectedRepo || scanResults.length === 0) return;
        setCleaning(true);
        setCleaningStrategy(strategy);
        setCleanSuccess(null);
        setCleanError(null);
        try {
            const res = await fetch("/api/clean", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    owner: selectedRepo.owner,
                    repo: selectedRepo.name,
                    results: scanResults,
                    strategy
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error ?? "Clean failed");
            }
            if (strategy === "pr" && data.prUrl) {
                setCleanSuccess({
                    mode: "pr",
                    prUrl: data.prUrl
                });
            } else if (strategy === "main") {
                setCleanSuccess({
                    mode: "main",
                    branch: data.branch ?? "default"
                });
            }
        } catch (e) {
            setCleanError(e instanceof Error ? e.message : "Request failed");
        } finally{
            setCleaning(false);
            setCleaningStrategy(null);
        }
    }
    const secretsCount = scanResults.reduce((n, r)=>n + r.findings.length, 0);
    function renderStepSidebar() {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: `flex w-full shrink-0 flex-col border-b border-white/10 px-6 py-8 md:w-64 md:border-b-0 md:border-r ${globalBusy ? "pointer-events-none opacity-50" : ""}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-mono text-[10px] uppercase tracking-[0.24em] text-white/45",
                    children: "Vaultless"
                }, void 0, false, {
                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                    lineNumber: 299,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-2 text-sm font-semibold tracking-tight text-white/90",
                    children: "Workflow"
                }, void 0, false, {
                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                    lineNumber: 302,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "relative mt-8 space-y-0",
                    children: STEP_LABELS.map((label, i)=>{
                        const n = i + 1;
                        const completed = step > n;
                        const active = step === n;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "relative flex gap-3 pb-8 last:pb-0",
                            children: [
                                i < STEP_LABELS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute left-[11px] top-6 h-[calc(100%-0.5rem)] w-px bg-white/15",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 313,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-mono ${active ? "border-[#00FF85] bg-[#00FF85] text-black shadow-[0_0_14px_rgba(0,255,133,0.45)]" : completed ? "border-white bg-white text-black" : "border-white/30 bg-transparent text-white/40"}`,
                                    children: completed ? "✓" : active ? "●" : ""
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `min-w-0 pt-0.5 ${active ? "text-white" : completed ? "text-white/50" : "text-white/35"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-mono uppercase tracking-wider text-white/40",
                                            children: [
                                                "Step ",
                                                n
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 332,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm font-medium ${active ? "text-[#00FF85]" : ""}`,
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 335,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 329,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, label, true, {
                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                            lineNumber: 311,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                    lineNumber: 305,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
            lineNumber: 296,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-[#0a0a0a] text-white md:flex-row",
        children: [
            renderStepSidebar(),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-[calc(100vh-1px)] flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-sm font-semibold tracking-tight",
                                children: [
                                    "Vaultless",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#00FF85]",
                                        children: "."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                        lineNumber: 357,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this),
                            authed && session?.user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    session.user.image ? // eslint-disable-next-line @next/next/no-img-element
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: session.user.image,
                                        alt: "",
                                        className: "size-8 rounded-full border border-white/20"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                        lineNumber: 363,
                                        columnNumber: 17
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                                                callbackUrl: "/"
                                            }),
                                        className: "font-mono text-xs text-white/50 underline decoration-white/30 hover:text-white",
                                        children: "Sign out"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                        lineNumber: 369,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                        lineNumber: 354,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 px-6 py-8 md:px-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            mode: "wait",
                            children: [
                                step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 16
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: -12
                                    },
                                    transition: {
                                        duration: 0.35
                                    },
                                    className: "mx-auto flex max-w-lg flex-col items-center pt-8 md:pt-16",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full rounded-2xl border border-white/15 bg-white/3 p-8 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-semibold tracking-tight md:text-3xl",
                                                children: "Connect your GitHub account"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 392,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-3 text-sm text-white/55",
                                                children: "Vaultless needs access to scan your repositories."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 395,
                                                columnNumber: 19
                                            }, this),
                                            clientAuthed && session?.user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-8 flex flex-col items-center gap-3",
                                                children: [
                                                    session.user.image ? // eslint-disable-next-line @next/next/no-img-element
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: session.user.image,
                                                        alt: "",
                                                        className: "size-16 rounded-full border-2 border-[#00FF85]/50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 25
                                                    }, this) : null,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-white",
                                                        children: session.user.name ?? session.user.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-[#00FF85]/40 bg-[#00FF85]/15 px-3 py-1 font-mono text-xs text-[#00FF85]",
                                                        children: "Connected"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 399,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signIn"])("github", {
                                                        callbackUrl: "/"
                                                    }, {
                                                        prompt: "consent",
                                                        scope: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$github$2d$oauth$2d$scope$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GITHUB_OAUTH_SCOPE"]
                                                    }),
                                                className: "mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00FF85] px-8 text-sm font-semibold text-black transition hover:bg-[#00FF85]/90",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GitHubIcon, {
                                                        className: "size-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Connect with GitHub"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 416,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                        lineNumber: 391,
                                        columnNumber: 17
                                    }, this)
                                }, "s1", false, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 383,
                                    columnNumber: 15
                                }, this),
                                step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 16
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: -12
                                    },
                                    transition: {
                                        duration: 0.35
                                    },
                                    className: "mx-auto max-w-4xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl font-semibold tracking-tight",
                                            children: "Select a repository to scan"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 443,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 rounded-xl border border-white/15 bg-white/3 p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-white/90",
                                                    children: "Paste a GitHub link"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-xs text-white/45",
                                                    children: [
                                                        "Supports",
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono text-white/60",
                                                            children: "https://github.com/owner/repo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 453,
                                                            columnNumber: 21
                                                        }, this),
                                                        ",",
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono text-white/60",
                                                            children: "owner/repo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 21
                                                        }, this),
                                                        ", etc. Your account must have access to the repository."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            value: repoLinkInput,
                                                            onChange: (e)=>{
                                                                setRepoLinkInput(e.target.value);
                                                                setRepoLinkError(null);
                                                            },
                                                            onKeyDown: (e)=>{
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    applyRepoFromLink();
                                                                }
                                                            },
                                                            placeholder: "https://github.com/vercel/next.js",
                                                            className: "min-w-0 flex-1 rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-sm outline-none placeholder:text-white/30 focus:border-[#00FF85]/50"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            disabled: globalBusy || !repoLinkInput.trim(),
                                                            onClick: applyRepoFromLink,
                                                            className: "shrink-0 rounded-xl bg-[#00FF85] px-5 py-2.5 font-mono text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40",
                                                            children: "Use this repo"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 19
                                                }, this),
                                                repoLinkError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-3 text-sm text-amber-400/90",
                                                    children: repoLinkError
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 21
                                                }, this),
                                                selectedRepo && selectedRepo.id < 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-3 font-mono text-xs text-[#00FF85]",
                                                    children: [
                                                        "Ready to scan: ",
                                                        selectedRepo.owner,
                                                        "/",
                                                        selectedRepo.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 447,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-8 text-xs font-mono uppercase tracking-[0.15em] text-white/40",
                                            children: "Or choose from your repositories"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 496,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "search",
                                            value: repoQuery,
                                            onChange: (e)=>setRepoQuery(e.target.value),
                                            placeholder: "Filter repositories…",
                                            className: "mt-3 w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-mono text-sm outline-none placeholder:text-white/35 focus:border-[#00FF85]/50"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 499,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 max-h-[50vh] overflow-y-auto rounded-xl border border-white/10 p-2 md:max-h-[min(60vh,520px)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "grid gap-3 md:grid-cols-2",
                                                    children: filteredRepos.map((r)=>{
                                                        const sel = selectedRepo?.id === r.id;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    setSelectedRepo(r);
                                                                    setRepoLinkError(null);
                                                                },
                                                                disabled: globalBusy,
                                                                className: `flex w-full flex-col rounded-xl border p-4 text-left transition ${sel ? "border-[#00FF85] bg-[#00FF85]/10 shadow-[0_0_0_1px_rgba(0,255,133,0.25)]" : "border-white/15 bg-white/3 hover:border-white/25"} disabled:cursor-not-allowed disabled:opacity-40`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono text-sm font-semibold text-white",
                                                                        children: r.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mt-1 line-clamp-2 text-xs text-white/50",
                                                                        children: r.description ?? "No description"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                        lineNumber: 529,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-3 flex flex-wrap gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/65",
                                                                                children: r.private ? "Private" : "Public"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                                lineNumber: 533,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "rounded-full border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/65",
                                                                                children: r.language ?? "—"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                                lineNumber: 536,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                        lineNumber: 532,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "mt-2 font-mono text-[10px] text-white/40",
                                                                        children: [
                                                                            "Updated",
                                                                            " ",
                                                                            r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "—"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                        lineNumber: 540,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, r.id, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 512,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 19
                                                }, this),
                                                filteredRepos.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "py-12 text-center text-sm text-white/45",
                                                    children: "No repositories match your filter."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 506,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex flex-wrap items-center gap-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: !selectedRepo || globalBusy,
                                                onClick: ()=>setStep(3),
                                                className: "inline-flex h-11 items-center rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40",
                                                children: "Scan selected repo"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 558,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 557,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, "s2", true, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 435,
                                    columnNumber: 15
                                }, this),
                                step === 3 && selectedRepo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 16
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: -12
                                    },
                                    transition: {
                                        duration: 0.35
                                    },
                                    className: "mx-auto max-w-3xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-mono text-xs text-white/45",
                                            children: "Selected"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 579,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "mt-1 font-mono text-xl font-semibold text-white",
                                            children: [
                                                selectedRepo.owner,
                                                "/",
                                                selectedRepo.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 580,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setScanMode("quick"),
                                                    disabled: scanning,
                                                    className: `rounded-full border px-4 py-2 font-mono text-xs transition ${scanMode === "quick" ? "border-[#00FF85] bg-[#00FF85]/15 text-[#00FF85]" : "border-white/25 text-white/70 hover:border-white/40"} disabled:opacity-40`,
                                                    children: "Quick Scan"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 585,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setScanMode("deep"),
                                                    disabled: scanning,
                                                    className: `rounded-full border px-4 py-2 font-mono text-xs transition ${scanMode === "deep" ? "border-[#00FF85] bg-[#00FF85]/15 text-[#00FF85]" : "border-white/25 text-white/70 hover:border-white/40"} disabled:opacity-40`,
                                                    children: "Deep Scan"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 597,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-3 text-sm text-white/55",
                                            children: [
                                                "Quick: current snapshot only. Deep: recent commit history —",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-amber-400/90",
                                                    children: "may take a few minutes"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 19
                                                }, this),
                                                "."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 610,
                                            columnNumber: 17
                                        }, this),
                                        scanning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 overflow-hidden rounded-full border border-white/15 bg-white/5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-2 rounded-full bg-[length:200%_100%] transition-[width] duration-300",
                                                style: {
                                                    width: `${scanProgress}%`,
                                                    backgroundImage: "linear-gradient(90deg, #00FF85 0%, #00FF85 40%, rgba(0,255,133,0.4) 50%, #00FF85 60%, #00FF85 100%)",
                                                    animation: "vaultless-shimmer 1.2s linear infinite"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                lineNumber: 620,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 619,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                            ref: logRef,
                                            className: "mt-6 max-h-56 overflow-y-auto rounded-xl border border-white/15 bg-black/50 p-4 font-mono text-xs leading-relaxed text-white/75",
                                            children: scanLogs.length === 0 && !scanning ? "Output will appear here when you start the scan." : scanLogs.join("\n")
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 632,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex flex-wrap gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: scanning,
                                                    onClick: runScan,
                                                    className: "inline-flex h-11 items-center gap-2 rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40",
                                                    children: scanning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                                                                className: "size-4 text-black"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                lineNumber: 650,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Scanning…"
                                                        ]
                                                    }, void 0, true) : "Start Scan"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: scanning,
                                                    onClick: ()=>setStep(2),
                                                    className: "rounded-full border border-white/25 px-5 py-2 font-mono text-xs text-white/70 hover:border-white/45 disabled:cursor-not-allowed disabled:opacity-40",
                                                    children: "Back"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 641,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, "s3", true, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 571,
                                    columnNumber: 15
                                }, this),
                                step === 4 && selectedRepo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: {
                                        opacity: 0,
                                        y: 16
                                    },
                                    animate: {
                                        opacity: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: -12
                                    },
                                    transition: {
                                        duration: 0.35
                                    },
                                    className: "mx-auto max-w-4xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-mono text-xs text-white/45",
                                            children: "Repository"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 678,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "mt-1 font-mono text-lg font-semibold",
                                            children: [
                                                selectedRepo.owner,
                                                "/",
                                                selectedRepo.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 679,
                                            columnNumber: 17
                                        }, this),
                                        scanMeta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-white/55",
                                            children: [
                                                secretsCount,
                                                " secret",
                                                secretsCount === 1 ? "" : "s",
                                                " found across ",
                                                scanResults.length,
                                                " file",
                                                scanResults.length === 1 ? "" : "s",
                                                " · ",
                                                scanMeta.scannedFiles,
                                                " ",
                                                "files scanned · ",
                                                scanMeta.mode === "deep" ? "Deep" : "Quick"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 683,
                                            columnNumber: 19
                                        }, this),
                                        cleanSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                scale: 0.98,
                                                opacity: 0
                                            },
                                            animate: {
                                                scale: 1,
                                                opacity: 1
                                            },
                                            className: "mt-6 rounded-xl border border-[#00FF85]/35 bg-[#00FF85]/10 px-4 py-3 text-sm text-[#00FF85]",
                                            children: cleanSuccess.mode === "pr" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    "PR opened successfully.",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: cleanSuccess.prUrl,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        className: "font-mono underline",
                                                        children: "View pull request"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    "Files fixed on branch ",
                                                    cleanSuccess.branch,
                                                    "."
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 692,
                                            columnNumber: 19
                                        }, this),
                                        cleanError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-4 text-sm text-red-400/90",
                                            children: cleanError
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 716,
                                            columnNumber: 19
                                        }, this),
                                        scanResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90",
                                            children: "⚠️ Rotate your secrets immediately — the old commit still exists in Git history."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 720,
                                            columnNumber: 19
                                        }, this),
                                        scanResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                scale: 0.92
                                            },
                                            animate: {
                                                scale: [
                                                    1,
                                                    1.04,
                                                    1
                                                ]
                                            },
                                            transition: {
                                                duration: 0.5
                                            },
                                            className: "mt-16 flex flex-col items-center py-12 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex size-20 items-center justify-center rounded-full border-2 border-[#00FF85] text-4xl text-[#00FF85]",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-semibold text-white",
                                                    children: "No secrets found"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 736,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 max-w-md text-sm text-white/50",
                                                    children: "Your repo looks clean under the current rules."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 727,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-8 space-y-4",
                                            children: scanResults.map((fileResult)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "rounded-xl border border-white/15 bg-white/3 p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "break-all font-mono text-sm text-white",
                                                            children: fileResult.file
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 750,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                            className: "mt-4 space-y-3",
                                                            children: fileResult.findings.map((f, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                    className: "flex flex-col gap-2 sm:flex-row sm:items-start",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex shrink-0 gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded border border-[#00FF85]/40 bg-[#00FF85]/10 px-2 py-0.5 font-mono text-[11px] text-[#00FF85]",
                                                                                    children: [
                                                                                        "L",
                                                                                        f.line
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                                    lineNumber: 760,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `rounded-full border px-2 py-0.5 font-mono text-[10px] ${typeBadgeClass(f.type)}`,
                                                                                    children: f.type
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                                    lineNumber: 763,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                            lineNumber: 759,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                                            className: "min-w-0 flex-1 overflow-x-auto rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white/80",
                                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$redact$2d$preview$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["redactPreview"])(f.preview)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                            lineNumber: 769,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, `${f.line}-${idx}`, true, {
                                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                                    lineNumber: 755,
                                                                    columnNumber: 29
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 753,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, `${fileResult.file}-${fileResult.commitSha ?? "h"}`, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 746,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 744,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: cleaning || scanResults.length === 0,
                                                    onClick: ()=>runClean("pr"),
                                                    className: "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#00FF85] px-6 text-sm font-semibold text-black transition enabled:hover:bg-[#00FF85]/90 disabled:cursor-not-allowed disabled:opacity-40",
                                                    children: [
                                                        cleaning && cleaningStrategy === "pr" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                                                            className: "size-4 text-black"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 788,
                                                            columnNumber: 23
                                                        }, this) : null,
                                                        "Open a PR"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 781,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: cleaning || scanResults.length === 0,
                                                    onClick: ()=>runClean("main"),
                                                    className: "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#00FF85]/50 px-6 text-sm font-semibold text-[#00FF85] transition enabled:hover:bg-[#00FF85]/10 disabled:cursor-not-allowed disabled:opacity-40",
                                                    children: [
                                                        cleaning && cleaningStrategy === "main" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                                                            className: "size-4 text-[#00FF85]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                            lineNumber: 799,
                                                            columnNumber: 23
                                                        }, this) : null,
                                                        "Fix directly on main"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                                    lineNumber: 792,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                            lineNumber: 780,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, "s4", true, {
                                    fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                                    lineNumber: 670,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
                lineNumber: 353,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/app/components/vaultless-wizard.tsx",
        lineNumber: 350,
        columnNumber: 5
    }, this);
}
_s(VaultlessWizard, "OywnOJKo/T/mbfmxhfdEuPuJl84=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c2 = VaultlessWizard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "GitHubIcon");
__turbopack_context__.k.register(_c1, "Spinner");
__turbopack_context__.k.register(_c2, "VaultlessWizard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_0se45b4._.js.map