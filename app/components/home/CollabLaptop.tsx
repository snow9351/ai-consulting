/**
 * A 3D laptop built with CSS 3D transforms: a base slab (keyboard, speaker
 * grilles, touchpad, with visible front and right-hand edges) and a lid
 * hinged at its back edge, opened to about 110 degrees, with its own
 * thickness. The whole thing is viewed from above and to the right.
 *
 * The lid's screen shows VS Code working on a large project: a deep file
 * tree with Git markers, several tabs, a breadcrumb, a minimap, code, a
 * terminal and the status bar. Two teammates' Live Share cursors ("Mia",
 * "Leo") sit in the code. Decorative (aria-hidden).
 *
 * Sizes are in cqw (percent of the component's own width), so the model
 * scales with its container. The blinking caret uses .code-caret in app.css.
 */

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const UI = "Inter, system-ui, sans-serif";

/* VS Code "Dark+" colours. */
const C = {
  keyword: "#c586c0",
  control: "#569cd6",
  fn: "#dcdcaa",
  type: "#4ec9b0",
  variable: "#9cdcfe",
  string: "#ce9178",
  comment: "#6a9955",
  plain: "#d4d4d4",
  lineNo: "#6e7681",
};

type Token = [text: string, color: string];

/** The code on screen, one array of coloured tokens per line. */
const CODE: Token[][] = [
  [["import", C.keyword], [" { ", C.plain], ["Team", C.variable], [" } ", C.plain], ["from", C.keyword], [' "@jra/core"', C.string], [";", C.plain]],
  [["import", C.keyword], [" { ", C.plain], ["deploy", C.variable], [" } ", C.plain], ["from", C.keyword], [' "./deploy"', C.string], [";", C.plain]],
  [["import", C.keyword], [" ", C.plain], ["type", C.keyword], [" { ", C.plain], ["Idea", C.variable], [" } ", C.plain], ["from", C.keyword], [' "~/types"', C.string], [";", C.plain]],
  [],
  [["export", C.keyword], [" ", C.plain], ["async", C.control], [" ", C.plain], ["function", C.control], [" ", C.plain], ["launch", C.fn], ["(", C.plain], ["idea", C.variable], [": ", C.plain], ["Idea", C.type], [") {", C.plain]],
  [["  ", C.plain], ["const", C.control], [" ", C.plain], ["team", C.variable], [" = ", C.plain], ["await", C.keyword], [" ", C.plain], ["Team", C.type], [".", C.plain], ["assemble", C.fn], ["({", C.plain]],
  [["    ", C.plain], ["design", C.variable], [": ", C.plain], ["true", C.control], [",", C.plain]],
  [["    ", C.plain], ["build", C.variable], [": ", C.plain], ["true", C.control], [",", C.plain]],
  [["  ", C.plain], ["});", C.plain]],
  [["  ", C.plain], ["const", C.control], [" ", C.plain], ["app", C.variable], [" = ", C.plain], ["await", C.keyword], [" ", C.plain], ["team", C.variable], [".", C.plain], ["build", C.fn], ["(", C.plain], ["idea", C.variable], [");", C.plain]],
  [["  ", C.plain], ["// From first idea to production", C.comment]],
  [["  ", C.plain], ["return", C.keyword], [" ", C.plain], ["deploy", C.fn], ["(", C.plain], ["app", C.variable], [");", C.plain]],
  [["}", C.plain]],
];

const lineLength = (tokens: Token[]) => tokens.reduce((n, [text]) => n + text.length, 0);

const CODE_X = 156; // where code starts
const CODE_Y = 54; // baseline of line 1
const LINE = 7.6; // line height
const CHAR = 3.12; // monospace advance at font-size 5.2
const CURRENT_LINE = 11; // zero-based: "return deploy(app);"

