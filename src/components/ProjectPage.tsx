import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

const IVORY = "#f3ede2";
const INK = "#1c1a17";
const RED = "#C95A5A";
const MUTED = "#8a8278";

export type SectionImage = {
  src: string;
  alt: string;
};

export type Section = {
  id: string;
  label: string;
  title?: string;
  body?: ReactNode;
  bullets?: string[];
  images?: SectionImage[];
};

export type ProjectMeta = {
  code: string;
  title: string;
  question: string;
  type: string;
  contribution: string[];
  role?: string;
  period?: string;
  overview?: ReactNode;
  sections: Section[];
  next: { to: string; title: string; question: string };
};

const MonoLabel = ({ children, color = RED }: { children: ReactNode; color?: string }) => (
  <div
    className="text-[10px] tracking-[0.32em] uppercase"
    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color }}
  >
    {children}
  </div>
);

const Divider = () => (
  <div
    className="my-16 h-px w-full"
    style={{
      background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)`,
      opacity: 0.55,
    }}
  />
);

const THREAD_ORDER = [
  { code: "THREAD 001", title: "CLOSY", to: "/closy" },
  { code: "THREAD 002", title: "POFIN", to: "/pofin" },
  { code: "THREAD 003", title: "HYUNDAI", to: "/hyundai" },
  { code: "THREAD 004", title: "GRADUATION", to: "/graduation" },
] as const;

function ThreadProgress({ code }: { code: string }) {
  const currentIdx = THREAD_ORDER.findIndex((t) => t.code === code);
  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      {THREAD_ORDER.map((t, i) => {
        const isCurrent = i === currentIdx;
        const isPast = i < currentIdx;
        return (
          <div key={t.code} className="flex items-center gap-3">
            <Link
              to={t.to}
              className="flex flex-col items-center gap-1.5 group"
              aria-current={isCurrent ? "page" : undefined}
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: isCurrent ? 10 : 6,
                  height: isCurrent ? 10 : 6,
                  backgroundColor: isCurrent || isPast ? RED : "transparent",
                  border: `1px solid ${RED}`,
                  opacity: isCurrent ? 1 : isPast ? 0.7 : 0.4,
                }}
              />
              <span
                className="text-[9px] tracking-[0.24em] uppercase"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  color: isCurrent ? INK : MUTED,
                  opacity: isCurrent ? 1 : 0.65,
                }}
              >
                {t.title}
              </span>
            </Link>
            {i < THREAD_ORDER.length - 1 ? (
              <span
                className="block h-px w-8"
                style={{
                  background: `repeating-linear-gradient(to right, ${RED} 0 3px, transparent 3px 6px)`,
                  opacity: 0.4,
                  marginBottom: 18,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}


export default function ProjectPage({ meta }: { meta: ProjectMeta }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -22]);

  return (
    <main
      className="relative min-h-screen"
      style={{
        backgroundColor: IVORY,
        color: INK,
        fontFamily: "'Noto Serif KR', 'Cormorant Garamond', ui-serif, Georgia, serif",
      }}
    >
      <div
        className="fixed top-6 left-6 md:top-8 md:left-10 text-[11px] tracking-[0.28em] uppercase z-30"
        style={{ fontFamily: "ui-monospace, monospace", color: MUTED }}
      >
        Archive of Small Questions · 2026
      </div>
      <Link
        to="/"
        className="fixed top-6 right-6 md:top-8 md:right-10 text-[11px] tracking-[0.28em] uppercase z-30 transition-colors"
        style={{ fontFamily: "ui-monospace, monospace", color: MUTED }}
      >
        ← back to archive
      </Link>

      <section className="px-6 md:px-16 pt-32 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <MonoLabel color={MUTED}>Archive of Small Questions</MonoLabel>
          <p className="mt-4 text-sm" style={{ color: MUTED, fontStyle: "italic" }}>
            작은 질문에서 시작된 아카이브
          </p>
          <p className="mt-1 text-xs" style={{ color: MUTED }}>
            사람들이 지나치는 작은 불편함과 감정을 발견합니다.
          </p>
          <ThreadProgress code={meta.code} />
        </div>
      </section>


      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="px-6 md:px-16 pt-12 pb-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <MonoLabel>{meta.code}</MonoLabel>
          <motion.h1
            className="mt-6 leading-[1.05]"
            style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              y: heroY,
            }}
          >
            {meta.title}
          </motion.h1>
          <p
            className="mt-10 mx-auto"
            style={{
              fontSize: "clamp(20px, 2.2vw, 28px)",
              fontStyle: "italic",
              color: "#3a352e",
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            “{meta.question}”
          </p>

          <div
            className="mx-auto mt-12 h-px w-16"
            style={{
              background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)`,
            }}
          />

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
            <div>
              <MonoLabel color={MUTED}>Type</MonoLabel>
              <div className="mt-2 text-sm" style={{ color: INK }}>
                {meta.type}
              </div>
            </div>
            <div>
              <MonoLabel color={MUTED}>My Contribution</MonoLabel>
              <div className="mt-2 text-sm" style={{ color: INK }}>
                {meta.contribution.join(", ")}
              </div>
            </div>
            {meta.period ? (
              <div>
                <MonoLabel color={MUTED}>Period</MonoLabel>
                <div className="mt-2 text-sm" style={{ color: INK }}>
                  {meta.period}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </motion.section>

      {meta.overview ? (
        <section className="px-6 md:px-16 pb-16">
          <div className="max-w-3xl mx-auto">
            <MonoLabel>Project Overview</MonoLabel>
            <div className="mt-5 leading-[1.9]" style={{ fontSize: 17, color: "#3a352e" }}>
              {meta.overview}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-6 md:px-16 pb-32">
        <div className="max-w-6xl mx-auto">
          {meta.sections.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {i > 0 ? <Divider /> : <div className="my-16" />}

              <div className="max-w-3xl mx-auto">
                <MonoLabel>{s.label}</MonoLabel>
                {s.title ? (
                  <h2
                    className="mt-4"
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 30px)",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
                  </h2>
                ) : null}
                {s.body ? (
                  <div
                    className="mt-5 leading-[1.9]"
                    style={{ fontSize: 16, color: "#3a352e" }}
                  >
                    {s.body}
                  </div>
                ) : null}
                {s.bullets ? (
                  <ul className="mt-5 space-y-3" style={{ color: "#3a352e" }}>
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 leading-[1.8]" style={{ fontSize: 16 }}>
                        <span
                          className="mt-3 inline-block w-1.5 h-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: RED }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {s.images?.length ? (
                <div className="mt-12 space-y-10">
                  {s.images.map((image) => (
                    <figure key={image.src} className="mx-auto w-full max-w-5xl">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="block w-full h-auto"
                        style={{
                          borderRadius: 6,
                          boxShadow: "0 18px 48px rgba(28,26,23,0.08)",
                        }}
                      />
                    </figure>
                  ))}
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </section>

      <section
        className="px-6 md:px-16 py-24 border-t"
        style={{ borderColor: "rgba(28,26,23,0.08)" }}
      >
        <Link to={meta.next.to} className="block group max-w-3xl mx-auto text-center">
          <MonoLabel color={MUTED}>Next Thread</MonoLabel>
          <p
            className="mt-6 italic"
            style={{
              fontSize: "clamp(20px, 2vw, 26px)",
              color: "#3a352e",
              lineHeight: 1.5,
            }}
          >
            “{meta.next.question}”
          </p>
          <div
            className="mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.28em] uppercase transition-colors"
            style={{ fontFamily: "ui-monospace, monospace", color: INK }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: RED }}
            />
            {meta.next.title}
            <span style={{ color: RED }}>→</span>
          </div>
        </Link>
      </section>

      <footer
        className="px-6 md:px-16 py-12 text-center text-[11px] tracking-[0.28em] uppercase border-t"
        style={{
          fontFamily: "ui-monospace, monospace",
          color: MUTED,
          borderColor: "rgba(28,26,23,0.08)",
        }}
      >
        Hyeon Jeong Kim — Content Designer · 2026
      </footer>
    </main>
  );
}
