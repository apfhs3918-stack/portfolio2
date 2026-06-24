import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Archive of Small Questions — 김현정" },
      {
        name: "description",
        content:
          "사람들이 지나치는 작은 불편함과 감정을 발견합니다. 작은 질문에서 시작된 디자인 아카이브.",
      },
      { property: "og:title", content: "Archive of Small Questions — 김현정" },
      {
        property: "og:description",
        content: "작은 질문에서 시작된 아카이브 — 김현정의 디자인 포트폴리오.",
      },
    ],
  }),
  component: Index,
});

const IVORY = "#f3ede2";
const INK = "#1c1a17";
const RED = "#C95A5A";
const MUTED = "#8a8278";

type Thread = {
  id: string;
  code: string;
  title: string;
  hint: string;
  summary: string;
  to: string;
  angle: number; // 0 = right, 90 = down, 180 = left, 270 = up
};

// 4 projects arranged around a central node (left / top / right / bottom)
const threads: Thread[] = [
  {
    id: "closy",
    code: "THREAD 001",
    title: "Closy",
    hint: "옷은 많은데 입을 옷이 없다",
    summary: "옷장 등록의 번거로움과 코디 결정 피로를 발견",
    to: "/closy",
    angle: 180, // left
  },
  {
    id: "pofin",
    code: "THREAD 002",
    title: "POFIN",
    hint: "좋아하는 작품인데 이야기할 사람이 없다",
    summary: "스포일러보다 더 큰 진도 차이 문제를 발견",
    to: "/pofin",
    angle: 270, // top
  },
  {
    id: "hyundai",
    code: "THREAD 003",
    title: "Hyundai Card",
    hint: "취향은 어떻게 공간 경험이 될까",
    summary: "브랜드 취향이 공간으로 번역되는 순간을 관찰",
    to: "/hyundai",
    angle: 0, // right
  },
  {
    id: "graduation",
    code: "THREAD 004",
    title: "Graduation Project",
    hint: "애써 둥글게 살아야 할까",
    summary: "남의 시선 속에서 자신을 잃는 감정을 발견",
    to: "/graduation",
    angle: 90, // bottom
  },
];


// faint background whispers — not tied to projects
type Whisper = { id: string; text: string; top: string; left: string; rotate: number };
const whispers: Whisper[] = [
  { id: "w1", text: "지나친 친절은 가끔 자신을 지운다", top: "29%", left: "22%", rotate: -3 },
  { id: "w2", text: "사소한 불편함은 왜 반복될까", top: "16%", left: "78%", rotate: 2 },
  { id: "w3", text: "왜 추천은 항상 비슷할까", top: "84%", left: "20%", rotate: 1 },
  { id: "w4", text: "익숙한 불편함은 쉽게 지나친다", top: "88%", left: "74%", rotate: -2 },
  { id: "w5", text: "좋아하는 순간은 왜 금방 사라질까", top: "48%", left: "7%", rotate: -4 },
  { id: "w6", text: "말하지 않은 감정은 어디로 가는가", top: "52%", left: "92%", rotate: 3 },
];

const tools = ["Photoshop", "Illustrator", "Figma", "ChatGPT", "Claude", "Firefly"];