/** Explorer rows: depth, label, and whether it is an open/closed folder. */
type Row = { label: string; depth: number; folder?: "open" | "closed"; git?: "M" | "U"; active?: boolean };
const TREE: Row[] = [
  { label: ".github", depth: 0, folder: "closed" },
  { label: ".vscode", depth: 0, folder: "closed" },
  { label: "public", depth: 0, folder: "closed" },
  { label: "src", depth: 0, folder: "open" },
  { label: "app", depth: 1, folder: "open" },
  { label: "routes", depth: 2, folder: "open" },
  { label: "_index.tsx", depth: 3 },
  { label: "contact.tsx", depth: 3, git: "M" },
  { label: "services.tsx", depth: 3 },
  { label: "root.tsx", depth: 2 },
  { label: "components", depth: 1, folder: "open" },
  { label: "ui", depth: 2, folder: "closed" },
  { label: "Header.tsx", depth: 2 },
  { label: "Footer.tsx", depth: 2 },
  { label: "hooks", depth: 1, folder: "closed" },
  { label: "lib", depth: 1, folder: "closed" },
  { label: "server", depth: 1, folder: "open" },
  { label: "api.ts", depth: 2 },
  { label: "db.ts", depth: 2 },
  { label: "deploy.ts", depth: 2, git: "U" },
  { label: "launch.ts", depth: 2, git: "M", active: true },
  { label: "tests", depth: 0, folder: "closed" },
  { label: ".env.example", depth: 0 },
  { label: "package.json", depth: 0, git: "M" },
  { label: "tsconfig.json", depth: 0 },
  { label: "README.md", depth: 0 },
];

function fileColor(label: string) {
  if (label.endsWith(".tsx")) return "#61dafb";
  if (label.endsWith(".ts")) return "#3178c6";
  if (label.endsWith(".json")) return "#cbcb41";
  if (label.endsWith(".md")) return "#519aba";
  return "#8c8c8c";
}

const TABS = [
  { label: "launch.ts", color: "#3178c6", active: true },
  { label: "contact.tsx", color: "#61dafb" },
  { label: "api.ts", color: "#3178c6" },
  { label: "package.json", color: "#cbcb41" },
];

/*
 * The keyboard deck, drawn flat and top-down in a 324 x 220 box; the 3D
 * transforms supply the perspective.
 */
const KEYS_PATH = (() => {
  // Function row (short keys), four letter rows, then the bottom row.
  const rows: { h: number; widths: number[] }[] = [
    { h: 8, widths: Array(14).fill(1) },
    { h: 15.4, widths: [...Array(13).fill(1), 1.5] },
    { h: 15.4, widths: [1.5, ...Array(13).fill(1)] },
    { h: 15.4, widths: [1.8, ...Array(11).fill(1), 1.8] },
    { h: 15.4, widths: [2.3, ...Array(10).fill(1), 2.3] },
    { h: 15.4, widths: [1, 1, 1.2, 1.4, 5.2, 1.4, 1.2, 1, 1] },
  ];
  const left = 51;
  const right = 273;
  const gap = 2.4;
  let y = 16;
  let d = "";
  for (const { h, widths } of rows) {
    const total = widths.reduce((a, b) => a + b, 0);
    const unit = (right - left - gap * (widths.length - 1)) / total;
    let x = left;
    for (const w of widths) {
      const width = unit * w;
      d += `M${(x + 1.2).toFixed(2)} ${y}h${(width - 2.4).toFixed(2)}a1.2 1.2 0 0 1 1.2 1.2v${(h - 2.4).toFixed(2)}a1.2 1.2 0 0 1 -1.2 1.2h${(-(width - 2.4)).toFixed(2)}a1.2 1.2 0 0 1 -1.2 -1.2v${(-(h - 2.4)).toFixed(2)}a1.2 1.2 0 0 1 1.2 -1.2Z`;
      x += width + gap;
    }
    y += h + gap;
  }
  return d;
})();

/** Speaker grilles either side of the keyboard: rows of tiny holes. */
const GRILLE_PATH = (() => {
  let d = "";
  for (let y = 17; y <= 113; y += 3.2) {
    for (const [from, to] of [
      [14, 42],
      [282, 310],
    ]) {
      for (let x = from; x <= to; x += 3.2) {
        d += `M${(x - 0.6).toFixed(2)} ${y.toFixed(2)}a0.6 0.6 0 1 0 1.2 0a0.6 0.6 0 1 0 -1.2 0`;
      }
    }
  }
  return d;
})();

/** A Live Share cursor: a coloured caret with a name flag to its right. */
function LiveCursor({ line, color, name }: { line: number; color: string; name: string }) {
  const x = CODE_X + lineLength(CODE[line]) * CHAR + 0.8;
  const y = CODE_Y + line * LINE;
  return (
    <g>
      <rect x={x} y={y - 5.2} width="0.9" height="6.6" fill={color} />
      <rect x={x + 0.9} y={y - 5.2} width={name.length * 3.1 + 4} height="5.2" rx="1" fill={color} />
      <text x={x + 2.9} y={y - 1.5} fontSize="3.9" fontWeight="700" fill="#fff" fontFamily={UI}>
        {name}
      </text>
    </g>
  );
}

/** The lid's front: aluminium edge, black glass bezel, camera and screen. */
function Screen({ className }: { className: string }) {
  return (
    <svg viewBox="48 6 324 214" preserveAspectRatio="none" className={className} focusable="false">
      <defs>
        <clipPath id="vscode-screen">
          <rect x="60" y="18" width="300" height="190" rx="2" />
        </clipPath>
        <linearGradient id="laptop-frame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d9dee8" />
          <stop offset="1" stopColor="#9ea8bb" />
        </linearGradient>
        <linearGradient id="laptop-glare" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.46" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Lid: aluminium edge, black glass bezel, camera */}
      <rect x="48" y="6" width="324" height="214" rx="13" fill="url(#laptop-frame)" />
      <rect x="49.5" y="7.5" width="321" height="211" rx="11.5" fill="#0a0c11" />
      <circle cx="210" cy="12.6" r="1.7" fill="#1c2230" />
      <circle cx="210" cy="12.6" r="0.7" fill="#2f3a55" />

      <g clipPath="url(#vscode-screen)" fontFamily={UI}>
        <rect x="60" y="18" width="300" height="190" fill="#1e1e1e" />

        {/* Title bar */}
        <rect x="60" y="18" width="300" height="9" fill="#323233" />
        <circle cx="65.5" cy="22.5" r="1.6" fill="#ff5f57" />
        <circle cx="70.8" cy="22.5" r="1.6" fill="#febc2e" />
        <circle cx="76.1" cy="22.5" r="1.6" fill="#28c840" />
        <rect x="170" y="19.8" width="80" height="5.6" rx="1.4" fill="#3c3c3c" />
        <text x="210" y="24" fontSize="3.6" fill="#a9a9a9" textAnchor="middle">
          launch.ts — jra-app
        </text>

        {/* Activity bar */}
        <rect x="60" y="27" width="11" height="173" fill="#333333" />
        <rect x="60" y="29.5" width="0.9" height="8" fill="#ffffff" />
        <rect x="62.8" y="30.4" width="5.4" height="6.2" rx="0.8" fill="none" stroke="#e6e6e6" strokeWidth="0.8" />
        <circle cx="65" cy="44.6" r="2.1" fill="none" stroke="#858585" strokeWidth="0.8" />
        <path d="M66.5 46.1l1.6 1.6" stroke="#858585" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="63.6" cy="53.4" r="1" fill="#858585" />
        <circle cx="67.4" cy="56.6" r="1" fill="#858585" />
        <path d="M63.6 54.4v4.2M63.6 56c0 0.9 3.8 0.4 3.8-0.4" stroke="#858585" strokeWidth="0.7" fill="none" />
        <circle cx="68.4" cy="52" r="1.6" fill="#007acc" />
        <text x="68.4" y="53.2" fontSize="2.6" fontWeight="700" fill="#fff" textAnchor="middle">4</text>
        <rect x="62.8" y="62.5" width="5.4" height="5.4" rx="0.8" fill="none" stroke="#858585" strokeWidth="0.8" />
        <path d="M62.8 65.2h5.4M65.5 62.5v5.4" stroke="#858585" strokeWidth="0.6" />
        <circle cx="65.5" cy="192" r="2.2" fill="none" stroke="#858585" strokeWidth="0.8" />
        <circle cx="65.5" cy="191.2" r="0.8" fill="#858585" />

        {/* Explorer: a large project tree */}
        <rect x="71" y="27" width="70" height="173" fill="#252526" />
        <text x="75" y="33.4" fontSize="3.3" fontWeight="700" fill="#bbbbbb" letterSpacing="0.25">
          EXPLORER
        </text>
        <path d="M74.6 37.6l1.3 1.3 1.3-1.3" fill="none" stroke="#c5c5c5" strokeWidth="0.6" />
        <text x="78.6" y="39.6" fontSize="3.3" fontWeight="700" fill="#cccccc">JRA-APP</text>
        {TREE.map((row, i) => {
          const y = 45.6 + i * 5.85;
          const x = 76 + row.depth * 4.4;
          const color = row.git === "M" ? "#e2c08d" : row.git === "U" ? "#73c991" : row.active ? "#ffffff" : "#cccccc";
          return (
            <g key={`${row.label}-${i}`}>
              {row.active ? (
                <>
                  <rect x="71" y={y - 4} width="70" height="5.4" fill="#37373d" />
                  <rect x="71" y={y - 4} width="70" height="5.4" fill="none" stroke="#007fd4" strokeWidth="0.5" />
                </>
              ) : null}
              {row.depth > 0
                ? Array.from({ length: row.depth }, (_, level) => (
                    <rect key={level} x={77.4 + level * 4.4} y={y - 4} width="0.3" height="5.85" fill="#3a3a3a" />
                  ))
                : null}
              {row.folder ? (
                <path
                  d={row.folder === "open" ? `M${x - 1} ${y - 2.4}l1.2 1.2 1.2-1.2` : `M${x - 0.6} ${y - 3}l1.2 1.2-1.2 1.2`}
                  fill="none"
                  stroke="#c5c5c5"
                  strokeWidth="0.55"
                />
              ) : (
                <rect x={x - 1.1} y={y - 2.9} width="2.6" height="2.6" rx="0.5" fill={fileColor(row.label)} />
              )}
              <text x={x + 2.8} y={y} fontSize="3.6" fill={color}>
                {row.label}
              </text>
              {row.git ? (
                <text x="138" y={y} fontSize="3.3" fontWeight="700" fill={color} textAnchor="end">
                  {row.git}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Tabs */}
        <rect x="141" y="27" width="219" height="8.6" fill="#252526" />
        {TABS.map((tab, i) => {
          const x = 141 + i * 41;
          return (
            <g key={tab.label}>
              <rect x={x} y="27" width="41" height="8.6" fill={tab.active ? "#1e1e1e" : "#2d2d2d"} />
              {tab.active ? <rect x={x} y="27" width="41" height="0.7" fill="#3178c6" /> : null}
              <rect x={x} y="27" width="0.3" height="8.6" fill="#252526" />
              <rect x={x + 3.2} y="30" width="2.4" height="2.4" rx="0.5" fill={tab.color} />
              <text x={x + 7.4} y="32.6" fontSize="3.5" fill={tab.active ? "#ffffff" : "#969696"}>
                {tab.label}
              </text>
              {tab.active ? (
                <path d={`M${x + 35.6} 29.9l2.2 2.2M${x + 37.8} 29.9l-2.2 2.2`} stroke="#cccccc" strokeWidth="0.5" />
              ) : null}
            </g>
          );
        })}

        {/* Breadcrumb */}
        <text x="146" y="41.2" fontSize="3.3" fill="#a9a9a9" xmlSpace="preserve">
          src  ›  server  ›  <tspan fill="#3178c6">TS</tspan> launch.ts  ›  <tspan fill="#b180d7">ƒ</tspan> launch
        </text>

        {/* Code */}
        <g fontFamily={MONO} fontSize="5.2">
          <rect x="141" y={CODE_Y + CURRENT_LINE * LINE - 5.6} width="205" height={LINE - 0.6} fill="#2a2d2e" />
          {CODE.map((tokens, i) => {
            const y = CODE_Y + i * LINE;
            return (
              <g key={i}>
                <text
                  x="151"
                  y={y}
                  fill={i === CURRENT_LINE ? "#c6c6c6" : C.lineNo}
                  textAnchor="end"
                  fontSize="4.4"
                >
                  {i + 1}
                </text>
                <text x={CODE_X} y={y} xmlSpace="preserve">
                  {tokens.map(([text, color], j) => (
                    <tspan key={j} fill={color}>
                      {text}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
          {/* Git gutter: modified and added lines */}
          <rect x="152.6" y={CODE_Y + 9 * LINE - 5.6} width="1" height={LINE * 3} fill="#1b81a8" />
          <rect x="152.6" y={CODE_Y + 1 * LINE - 5.6} width="1" height={LINE} fill="#487e02" />
          {/* Your own caret */}
          <rect
            className="code-caret"
            x={CODE_X + lineLength(CODE[CURRENT_LINE]) * CHAR + 0.6}
            y={CODE_Y + CURRENT_LINE * LINE - 5.2}
            width="0.8"
            height="6.4"
            fill="#aeafad"
          />
        </g>
        <LiveCursor line={4} color="#c084fc" name="Mia" />
        <LiveCursor line={10} color="#2dd4bf" name="Leo" />

        {/* Minimap */}
        <g opacity="0.7">
          {CODE.map((tokens, i) => {
            let x = 349;
            return (
              <g key={i}>
                {tokens.map(([text, color], j) => {
                  const width = text.trimStart().length * 0.42;
                  const lead = (text.length - text.trimStart().length) * 0.42;
                  const rect = width > 0 ? <rect key={j} x={x + lead} y={47 + i * 2.2} width={width} height="1.2" fill={color} /> : null;
                  x += text.length * 0.42;
                  return rect;
                })}
              </g>
            );
          })}
          <rect x="347" y="45" width="13" height="30" fill="#ffffff" opacity="0.06" />
        </g>
        <rect x="358.6" y="44" width="1.4" height="22" fill="#4f4f4f" opacity="0.8" />

        {/* Panel: terminal */}
        <rect x="141" y="154" width="219" height="46" fill="#1e1e1e" />
        <rect x="141" y="154" width="219" height="0.5" fill="#3c3c3c" />
        <g fontSize="3.3" letterSpacing="0.25">
          <text x="146" y="160.6" fill="#8b8b8b">PROBLEMS</text>
          <text x="167" y="160.6" fill="#8b8b8b">OUTPUT</text>
          <text x="184" y="160.6" fill="#e7e7e7" fontWeight="700">TERMINAL</text>
          <rect x="184" y="162" width="19" height="0.6" fill="#e7e7e7" />
          <text x="209" y="160.6" fill="#8b8b8b">PORTS</text>
        </g>
        <text x="352" y="160.6" fontSize="3.3" fill="#8b8b8b" textAnchor="end">zsh  +  ⌄</text>
        <g fontFamily={MONO} fontSize="4.2">
          <text x="146" y="169.5" fill="#cccccc" xmlSpace="preserve">
            <tspan fill="#4ec9b0">~/jra-app</tspan> <tspan fill="#c586c0">main</tspan> $ npm run test
          </text>
          <text x="146" y="176" fill="#cccccc" xmlSpace="preserve">
            <tspan fill="#23d18b"> PASS </tspan> 128 tests in 24 suites
          </text>
          <text x="146" y="182.5" fill="#cccccc" xmlSpace="preserve">
            <tspan fill="#4ec9b0">~/jra-app</tspan> <tspan fill="#c586c0">main</tspan> $ npm run deploy
          </text>
          <text x="146" y="189" fill="#cccccc" xmlSpace="preserve">
            <tspan fill="#23d18b">✓</tspan> Build complete · <tspan fill="#23d18b">✓</tspan> Live in production
          </text>
          <text x="146" y="195.5" fill="#cccccc" xmlSpace="preserve">
            <tspan fill="#4ec9b0">~/jra-app</tspan> <tspan fill="#c586c0">main</tspan> $ ▋
          </text>
        </g>

        {/* Status bar */}
        <rect x="60" y="200" width="300" height="8" fill="#007acc" />
        <rect x="60" y="200" width="9" height="8" fill="#16825d" />
        <g fontSize="3.6" fill="#ffffff">
          <text x="64.5" y="205.2" textAnchor="middle">⟩⟨</text>
          <text x="72" y="205.2">⎇ main*</text>
          <text x="91" y="205.2">⟳ 0↓ 1↑</text>
          <text x="111" y="205.2">⊗ 0  ⚠ 0</text>
          <text x="132" y="205.2">● Live Share · 3</text>
          <text x="356" y="205.2" textAnchor="end" xmlSpace="preserve">
            Ln 12, Col 22    UTF-8    LF    {"{ }"} TypeScript    Prettier
          </text>
        </g>

        {/* Soft reflection across the glass */}
        <rect x="60" y="18" width="300" height="190" fill="url(#laptop-glare)" />
      </g>

    </svg>
  );
}

/** The base's top surface, seen from straight above. */
function Deck({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 324 220" preserveAspectRatio="none" className={className} focusable="false">
      <defs>
        <linearGradient id="laptop-deck" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c6cdda" />
          <stop offset="0.5" stopColor="#dfe4ec" />
          <stop offset="1" stopColor="#e9edf4" />
        </linearGradient>
        <linearGradient id="laptop-touchpad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d2d8e3" />
          <stop offset="1" stopColor="#c6cdda" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="324" height="220" rx="9" fill="url(#laptop-deck)" />
      {/* Hinge */}
      <rect x="10" y="0" width="304" height="6" rx="2" fill="#4a5265" />
      {/* Keyboard well, keys, speaker grilles */}
      <rect x="48" y="13" width="228" height="103" rx="3" fill="#aeb7c7" />
      <path d={KEYS_PATH} fill="#1b1f29" stroke="#0c0f15" strokeWidth="0.4" />
      <path d={GRILLE_PATH} fill="#8f99ad" />
      {/* Touchpad and the front notch */}
      <rect x="100" y="128" width="124" height="80" rx="6" fill="url(#laptop-touchpad)" stroke="#aab3c4" strokeWidth="0.8" />
      <path d="M140 220h44a6 6 0 0 0-6-4.5h-32a6 6 0 0 0-6 4.5Z" fill="#9aa4b8" />
    </svg>
  );
}

/* Model dimensions, in cqw (percent of the component's width). */
const W = 62; // width of base and lid
const D = 42; // depth of the base
const H = 41; // height of the lid
const T = 1.7; // base thickness
const L = 0.9; // lid thickness
const cqw = (n: number) => `${n}cqw`;

export function CollabLaptop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`[container-type:inline-size] ${className}`}>
      <div className="relative w-full" style={{ height: cqw(80), perspective: cqw(240), perspectiveOrigin: "50% 15%" }}>
        {/* The base: its top surface is this element's face. */}
        <div
          className="absolute [transform-style:preserve-3d]"
          style={{
            left: cqw((100 - W) / 2 - 5),
            top: cqw(40),
            width: cqw(W),
            height: cqw(D),
            transform: "rotateX(50deg) rotateZ(16deg)",
          }}
        >
          {/* Soft shadow on the desk */}
          <div
            className="absolute inset-0 rounded-[2cqw] bg-[#0b1f4f]/35 blur-[2.4cqw]"
            style={{ transform: `translateZ(${cqw(-T - 0.2)}) scale(1.03)` }}
          />
          {/* Front and right-hand edges of the base */}
          <div
            className="absolute left-0 w-full rounded-b-[1cqw] bg-[linear-gradient(180deg,#b9c1d0,#8792a7)]"
            style={{ top: "100%", height: cqw(T), transformOrigin: "top", transform: "rotateX(-90deg)" }}
          />
          <div
            className="absolute top-0 h-full bg-[linear-gradient(180deg,#a9b2c3,#c4cbd8)]"
            style={{ left: "100%", width: cqw(T), transformOrigin: "left", transform: "rotateY(90deg)" }}
          />
          <Deck className="absolute inset-0 h-full w-full" />

          {/* The lid, hinged on the base's back edge */}
          <div
            className="absolute left-0 w-full [transform-style:preserve-3d]"
            style={{ bottom: "100%", height: cqw(H), transformOrigin: "bottom", transform: "rotateX(-76deg)" }}
          >
            {/* Back plate, top and right-hand edges give it thickness */}
            <div
              className="absolute inset-0 rounded-[1.8cqw] bg-[linear-gradient(160deg,#dfe3ea,#9ca6b9)]"
              style={{ transform: `translateZ(${cqw(-L)})` }}
            />
            <div
              className="absolute top-0 left-0 w-full bg-[#aab3c4]"
              style={{ height: cqw(L), transformOrigin: "top", transform: "rotateX(-90deg)" }}
            />
            <div
              className="absolute top-0 h-full bg-[linear-gradient(180deg,#c9d0dc,#9aa4b8)]"
              style={{ left: "100%", width: cqw(L), transformOrigin: "left", transform: "rotateY(90deg)" }}
            />
            <Screen className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