function Index() {
  const navigate = useNavigate();
  const [discovery, setDiscovery] = useState(false);
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const [active, setActive] = useState<Thread | null>(null);
  const [leaving, setLeaving] = useState<Thread | null>(null);
  const [litId, setLitId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [whoOpen, setWhoOpen] = useState(false);
  const [whoIdx, setWhoIdx] = useState(0);
  const [whoHover, setWhoHover] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);


  // refs for spotlight — avoid re-render on mousemove
  const spotlightRef = useRef<HTMLDivElement>(null);
  const whisperLayerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ensure cursor state is reset if the page unmounts while cursor was hidden
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, []);

  // keyboard nav for WHO? polaroid stack
  useEffect(() => {
    if (!whoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWhoOpen(false);
      else if (e.key === "ArrowRight") setWhoIdx((i) => Math.min(3, i + 1));
      else if (e.key === "ArrowLeft") setWhoIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [whoOpen]);

  // fixed center & radius (don't recalc per frame)
  // cluster positioned so THREAD 002 (top) keeps ≥100px gap below intro line at ~140px
  const cx = vp.w / 2;
  const cy = Math.max(vp.h * 0.58, 470);
  const Rraw = Math.min(vp.w, vp.h) * 0.22;
  // clamp radius so the top thread's top edge sits at least 260px below viewport top
  const Rcap = Math.max(170, cy - 260);
  const R = Math.max(190, Math.min(280, Math.min(Rraw, Rcap)));
  const SPOT = 230;

  const threadPositions = threads.map((t) => {
    const rad = (t.angle * Math.PI) / 180;
    const r = R;
    return {
      ...t,
      x: cx + Math.cos(rad) * r,
      y: cy + Math.sin(rad) * r,
    };
  });

  // pre-computed SVG paths — static, no recalculation
  const paths = threadPositions.map((t) => {
    const mx = (cx + t.x) / 2;
    const my = (cy + t.y) / 2;
    const nx = -(t.y - cy);
    const ny = t.x - cx;
    const nlen = Math.hypot(nx, ny) || 1;
    const off = 18;
    const cxp = mx + (nx / nlen) * off;
    const cyp = my + (ny / nlen) * off;
    return { id: t.id, d: `M ${cx} ${cy} Q ${cxp} ${cyp} ${t.x} ${t.y}`, x: t.x, y: t.y };
  });


  // spotlight follows pointer via direct DOM writes (no React re-render)
  useEffect(() => {
    if (!discovery) return;
    let raf = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;

    const apply = () => {
      raf = 0;
      const mask = `radial-gradient(circle ${SPOT}px at ${px}px ${py}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.05) 100%)`;
      if (spotlightRef.current) {
        spotlightRef.current.style.webkitMaskImage = mask;
        spotlightRef.current.style.maskImage = mask;
      }
      if (whisperLayerRef.current) {
        whisperLayerRef.current.style.webkitMaskImage = mask;
        whisperLayerRef.current.style.maskImage = mask;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${px - 7}px, ${py - 7}px, 0)`;
      }
      // determine lit thread (cheap)
      let nextLit: string | null = null;
      for (const p of paths) {
        if (Math.hypot(px - p.x, py - p.y) < SPOT * 0.95) {
          nextLit = p.id;
          break;
        }
      }
      setLitId((prev) => (prev === nextLit ? prev : nextLit));
    };

    const onMove = (x: number, y: number) => {
      px = x;
      py = y;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const m = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const t = (e: TouchEvent) => {
      const tt = e.touches[0];
      if (tt) onMove(tt.clientX, tt.clientY);
    };
    window.addEventListener("pointermove", m);
    window.addEventListener("touchmove", t, { passive: true });
    apply();
    return () => {
      window.removeEventListener("pointermove", m);
      window.removeEventListener("touchmove", t);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discovery, vp.w, vp.h]);

  const exitDiscovery = useCallback(() => {
    setDiscovery(false);
    setActive(null);
    setLitId(null);
    setLeaving(null);
  }, []);

  const handleEnter = useCallback(
    (t: Thread) => {
      if (!t.to) return;
      setActive(null);
      setLeaving(t);
      setTimeout(() => {
        navigate({ to: t.to }).catch(() => {});
      }, 620);
    },
    [navigate],
  );



  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: IVORY,
        color: INK,
        fontFamily:
          "'Noto Serif KR', 'Cormorant Garamond', ui-serif, Georgia, serif",
      }}
    >
      {/* top labels */}
      <div
        className="fixed top-6 left-6 md:top-8 md:left-10 text-[11px] tracking-[0.28em] uppercase z-[60]"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: MUTED }}
      >
        Archive of Small Questions · 2026
      </div>

      <div
        className="fixed top-6 right-6 md:top-8 md:right-10 text-[11px] tracking-[0.28em] uppercase z-[60]"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: MUTED }}
      >
        {discovery ? (
          <button
            onClick={exitDiscovery}
            className="transition-colors"
            style={{ color: RED }}
          >
            ✕ exit discovery
          </button>
        ) : (
          <span>Hyeon Jeong Kim — Content Designer</span>
        )}
      </div>

      {/* HERO */}
      <AnimatePresence>
        {!discovery && (
          <motion.section
            key="hero"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <div
              className="mb-8 h-px w-12"
              style={{
                background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)`,
              }}
            />
            <div
              className="text-[11px] tracking-[0.32em] uppercase mb-6"
              style={{ fontFamily: "ui-monospace, monospace", color: MUTED }}
            >
              ARCHIVE OF SMALL QUESTIONS
            </div>
            <h1
              className="leading-[1.3] tracking-tight max-w-3xl"
              style={{
                fontSize: "clamp(28px, 3.8vw, 46px)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              작은 질문에서 시작된{" "}
              <span style={{ fontStyle: "italic", color: RED }}>아카이브</span>
            </h1>

            <p
              className="mt-7 text-sm md:text-base max-w-lg"
              style={{ color: MUTED }}
            >
              사람들이 지나치는 작은 불편함과 감정을 발견합니다.
            </p>

            <button
              onClick={() => setDiscovery(true)}
              className="group mt-12 inline-flex items-center gap-3 px-7 py-4 border transition-colors"
              style={{
                borderColor: INK,
                color: INK,
                fontFamily: "ui-monospace, monospace",
                fontSize: 13,
                letterSpacing: "0.12em",
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = INK;
                e.currentTarget.style.color = IVORY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = INK;
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: RED }}
              />
              질문을 발견하시겠습니까?
            </button>

            <p
              className="mt-6 text-xs"
              style={{ color: MUTED, fontFamily: "ui-monospace, monospace" }}
            >
              버튼을 누르면 화면 곳곳에 숨겨진 질문이 드러납니다.
            </p>

            <a
              href="#about"
              className="absolute bottom-8 text-[10px] tracking-[0.28em] uppercase"
              style={{ fontFamily: "ui-monospace, monospace", color: MUTED }}
            >
              ↓ who collected these questions
            </a>
          </motion.section>
        )}
      </AnimatePresence>

      {/* DISCOVERY STAGE */}
      <AnimatePresence>
        {discovery && (
          <motion.section
            key="discovery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{ cursor: "none" }}
          >
            {/* darken overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(20,18,15,0.84)" }}
            />

            {/* single-line intro */}
            <div
              className="absolute left-0 right-0 text-center pointer-events-none"
              style={{
                top: 140,
                zIndex: 25,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "rgba(243,237,226,0.55)",
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Every project began with a question.
            </div>

            {/* WHO? polaroid — hidden archive object */}
            <button
              onClick={() => {
                if (connecting || whoOpen) return;
                setConnecting(true);
                window.setTimeout(() => {
                  setWhoIdx(0);
                  setSelectedSkill(null);
                  setWhoOpen(true);
                  setConnecting(false);
                }, 720);
              }}
              onMouseEnter={(e) => {
                setWhoHover(true);
                e.currentTarget.style.transform =
                  "rotate(-3deg) translateY(-4px) scale(1.04)";
              }}
              onMouseLeave={(e) => {
                setWhoHover(false);
                e.currentTarget.style.transform = "rotate(-7deg) translateY(0) scale(1)";
              }}
              className="absolute z-[55] group"
              style={{
                top: 200,
                left: 28,
                transform: "rotate(-7deg)",
                transformOrigin: "top left",
                transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                cursor: "pointer",
              }}
              aria-label="WHO collected these questions?"
            >
              <div
                style={{
                  width: 96,
                  height: 118,
                  backgroundColor: "#fbf6ec",
                  padding: "10px 10px 22px 10px",
                  boxShadow: whoHover
                    ? "0 18px 32px -10px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.08)"
                    : "0 12px 24px -10px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  position: "relative",
                  transition: "box-shadow 0.35s ease-out",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 72,
                    backgroundColor: "#efe7d8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0 2px, transparent 2px 4px)",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'Caveat', 'Patrick Hand', 'Comic Sans MS', cursive",
                      fontSize: 26,
                      color: whoHover || connecting ? RED : INK,
                      transform: "rotate(-4deg)",
                      letterSpacing: "0.02em",
                      transition: "color 0.3s ease-out",
                    }}
                  >
                    WHO?
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 4,
                    textAlign: "center",
                    fontFamily: "'Caveat', 'Patrick Hand', cursive",
                    fontSize: 11,
                    color: MUTED,
                  }}
                >
                  who recorded these?
                </div>
              </div>
            </button>

            {/* faint thread from THE KNOT → WHO polaroid */}
            {(whoHover || connecting) && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 14 }}
              >
                <motion.line
                  key={connecting ? "who-connect" : "who-hover"}
                  x1={cx}
                  y1={cy}
                  x2={76}
                  y2={259}
                  stroke={RED}
                  strokeWidth={connecting ? 1.4 : 1}
                  strokeLinecap="round"
                  initial={{ pathLength: connecting ? 0 : 1, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: connecting ? 0.85 : 0.18,
                  }}
                  transition={{
                    duration: connecting ? 0.7 : 0.25,
                    ease: "easeOut",
                  }}
                />
              </svg>
            )}



            {/* SVG: threads from knot to each node */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 11 }}
            >
              <defs>
                <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {paths.map((p) => {
                const isHover = hoverId === p.id;
                const isLeaving = leaving?.id === p.id;
                const lit = litId === p.id || isHover;
                return (
                  <g key={`line-${p.id}`}>
                    <path
                      d={p.d}
                      stroke={RED}
                      strokeWidth={isHover ? 1.6 : 1}
                      strokeDasharray={isHover ? "0" : "3 6"}
                      fill="none"
                      opacity={isLeaving ? 0 : lit ? 0.95 : 0.32}
                      filter={isHover ? "url(#threadGlow)" : undefined}
                      style={{ transition: "opacity 0.25s ease-out, stroke-width 0.25s ease-out" }}
                    />
                  </g>
                );
              })}
              {/* central knot — breathing glow */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={20}
                fill={RED}
                style={{ filter: "blur(8px)" }}
                animate={{ opacity: [0.14, 0.28, 0.14] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r={11}
                fill="none"
                stroke={RED}
                strokeWidth={0.8}
                animate={{ r: [11, 18, 11], strokeOpacity: [0.5, 0.05, 0.5] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
              <circle cx={cx} cy={cy} r={6} fill={RED} />
            </svg>



            {/* central node label */}
            <div
              className="absolute pointer-events-none text-center"
              style={{
                left: cx,
                top: cy + 24,
                transform: "translate(-50%, 0)",
                zIndex: 18,
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(243,237,226,0.55)",
              }}
            >
              the knot · 모든 질문이 모이는 곳
            </div>


            {/* whispers — base layer (very faint) */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
              {whispers.map((w) => (
                <div
                  key={w.id}
                  className="absolute text-center italic"
                  style={{
                    top: w.top,
                    left: w.left,
                    transform: `translate(-50%,-50%) rotate(${w.rotate}deg)`,
                    color: "rgba(243,237,226,0.06)",
                    fontSize: 15,
                    maxWidth: 240,
                  }}
                >
                  “{w.text}”
                </div>
              ))}
            </div>
            {/* whispers — spotlight-revealed layer */}
            <div
              ref={whisperLayerRef}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 13, willChange: "mask-image" }}
            >
              {whispers.map((w) => (
                <div
                  key={`lit-${w.id}`}
                  className="absolute text-center italic"
                  style={{
                    top: w.top,
                    left: w.left,
                    transform: `translate(-50%,-50%) rotate(${w.rotate}deg)`,
                    color: "rgba(243,237,226,0.82)",
                    fontSize: 15,
                    maxWidth: 240,
                  }}
                >
                  “{w.text}”
                </div>
              ))}
            </div>

            {/* THREAD nodes */}
            <div className="absolute inset-0" style={{ zIndex: 20 }}>
              {threadPositions.map((t) => {
                const lit = litId === t.id || hoverId === t.id;
                const isHover = hoverId === t.id;
                // anchor top thread by its top edge, bottom thread by its bottom edge,
                // sides centered — keeps every card clear of the knot and intro band
                const ty =
                  t.angle === 270 ? "0%" : t.angle === 90 ? "-100%" : "-50%";
                return (
                  <button
                    key={t.id}
                    onClick={() => setActive(t)}
                    onMouseEnter={() => setHoverId(t.id)}
                    onMouseLeave={() => setHoverId((h) => (h === t.id ? null : h))}
                    onFocus={() => setHoverId(t.id)}
                    onBlur={() => setHoverId((h) => (h === t.id ? null : h))}
                    className="absolute text-center"
                    style={{
                      left: t.x,
                      top: t.y,
                      transform: `translate(-50%, ${ty}) scale(${isHover ? 1.04 : 1})`,
                      width: 220,
                      cursor: "none",
                      opacity: lit ? 1 : 0.28,
                      transition: "opacity 0.2s ease-out, transform 0.25s ease-out",
                    }}
                  >

                    <div
                      className="text-[10px] tracking-[0.32em] mb-2"
                      style={{ fontFamily: "ui-monospace, monospace", color: RED }}
                    >
                      {t.code}
                    </div>
                    <div
                      style={{
                        color: IVORY,
                        fontSize: 15,
                        lineHeight: 1.5,
                        fontWeight: 400,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      “{t.hint}”
                    </div>
                    <div
                      className="mt-3 text-[10px] tracking-[0.28em] uppercase"
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        color: "rgba(243,237,226,0.5)",
                      }}
                    >
                      {t.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* spotlight reveal layer (optional — currently just for cursor masking effect) */}
            <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 14 }} />

            {/* custom cursor */}
            <div
              ref={cursorRef}
              className="pointer-events-none fixed top-0 left-0"
              style={{ zIndex: 50, width: 14, height: 14, willChange: "transform" }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  border: `1px solid ${RED}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 5.5,
                  left: 5.5,
                  width: 3,
                  height: 3,
                  borderRadius: 999,
                  backgroundColor: RED,
                }}
              />
            </div>

            <div
              className="absolute bottom-6 left-0 right-0 text-center text-[11px] tracking-[0.25em] uppercase pointer-events-none"
              style={{
                fontFamily: "ui-monospace, monospace",
                color: "rgba(243,237,226,0.45)",
                zIndex: 30,
              }}
            >
              move to discover · click a thread to open
            </div>
          </motion.section>
        )}
      </AnimatePresence>


      {/* PROJECT CARD MODAL */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="card-bg"
            className="fixed inset-0 z-[55] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: "rgba(20,18,15,0.6)", cursor: "default" }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl p-10"
              style={{
                backgroundColor: IVORY,
                borderRadius: 4,
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
                cursor: "default",
              }}
            >
              <div
                className="text-[10px] tracking-[0.3em] mb-6"
                style={{ fontFamily: "ui-monospace, monospace", color: RED }}
              >
                {active.code}
              </div>
              <h2
                className="leading-tight"
                style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.01em" }}
              >
                {active.title}
              </h2>
              <p
                className="mt-5 text-base"
                style={{ color: "#3a352e", fontStyle: "italic" }}
              >
                “{active.hint}”
              </p>
              <div
                className="my-7 h-px w-full"
                style={{
                  background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)`,
                }}
              />
              <p className="text-sm leading-relaxed" style={{ color: "#3a352e" }}>
                {active.summary}
              </p>

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setActive(null)}
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: "ui-monospace, monospace", color: MUTED }}
                >
                  ← 다시 탐색
                </button>
                <button
                  onClick={() => handleEnter(active)}
                  className="inline-flex items-center gap-2 px-5 py-3"
                  style={{
                    backgroundColor: INK,
                    color: IVORY,
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    borderRadius: 2,
                  }}
                >
                  OPEN THREAD
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: RED }}
                  />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RED THREAD TRANSITION — follows the actual thread path */}
      <AnimatePresence>
        {leaving && (() => {
          const leavingPath = paths.find((p) => p.id === leaving.id);
          return (
            <motion.div
              key="thread"
              className="fixed inset-0 z-[60] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              <svg className="w-full h-full">
                {leavingPath ? (
                  <>
                    <motion.path
                      d={leavingPath.d}
                      stroke={RED}
                      strokeWidth={2}
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0.9 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.6, 0, 0.2, 1] }}
                    />
                    <motion.circle
                      r={5}
                      fill={RED}
                      initial={{ cx, cy, opacity: 0 }}
                      animate={{ cx: leavingPath.x, cy: leavingPath.y, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.6, 0, 0.2, 1] }}
                    />
                  </>
                ) : null}
              </svg>
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: IVORY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46, duration: 0.18 }}
              />
            </motion.div>
          );
        })()}
      </AnimatePresence>


      {/* WHO? POLAROID STACK MODAL */}
      <AnimatePresence>
        {whoOpen && (
          <motion.div
            key="who-bg"
            className="fixed inset-0 z-[80] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ backgroundColor: "rgba(20,18,15,0.7)" }}
            onClick={() => setWhoOpen(false)}
          >
            <div
              className="relative"
              style={{ width: 360, height: 460 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* close */}
              <button
                onClick={() => setWhoOpen(false)}
                className="absolute -top-10 right-0 text-[11px] tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  color: "rgba(243,237,226,0.7)",
                }}
              >
                ✕ close
              </button>

              {/* stack */}
              {(() => {
                const cards = [
                  {
                    kind: "profile" as const,
                    label: "01 / WHO",
                    rotate: -3,
                  },
                  { kind: "skills" as const, label: "02 / SKILLS", rotate: 2 },
                  { kind: "contact" as const, label: "03 / CONTACT", rotate: -2 },
                  { kind: "about" as const, label: "04 / ABOUT", rotate: 3 },
                ];
                return cards.map((c, i) => {
                  const offset = i - whoIdx;
                  const visible = offset >= 0 && offset <= 2;
                  return (
                    <motion.div
                      key={c.kind}
                      className="absolute top-0 left-0"
                      initial={false}
                      animate={{
                        x: offset < 0 ? -420 : offset * 14,
                        y: offset * 10,
                        rotate: offset === 0 ? c.rotate : offset * 2,
                        scale: offset === 0 ? 1 : 1 - offset * 0.04,
                        opacity: offset < 0 ? 0 : visible ? 1 : 0,
                        zIndex: 10 - offset,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.2, 0.8, 0.2, 1],
                      }}
                      style={{
                        width: 360,
                        height: 460,
                        backgroundColor: "#fbf6ec",
                        padding: "18px 18px 56px 18px",
                        boxShadow:
                          "0 30px 60px -20px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.12)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        backgroundImage:
                          "repeating-linear-gradient(135deg, rgba(0,0,0,0.012) 0 2px, transparent 2px 5px)",
                      }}
                    >
                      <div
                        className="text-[10px] tracking-[0.3em] uppercase mb-3"
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          color: RED,
                        }}
                      >
                        {c.label}
                      </div>

                      {c.kind === "profile" && (
                        <>
                          <div
                            style={{
                              width: "100%",
                              height: 230,
                              backgroundColor: "#e9e0cf",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundImage:
                                "repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0 2px, transparent 2px 4px)",
                            }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "'Caveat', 'Patrick Hand', cursive",
                                fontSize: 22,
                                color: MUTED,
                              }}
                            >
                              portrait
                            </span>
                          </div>
                          <div
                            className="mt-4 flex items-baseline gap-2"
                            style={{
                              fontFamily:
                                "'Caveat', 'Patrick Hand', cursive",
                              color: INK,
                              lineHeight: 1.1,
                            }}
                          >
                            <span style={{ fontSize: 30 }}>김현정</span>
                            <span style={{ fontSize: 13, color: MUTED }}>
                              2000.02.07
                            </span>
                          </div>
                          <div
                            className="mt-1 text-[12px]"
                            style={{
                              color: MUTED,
                            }}
                          >
                            콘텐츠 디자이너
                          </div>
                          <p
                            className="mt-3 text-[13px] leading-relaxed"
                            style={{ color: "#3a352e" }}
                          >
                            사람들이 지나치는 작은 불편함과 감정을 발견하고
                            그 질문을 경험으로 풀어냅니다.
                          </p>
                        </>
                      )}

                      {c.kind === "skills" && (
                        <>
                          <div
                            style={{
                              fontFamily:
                                "'Caveat', 'Patrick Hand', cursive",
                              fontSize: 30,
                              color: INK,
                            }}
                          >
                            Skills
                          </div>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {([
                              ["Photoshop", "이미지 보정, 합성 및 목업 제작에 활용"],
                              ["Illustrator", "브랜드 아이덴티티 구축, 아이콘 및 그래픽 제작에 활용"],
                              ["InDesign", "브랜드북, 포트폴리오 및 편집 레이아웃 디자인 작업에 활용"],
                              ["Figma", "서비스 구조 설계, UX/UI 디자인 및 프로토타이핑에 활용"],
                              ["ChatGPT", "리서치 정리, 아이디어 구체화 및 콘텐츠 작성 보조에 활용"],
                              ["Claude", "문서 구조화, 프로젝트 정리 및 콘텐츠 기획에 활용"],
                              ["Firefly", "컨셉 시각화, 무드 탐색 및 레퍼런스 제작에 활용"],
                            ] as const).map(([s, desc]) => {
                              const active = selectedSkill === s;
                              return (
                                <button
                                  key={s}
                                  onClick={() =>
                                    setSelectedSkill(active ? null : s)
                                  }
                                  className="px-3 py-1 text-[12px]"
                                  style={{
                                    border: `1px solid ${active ? RED : INK}`,
                                    borderRadius: 2,
                                    color: active ? "#fff" : INK,
                                    backgroundColor: active ? RED : "transparent",
                                    fontFamily: "ui-monospace, monospace",
                                    transition:
                                      "background-color 0.25s, color 0.25s, border-color 0.25s",
                                    cursor: "pointer",
                                  }}
                                  aria-pressed={active}
                                  data-desc={desc}
                                >
                                  {s}
                                </button>
                              );
                            })}
                          </div>
                          <AnimatePresence mode="wait">
                            {selectedSkill ? (
                              <motion.p
                                key={selectedSkill}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="mt-5 text-[12.5px] leading-relaxed"
                                style={{ color: "#3a352e" }}
                              >
                                {
                                  {
                                    Photoshop: "이미지 보정, 합성 및 목업 제작에 활용",
                                    Illustrator: "브랜드 아이덴티티 구축, 아이콘 및 그래픽 제작에 활용",
                                    InDesign: "브랜드북, 포트폴리오 및 편집 레이아웃 디자인 작업에 활용",
                                    Figma: "서비스 구조 설계, UX/UI 디자인 및 프로토타이핑에 활용",
                                    ChatGPT: "리서치 정리, 아이디어 구체화 및 콘텐츠 작성 보조에 활용",
                                    Claude: "문서 구조화, 프로젝트 정리 및 콘텐츠 기획에 활용",
                                    Firefly: "컨셉 시각화, 무드 탐색 및 레퍼런스 제작에 활용",
                                  }[selectedSkill]
                                }
                              </motion.p>
                            ) : (
                              <motion.p
                                key="hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-5 text-[12px] italic"
                                style={{ color: MUTED }}
                              >
                                도구를 눌러보세요.
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      {c.kind === "contact" && (
                        <>
                          <div
                            style={{
                              fontFamily:
                                "'Caveat', 'Patrick Hand', cursive",
                              fontSize: 30,
                              color: INK,
                            }}
                          >
                            Contact
                          </div>
                          <a
                            href="mailto:apfhs3918@naver.com"
                            className="mt-4 block text-[14px] underline"
                            style={{ color: INK }}
                          >
                            apfhs3918@naver.com
                          </a>
                          <div className="mt-5 flex flex-col gap-2">
                            {[
                              {
                                label: "Instagram",
                                href: "https://instagram.com/",
                              },
                              {
                                label: "Google Drive",
                                href: "https://drive.google.com/",
                              },
                              { label: "Resume", href: "#" },
                            ].map((l) => (
                              <a
                                key={l.label}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] tracking-[0.18em] uppercase"
                                style={{
                                  fontFamily: "ui-monospace, monospace",
                                  color: INK,
                                }}
                              >
                                → {l.label}
                              </a>
                            ))}
                          </div>
                        </>
                      )}

                      {c.kind === "about" && (
                        <>
                          <div
                            style={{
                              fontFamily:
                                "'Caveat', 'Patrick Hand', cursive",
                              fontSize: 30,
                              color: INK,
                            }}
                          >
                            About
                          </div>
                          <p
                            className="mt-4 text-[13px] leading-relaxed"
                            style={{ color: "#3a352e" }}
                          >
                            사람들의 행동을 관찰하며 문제를 발견하고
                            더 나은 경험을 고민합니다.
                            <br />
                            복지관 디자인 수업부터 UX/UI 프로젝트까지
                            사용자의 입장에서 생각하며
                            디자인으로 문제를 해결하는 경험을 쌓아왔습니다.
                          </p>
                          <div
                            className="mt-5 space-y-2 text-[12px]"
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              color: INK,
                            }}
                          >
                            <div>
                              <span style={{ color: RED }}>2019.03 – 2025.08</span>
                              <div style={{ color: "#3a352e" }}>
                                상명대학교 시각디자인전공 졸업
                              </div>
                            </div>
                            <div>
                              <span style={{ color: RED }}>2016.03 – 2019.02</span>
                              <div style={{ color: "#3a352e" }}>
                                예림디자인고등학교 웹디자인과 졸업
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div
                        className="absolute left-0 right-0 bottom-4 text-center text-[10px] tracking-[0.28em] uppercase"
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          color: MUTED,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")} / 04
                      </div>
                    </motion.div>
                  );
                });
              })()}

              {/* controls */}
              <div
                className="absolute -bottom-14 left-0 right-0 flex items-center justify-between"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  color: "rgba(243,237,226,0.8)",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                }}
              >
                <button
                  onClick={() => setWhoIdx((i) => Math.max(0, i - 1))}
                  disabled={whoIdx === 0}
                  style={{ opacity: whoIdx === 0 ? 0.3 : 1 }}
                >
                  ← PREV
                </button>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <button
                      key={i}
                      onClick={() => setWhoIdx(i)}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        backgroundColor:
                          i === whoIdx ? RED : "rgba(243,237,226,0.35)",
                      }}
                      aria-label={`card ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setWhoIdx((i) => Math.min(3, i + 1))}
                  disabled={whoIdx === 3}
                  style={{ opacity: whoIdx === 3 ? 0.3 : 1 }}
                >
                  NEXT →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
