import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var IVORY = "#f3ede2";
var INK = "#1c1a17";
var RED = "#C95A5A";
var MUTED = "#8a8278";
var threads = [
	{
		id: "closy",
		code: "THREAD 001",
		title: "Closy",
		hint: "옷은 많은데 입을 옷이 없다",
		summary: "옷장 등록의 번거로움과 코디 결정 피로를 발견",
		to: "/closy",
		angle: 180
	},
	{
		id: "pofin",
		code: "THREAD 002",
		title: "POFIN",
		hint: "좋아하는 작품인데 이야기할 사람이 없다",
		summary: "스포일러보다 더 큰 진도 차이 문제를 발견",
		to: "/pofin",
		angle: 270
	},
	{
		id: "hyundai",
		code: "THREAD 003",
		title: "Hyundai Card",
		hint: "취향은 어떻게 공간 경험이 될까",
		summary: "브랜드 취향이 공간으로 번역되는 순간을 관찰",
		to: "/hyundai",
		angle: 0
	},
	{
		id: "graduation",
		code: "THREAD 004",
		title: "Graduation Project",
		hint: "애써 둥글게 살아야 할까",
		summary: "남의 시선 속에서 자신을 잃는 감정을 발견",
		to: "/graduation",
		angle: 90
	}
];
var whispers = [
	{
		id: "w1",
		text: "지나친 친절은 가끔 자신을 지운다",
		top: "29%",
		left: "22%",
		rotate: -3
	},
	{
		id: "w2",
		text: "사소한 불편함은 왜 반복될까",
		top: "16%",
		left: "78%",
		rotate: 2
	},
	{
		id: "w3",
		text: "왜 추천은 항상 비슷할까",
		top: "84%",
		left: "20%",
		rotate: 1
	},
	{
		id: "w4",
		text: "익숙한 불편함은 쉽게 지나친다",
		top: "88%",
		left: "74%",
		rotate: -2
	},
	{
		id: "w5",
		text: "좋아하는 순간은 왜 금방 사라질까",
		top: "48%",
		left: "7%",
		rotate: -4
	},
	{
		id: "w6",
		text: "말하지 않은 감정은 어디로 가는가",
		top: "52%",
		left: "92%",
		rotate: 3
	}
];
function Index() {
	const navigate = useNavigate();
	const [discovery, setDiscovery] = useState(false);
	const [entering, setEntering] = useState(false);
	const [vp, setVp] = useState({
		w: 1280,
		h: 800
	});
	const [active, setActive] = useState(null);
	const [leaving, setLeaving] = useState(null);
	const [litId, setLitId] = useState(null);
	const [hoverId, setHoverId] = useState(null);
	const [whoOpen, setWhoOpen] = useState(false);
	const [whoIdx, setWhoIdx] = useState(0);
	const [whoHover, setWhoHover] = useState(false);
	const [connecting, setConnecting] = useState(false);
	const [selectedSkill, setSelectedSkill] = useState(null);
	const spotlightRef = useRef(null);
	const whisperLayerRef = useRef(null);
	const cursorRef = useRef(null);
	useEffect(() => {
		const onResize = () => setVp({
			w: window.innerWidth,
			h: window.innerHeight
		});
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	useEffect(() => {
		return () => {
			document.body.style.cursor = "";
			document.documentElement.style.cursor = "";
		};
	}, []);
	useEffect(() => {
		if (!whoOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape") setWhoOpen(false);
			else if (e.key === "ArrowRight") setWhoIdx((i) => Math.min(3, i + 1));
			else if (e.key === "ArrowLeft") setWhoIdx((i) => Math.max(0, i - 1));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [whoOpen]);
	const cx = vp.w / 2;
	const cy = Math.max(vp.h * .58, 470);
	const Rraw = Math.min(vp.w, vp.h) * .22;
	const Rcap = Math.max(170, cy - 260);
	const R = Math.max(190, Math.min(280, Math.min(Rraw, Rcap)));
	const SPOT = 230;
	const threadPositions = threads.map((t) => {
		const rad = t.angle * Math.PI / 180;
		const r = R;
		return {
			...t,
			x: cx + Math.cos(rad) * r,
			y: cy + Math.sin(rad) * r
		};
	});
	const paths = threadPositions.map((t) => {
		const mx = (cx + t.x) / 2;
		const my = (cy + t.y) / 2;
		const nx = -(t.y - cy);
		const ny = t.x - cx;
		const nlen = Math.hypot(nx, ny) || 1;
		const off = 18;
		const cxp = mx + nx / nlen * off;
		const cyp = my + ny / nlen * off;
		return {
			id: t.id,
			d: `M ${cx} ${cy} Q ${cxp} ${cyp} ${t.x} ${t.y}`,
			x: t.x,
			y: t.y
		};
	});
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
			if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${px - 7}px, ${py - 7}px, 0)`;
			let nextLit = null;
			for (const p of paths) if (Math.hypot(px - p.x, py - p.y) < SPOT * .95) {
				nextLit = p.id;
				break;
			}
			setLitId((prev) => prev === nextLit ? prev : nextLit);
		};
		const onMove = (x, y) => {
			px = x;
			py = y;
			if (!raf) raf = requestAnimationFrame(apply);
		};
		const m = (e) => onMove(e.clientX, e.clientY);
		const t = (e) => {
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
	}, [
		discovery,
		vp.w,
		vp.h
	]);
	const exitDiscovery = useCallback(() => {
		setDiscovery(false);
		setActive(null);
		setLitId(null);
		setLeaving(null);
	}, []);
	const handleEnter = useCallback((t) => {
		if (!t.to) return;
		setActive(null);
		setLeaving(t);
		setTimeout(() => {
			navigate({ to: t.to }).catch(() => {});
		}, 620);
	}, [navigate]);
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen overflow-x-hidden",
		style: {
			backgroundColor: IVORY,
			color: INK,
			fontFamily: "'Noto Serif KR', 'Cormorant Garamond', ui-serif, Georgia, serif"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "fixed top-6 left-6 md:top-8 md:left-10 text-[11px] tracking-[0.28em] uppercase z-[60]",
				style: {
					fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
					color: MUTED
				},
				children: "Archive of Small Questions · 2026"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "fixed top-6 right-6 md:top-8 md:right-10 text-[11px] tracking-[0.28em] uppercase z-[60]",
				style: {
					fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
					color: MUTED
				},
				children: discovery ? /* @__PURE__ */ jsx("button", {
					onClick: exitDiscovery,
					className: "transition-colors",
					style: { color: RED },
					children: "✕ exit discovery"
				}) : /* @__PURE__ */ jsx("span", { children: "Hyeon Jeong Kim — Content Designer" })
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: !discovery && /* @__PURE__ */ jsxs(motion.section, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: -8
				},
				transition: {
					duration: .4,
					ease: [
						.2,
						.8,
						.2,
						1
					]
				},
				className: "relative z-20 min-h-screen flex flex-col items-center justify-center px-6 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-8 h-px w-12",
						style: { background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)` }
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-[11px] tracking-[0.32em] uppercase mb-6",
						style: {
							fontFamily: "ui-monospace, monospace",
							color: MUTED
						},
						children: "ARCHIVE OF SMALL QUESTIONS"
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "leading-[1.3] tracking-tight max-w-3xl",
						style: {
							fontSize: "clamp(28px, 3.8vw, 46px)",
							fontWeight: 500,
							letterSpacing: "-0.01em"
						},
						children: [
							"작은 질문에서 시작된",
							" ",
							/* @__PURE__ */ jsx("span", {
								style: {
									fontStyle: "italic",
									color: RED
								},
								children: "아카이브"
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-7 text-sm md:text-base max-w-lg",
						style: { color: MUTED },
						children: "사람들이 지나치는 작은 불편함과 감정을 발견합니다."
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setEntering(true);
							window.setTimeout(() => {
								setEntering(false);
								setDiscovery(true);
							}, 8e3);
						},
						className: "group mt-12 inline-flex items-center gap-3 px-7 py-4 border transition-colors",
						style: {
							borderColor: INK,
							color: INK,
							fontFamily: "ui-monospace, monospace",
							fontSize: 13,
							letterSpacing: "0.12em",
							borderRadius: 2
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.backgroundColor = INK;
							e.currentTarget.style.color = IVORY;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.backgroundColor = "transparent";
							e.currentTarget.style.color = INK;
						},
						children: [/* @__PURE__ */ jsx("span", {
							className: "inline-block w-1.5 h-1.5 rounded-full",
							style: { backgroundColor: RED }
						}), "질문을 발견하시겠습니까?"]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-xs",
						style: {
							color: MUTED,
							fontFamily: "ui-monospace, monospace"
						},
						children: "버튼을 누르면 화면 곳곳에 숨겨진 질문이 드러납니다."
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#about",
						className: "absolute bottom-8 text-[10px] tracking-[0.28em] uppercase",
						style: {
							fontFamily: "ui-monospace, monospace",
							color: MUTED
						},
						children: "↓ who collected these questions"
					})
				]
			}, "hero") }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: entering && /* @__PURE__ */ jsxs(motion.div, {
				className: "fixed inset-0 z-50",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: {
					duration: 1,
					ease: "easeInOut"
				},
				style: { backgroundColor: INK },
				children: [/* @__PURE__ */ jsxs("svg", {
					className: "absolute inset-0 w-full h-full pointer-events-none",
					style: { zIndex: 5 },
					children: [
						/* @__PURE__ */ jsx(motion.path, {
							d: `M ${cx} 0 L ${cx} ${cy}`,
							stroke: RED,
							strokeWidth: 1.5,
							strokeLinecap: "round",
							fill: "none",
							initial: {
								pathLength: 0,
								opacity: 0
							},
							animate: {
								pathLength: 1,
								opacity: .9
							},
							transition: {
								duration: 1.8,
								delay: .3,
								ease: [
									.4,
									0,
									.2,
									1
								]
							}
						}),
						/* @__PURE__ */ jsx(motion.circle, {
							cx,
							cy,
							r: 5,
							fill: RED,
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: {
								duration: .4,
								delay: 1.9,
								ease: "easeOut"
							}
						}),
						/* @__PURE__ */ jsx(motion.circle, {
							cx,
							cy,
							r: 22,
							fill: RED,
							style: { filter: "blur(14px)" },
							initial: { opacity: 0 },
							animate: { opacity: .35 },
							transition: {
								duration: .8,
								delay: 1.9,
								ease: "easeOut"
							}
						}),
						paths.map((p, i) => /* @__PURE__ */ jsx(motion.path, {
							d: p.d,
							stroke: RED,
							strokeWidth: 1,
							strokeDasharray: "3 6",
							fill: "none",
							initial: {
								pathLength: 0,
								opacity: 0
							},
							animate: {
								pathLength: 1,
								opacity: .7
							},
							transition: {
								duration: 1.4,
								delay: 2.1 + i * .22,
								ease: "easeOut"
							}
						}, `intro-branch-${p.id}`))
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center gap-5",
					style: { zIndex: 10 },
					children: [/* @__PURE__ */ jsx(motion.p, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: 1.4,
							delay: 2.8,
							ease: "easeOut"
						},
						style: {
							fontFamily: "'Noto Serif KR', 'Noto Serif', serif",
							color: IVORY,
							fontSize: 18,
							letterSpacing: "0.18em",
							textAlign: "center"
						},
						children: "질문을 발견하는 중"
					}), /* @__PURE__ */ jsx(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: .45 },
						transition: {
							duration: 1.4,
							delay: 4.8,
							ease: "easeIn"
						},
						style: {
							fontFamily: "ui-monospace, monospace",
							color: MUTED,
							fontSize: 11,
							letterSpacing: "0.22em",
							textAlign: "center",
							textTransform: "uppercase"
						},
						children: "Archive of Small Questions"
					})]
				})]
			}, "entering") }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: discovery && /* @__PURE__ */ jsxs(motion.section, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .3 },
				className: "fixed inset-0 z-40",
				style: { cursor: "none" },
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 pointer-events-none",
						style: { backgroundColor: "rgba(20,18,15,0.84)" }
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute left-0 right-0 text-center pointer-events-none",
						style: {
							top: 140,
							zIndex: 25,
							fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
							color: "rgba(243,237,226,0.55)",
							fontSize: 12,
							letterSpacing: "0.28em",
							textTransform: "uppercase"
						},
						children: "Every project began with a question."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "absolute left-0 right-0 text-center pointer-events-none",
						style: {
							top: 176,
							zIndex: 25,
							fontFamily: "'Noto Serif KR', 'Cormorant Garamond', ui-serif, Georgia, serif",
							color: "rgba(255,252,245,0.92)",
							fontSize: 16,
							fontWeight: 500,
							letterSpacing: "0.04em"
						},
						children: "불편함을 발견하고 더 나은 경험을 고민하는 디자이너 김현정 입니다."
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => {
							if (connecting || whoOpen) return;
							setConnecting(true);
							window.setTimeout(() => {
								setWhoIdx(0);
								setSelectedSkill(null);
								setWhoOpen(true);
								setConnecting(false);
							}, 720);
						},
						onMouseEnter: (e) => {
							setWhoHover(true);
							e.currentTarget.style.transform = "rotate(-3deg) translateY(-4px) scale(1.04)";
						},
						onMouseLeave: (e) => {
							setWhoHover(false);
							e.currentTarget.style.transform = "rotate(-7deg) translateY(0) scale(1)";
						},
						className: "absolute z-[55] group",
						style: {
							top: 200,
							left: 28,
							transform: "rotate(-7deg)",
							transformOrigin: "top left",
							transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)",
							cursor: "pointer"
						},
						"aria-label": "WHO collected these questions?",
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								width: 96,
								height: 118,
								backgroundColor: "#fbf6ec",
								padding: "10px 10px 22px 10px",
								boxShadow: whoHover ? "0 18px 32px -10px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.08)" : "0 12px 24px -10px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.08)",
								border: "1px solid rgba(0,0,0,0.06)",
								position: "relative",
								transition: "box-shadow 0.35s ease-out"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									width: "100%",
									height: 72,
									backgroundColor: "#efe7d8",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.015) 0 2px, transparent 2px 4px)"
								},
								children: /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "'Caveat', 'Patrick Hand', 'Comic Sans MS', cursive",
										fontSize: 26,
										color: whoHover || connecting ? RED : INK,
										transform: "rotate(-4deg)",
										letterSpacing: "0.02em",
										transition: "color 0.3s ease-out"
									},
									children: "WHO?"
								})
							}), /* @__PURE__ */ jsx("div", {
								style: {
									position: "absolute",
									left: 0,
									right: 0,
									bottom: 4,
									textAlign: "center",
									fontFamily: "'Caveat', 'Patrick Hand', cursive",
									fontSize: 11,
									color: MUTED
								},
								children: "who recorded these?"
							})]
						})
					}),
					(whoHover || connecting) && /* @__PURE__ */ jsx("svg", {
						className: "absolute inset-0 w-full h-full pointer-events-none",
						style: { zIndex: 14 },
						children: /* @__PURE__ */ jsx(motion.line, {
							x1: cx,
							y1: cy,
							x2: 76,
							y2: 259,
							stroke: RED,
							strokeWidth: connecting ? 1.4 : 1,
							strokeLinecap: "round",
							initial: {
								pathLength: connecting ? 0 : 1,
								opacity: 0
							},
							animate: {
								pathLength: 1,
								opacity: connecting ? .85 : .18
							},
							transition: {
								duration: connecting ? .7 : .25,
								ease: "easeOut"
							}
						}, connecting ? "who-connect" : "who-hover")
					}),
					/* @__PURE__ */ jsxs("svg", {
						className: "absolute inset-0 w-full h-full pointer-events-none",
						style: { zIndex: 11 },
						children: [
							/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("filter", {
								id: "threadGlow",
								x: "-20%",
								y: "-20%",
								width: "140%",
								height: "140%",
								children: [/* @__PURE__ */ jsx("feGaussianBlur", {
									stdDeviation: "3",
									result: "blur"
								}), /* @__PURE__ */ jsxs("feMerge", { children: [/* @__PURE__ */ jsx("feMergeNode", { in: "blur" }), /* @__PURE__ */ jsx("feMergeNode", { in: "SourceGraphic" })] })]
							}) }),
							paths.map((p) => {
								const isHover = hoverId === p.id;
								const isLeaving = leaving?.id === p.id;
								const lit = litId === p.id || isHover;
								return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx("path", {
									d: p.d,
									stroke: RED,
									strokeWidth: isHover ? 1.6 : 1,
									strokeDasharray: isHover ? "0" : "3 6",
									fill: "none",
									opacity: isLeaving ? 0 : lit ? .95 : .52,
									filter: isHover ? "url(#threadGlow)" : void 0,
									style: { transition: "opacity 0.25s ease-out, stroke-width 0.25s ease-out" }
								}) }, `line-${p.id}`);
							}),
							/* @__PURE__ */ jsx(motion.circle, {
								cx,
								cy,
								r: 28,
								fill: RED,
								style: { filter: "blur(16px)" },
								animate: hoverId || litId ? { opacity: [
									.55,
									.85,
									.55
								] } : { opacity: [
									.14,
									.28,
									.14
								] },
								transition: {
									duration: hoverId || litId ? 1.2 : 3.2,
									repeat: Infinity,
									ease: "easeInOut"
								}
							}),
							/* @__PURE__ */ jsx(motion.circle, {
								cx,
								cy,
								r: hoverId || litId ? 14 : 11,
								fill: "none",
								stroke: RED,
								strokeWidth: hoverId || litId ? 1.4 : .8,
								animate: hoverId || litId ? {
									r: [
										14,
										26,
										14
									],
									strokeOpacity: [
										.9,
										.12,
										.9
									]
								} : {
									r: [
										11,
										18,
										11
									],
									strokeOpacity: [
										.5,
										.05,
										.5
									]
								},
								transition: {
									duration: hoverId || litId ? 1.2 : 2.6,
									repeat: Infinity,
									ease: "easeOut"
								}
							}),
							/* @__PURE__ */ jsx("circle", {
								cx,
								cy,
								r: 6,
								fill: RED,
								style: {
									filter: hoverId || litId ? "drop-shadow(0 0 6px rgba(201,90,90,1)) drop-shadow(0 0 12px rgba(201,90,90,0.6))" : void 0,
									transition: "filter 0.3s ease-out"
								}
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute pointer-events-none text-center",
						style: {
							left: cx,
							top: cy + 24,
							transform: "translate(-50%, 0)",
							zIndex: 18,
							fontFamily: "ui-monospace, monospace",
							fontSize: 10,
							letterSpacing: "0.28em",
							textTransform: "uppercase",
							color: "rgba(243,237,226,0.55)"
						},
						children: "the knot · 모든 질문이 모이는 곳"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 pointer-events-none",
						style: { zIndex: 12 },
						children: whispers.map((w) => /* @__PURE__ */ jsxs("div", {
							className: "absolute text-center italic",
							style: {
								top: w.top,
								left: w.left,
								transform: `translate(-50%,-50%) rotate(${w.rotate}deg)`,
								color: "rgba(243,237,226,0.06)",
								fontSize: 15,
								maxWidth: 240
							},
							children: [
								"\"",
								w.text,
								"\""
							]
						}, w.id))
					}),
					/* @__PURE__ */ jsx("div", {
						ref: whisperLayerRef,
						className: "absolute inset-0 pointer-events-none",
						style: {
							zIndex: 13,
							willChange: "mask-image"
						},
						children: whispers.map((w) => /* @__PURE__ */ jsxs("div", {
							className: "absolute text-center italic",
							style: {
								top: w.top,
								left: w.left,
								transform: `translate(-50%,-50%) rotate(${w.rotate}deg)`,
								color: "rgba(243,237,226,0.82)",
								fontSize: 15,
								maxWidth: 240
							},
							children: [
								"\"",
								w.text,
								"\""
							]
						}, `lit-${w.id}`))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0",
						style: { zIndex: 20 },
						children: threadPositions.map((t) => {
							const lit = litId === t.id || hoverId === t.id;
							t.id;
							const ty = t.angle === 270 ? "0%" : t.angle === 90 ? "-100%" : "-50%";
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setActive(t),
								onMouseEnter: () => setHoverId(t.id),
								onMouseLeave: () => setHoverId((h) => h === t.id ? null : h),
								onFocus: () => setHoverId(t.id),
								onBlur: () => setHoverId((h) => h === t.id ? null : h),
								className: "absolute text-center",
								style: {
									left: t.x,
									top: t.y,
									transform: `translate(-50%, ${ty}) scale(${lit ? 1.04 : 1})`,
									width: 220,
									cursor: "none",
									opacity: lit ? 1 : .72,
									transition: "opacity 0.25s ease-out, transform 0.25s ease-out"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] tracking-[0.32em] mb-2",
										style: {
											fontFamily: "ui-monospace, monospace",
											color: RED,
											textShadow: lit ? "0 0 8px rgba(201,90,90,0.9), 0 0 20px rgba(201,90,90,0.4)" : void 0,
											transition: "text-shadow 0.25s ease-out"
										},
										children: t.code
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											color: lit ? "#ffffff" : IVORY,
											fontSize: 15,
											lineHeight: 1.5,
											fontWeight: lit ? 500 : 400,
											letterSpacing: "-0.005em",
											textShadow: lit ? "0 0 12px rgba(255,252,245,0.8), 0 0 28px rgba(255,252,245,0.3)" : void 0,
											transition: "color 0.25s ease-out, text-shadow 0.25s ease-out"
										},
										children: [
											"\"",
											t.hint,
											"\""
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-3 text-[10px] tracking-[0.28em] uppercase",
										style: {
											fontFamily: "ui-monospace, monospace",
											color: lit ? "rgba(243,237,226,0.95)" : "rgba(243,237,226,0.65)",
											transition: "color 0.25s ease-out"
										},
										children: t.title
									})
								]
							}, t.id);
						})
					}),
					/* @__PURE__ */ jsx("div", {
						ref: spotlightRef,
						className: "absolute inset-0 pointer-events-none",
						style: { zIndex: 14 }
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: cursorRef,
						className: "pointer-events-none fixed top-0 left-0",
						style: {
							zIndex: 50,
							width: 14,
							height: 14,
							willChange: "transform"
						},
						children: [/* @__PURE__ */ jsx("div", { style: {
							width: 14,
							height: 14,
							borderRadius: 999,
							border: `1px solid ${RED}`
						} }), /* @__PURE__ */ jsx("div", { style: {
							position: "absolute",
							top: 5.5,
							left: 5.5,
							width: 3,
							height: 3,
							borderRadius: 999,
							backgroundColor: RED
						} })]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute bottom-6 left-0 right-0 text-center text-[11px] tracking-[0.25em] uppercase pointer-events-none",
						style: {
							fontFamily: "ui-monospace, monospace",
							color: "rgba(243,237,226,0.45)",
							zIndex: 30
						},
						children: "move to discover · click a thread to open"
					})
				]
			}, "discovery") }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: active && /* @__PURE__ */ jsx(motion.div, {
				className: "fixed inset-0 z-[55] flex items-center justify-center px-6",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				style: {
					backgroundColor: "rgba(20,18,15,0.6)",
					cursor: "default"
				},
				onClick: () => setActive(null),
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						y: 18,
						opacity: 0
					},
					animate: {
						y: 0,
						opacity: 1
					},
					exit: {
						y: 10,
						opacity: 0
					},
					transition: {
						duration: .28,
						ease: [
							.2,
							.8,
							.2,
							1
						]
					},
					onClick: (e) => e.stopPropagation(),
					className: "relative w-full max-w-xl p-10",
					style: {
						backgroundColor: IVORY,
						borderRadius: 4,
						boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
						cursor: "default"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-[10px] tracking-[0.3em] mb-6",
							style: {
								fontFamily: "ui-monospace, monospace",
								color: RED
							},
							children: active.code
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "leading-tight",
							style: {
								fontSize: 38,
								fontWeight: 500,
								letterSpacing: "-0.01em"
							},
							children: active.title
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-5 text-base",
							style: {
								color: "#3a352e",
								fontStyle: "italic"
							},
							children: [
								"\"",
								active.hint,
								"\""
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "my-7 h-px w-full",
							style: { background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)` }
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm leading-relaxed",
							style: { color: "#3a352e" },
							children: active.summary
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-10 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setActive(null),
								className: "text-xs tracking-[0.2em] uppercase",
								style: {
									fontFamily: "ui-monospace, monospace",
									color: MUTED
								},
								children: "← 다시 탐색"
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => handleEnter(active),
								className: "inline-flex items-center gap-2 px-5 py-3",
								style: {
									backgroundColor: INK,
									color: IVORY,
									fontFamily: "ui-monospace, monospace",
									fontSize: 12,
									letterSpacing: "0.18em",
									borderRadius: 2
								},
								children: ["OPEN THREAD", /* @__PURE__ */ jsx("span", {
									className: "inline-block w-1.5 h-1.5 rounded-full",
									style: { backgroundColor: RED }
								})]
							})]
						})
					]
				})
			}, "card-bg") }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: leaving && (() => {
				const leavingPath = paths.find((p) => p.id === leaving.id);
				return /* @__PURE__ */ jsxs(motion.div, {
					className: "fixed inset-0 z-[60] pointer-events-none",
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					exit: { opacity: 0 },
					transition: { duration: .12 },
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-full h-full",
						children: leavingPath ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.path, {
							d: leavingPath.d,
							stroke: RED,
							strokeWidth: 2,
							fill: "none",
							initial: {
								pathLength: 0,
								opacity: .9
							},
							animate: {
								pathLength: 1,
								opacity: 1
							},
							transition: {
								duration: .45,
								ease: [
									.6,
									0,
									.2,
									1
								]
							}
						}), /* @__PURE__ */ jsx(motion.circle, {
							r: 5,
							fill: RED,
							initial: {
								cx,
								cy,
								opacity: 0
							},
							animate: {
								cx: leavingPath.x,
								cy: leavingPath.y,
								opacity: 1
							},
							transition: {
								duration: .45,
								ease: [
									.6,
									0,
									.2,
									1
								]
							}
						})] }) : null
					}), /* @__PURE__ */ jsx(motion.div, {
						className: "absolute inset-0",
						style: { backgroundColor: IVORY },
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							delay: .46,
							duration: .18
						}
					})]
				}, "thread");
			})() }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: whoOpen && /* @__PURE__ */ jsx(motion.div, {
				className: "fixed inset-0 z-[80] flex items-center justify-center px-6",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .25 },
				style: { backgroundColor: "rgba(20,18,15,0.7)" },
				onClick: () => setWhoOpen(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					style: {
						width: 360,
						height: 460
					},
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: () => setWhoOpen(false),
							className: "absolute -top-10 right-0 text-[11px] tracking-[0.25em] uppercase",
							style: {
								fontFamily: "ui-monospace, monospace",
								color: "rgba(243,237,226,0.7)"
							},
							children: "✕ close"
						}),
						(() => {
							return [
								{
									kind: "profile",
									label: "01 / WHO",
									rotate: -3
								},
								{
									kind: "skills",
									label: "02 / SKILLS",
									rotate: 2
								},
								{
									kind: "contact",
									label: "03 / CONTACT",
									rotate: -2
								},
								{
									kind: "about",
									label: "04 / ABOUT",
									rotate: 3
								}
							].map((c, i) => {
								const offset = i - whoIdx;
								const visible = offset >= 0 && offset <= 2;
								return /* @__PURE__ */ jsxs(motion.div, {
									className: "absolute top-0 left-0",
									initial: false,
									animate: {
										x: offset < 0 ? -420 : offset * 14,
										y: offset * 10,
										rotate: offset === 0 ? c.rotate : offset * 2,
										scale: offset === 0 ? 1 : 1 - offset * .04,
										opacity: offset < 0 ? 0 : visible ? 1 : 0,
										zIndex: 10 - offset
									},
									transition: {
										duration: .5,
										ease: [
											.2,
											.8,
											.2,
											1
										]
									},
									style: {
										width: 360,
										height: 460,
										backgroundColor: "#fbf6ec",
										padding: "18px 18px 56px 18px",
										boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.12)",
										border: "1px solid rgba(0,0,0,0.06)",
										backgroundImage: "repeating-linear-gradient(135deg, rgba(0,0,0,0.012) 0 2px, transparent 2px 5px)"
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-[10px] tracking-[0.3em] uppercase mb-3",
											style: {
												fontFamily: "ui-monospace, monospace",
												color: RED
											},
											children: c.label
										}),
										c.kind === "profile" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													width: "100%",
													height: 230,
													overflow: "hidden"
												},
												children: /* @__PURE__ */ jsx("img", {
													src: "/assets/portrait-BFxdwMQE.jpeg",
													alt: "portrait",
													className: "w-full h-full object-cover"
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-4 flex items-baseline gap-2",
												style: {
													fontFamily: "'Caveat', 'Patrick Hand', cursive",
													color: INK,
													lineHeight: 1.1
												},
												children: [/* @__PURE__ */ jsx("span", {
													style: { fontSize: 30 },
													children: "김현정"
												}), /* @__PURE__ */ jsx("span", {
													style: {
														fontSize: 13,
														color: MUTED
													},
													children: "2000.02.07"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "mt-1 text-[12px]",
												style: { color: MUTED },
												children: "콘텐츠 디자이너"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-3 text-[13px] leading-relaxed",
												style: { color: "#3a352e" },
												children: "사람들이 지나치는 작은 불편함과 감정을 발견하고 그 질문을 경험으로 풀어냅니다."
											})
										] }),
										c.kind === "skills" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													fontFamily: "'Caveat', 'Patrick Hand', cursive",
													fontSize: 30,
													color: INK
												},
												children: "Skills"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "mt-5 flex flex-wrap gap-2",
												children: [
													["Photoshop", "이미지 보정, 합성 및 목업 제작에 활용"],
													["Illustrator", "브랜드 아이덴티티 구축, 아이콘 및 그래픽 제작에 활용"],
													["InDesign", "브랜드북, 포트폴리오 및 편집 레이아웃 디자인 작업에 활용"],
													["Figma", "서비스 구조 설계, UX/UI 디자인 및 프로토타이핑에 활용"],
													["ChatGPT", "리서치 정리, 아이디어 구체화 및 콘텐츠 작성 보조에 활용"],
													["Claude", "문서 구조화, 프로젝트 정리 및 콘텐츠 기획에 활용"],
													["Firefly", "컨셉 시각화, 무드 탐색 및 레퍼런스 제작에 활용"]
												].map(([s, desc]) => {
													const active = selectedSkill === s;
													return /* @__PURE__ */ jsx("button", {
														onClick: () => setSelectedSkill(active ? null : s),
														className: "px-3 py-1 text-[12px]",
														style: {
															border: `1px solid ${active ? RED : INK}`,
															borderRadius: 2,
															color: active ? "#fff" : INK,
															backgroundColor: active ? RED : "transparent",
															fontFamily: "ui-monospace, monospace",
															transition: "background-color 0.25s, color 0.25s, border-color 0.25s",
															cursor: "pointer"
														},
														"aria-pressed": active,
														"data-desc": desc,
														children: s
													}, s);
												})
											}),
											/* @__PURE__ */ jsx(AnimatePresence, {
												mode: "wait",
												children: selectedSkill ? /* @__PURE__ */ jsx(motion.p, {
													initial: {
														opacity: 0,
														y: 4
													},
													animate: {
														opacity: 1,
														y: 0
													},
													exit: { opacity: 0 },
													transition: {
														duration: .3,
														ease: "easeOut"
													},
													className: "mt-5 text-[12.5px] leading-relaxed",
													style: { color: "#3a352e" },
													children: {
														Photoshop: "이미지 보정, 합성 및 목업 제작에 활용",
														Illustrator: "브랜드 아이덴티티 구축, 아이콘 및 그래픽 제작에 활용",
														InDesign: "브랜드북, 포트폴리오 및 편집 레이아웃 디자인 작업에 활용",
														Figma: "서비스 구조 설계, UX/UI 디자인 및 프로토타이핑에 활용",
														ChatGPT: "리서치 정리, 아이디어 구체화 및 콘텐츠 작성 보조에 활용",
														Claude: "문서 구조화, 프로젝트 정리 및 콘텐츠 기획에 활용",
														Firefly: "컨셉 시각화, 무드 탐색 및 레퍼런스 제작에 활용"
													}[selectedSkill]
												}, selectedSkill) : /* @__PURE__ */ jsx(motion.p, {
													initial: { opacity: 0 },
													animate: { opacity: 1 },
													exit: { opacity: 0 },
													className: "mt-5 text-[12px] italic",
													style: { color: MUTED },
													children: "도구를 눌러보세요."
												}, "hint")
											})
										] }),
										c.kind === "contact" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													fontFamily: "'Caveat', 'Patrick Hand', cursive",
													fontSize: 30,
													color: INK
												},
												children: "Contact"
											}),
											/* @__PURE__ */ jsx("a", {
												href: "mailto:apfhs3918@naver.com",
												className: "mt-4 block text-[14px] underline",
												style: { color: INK },
												children: "apfhs3918@naver.com"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "mt-5 flex flex-col gap-2",
												children: [
													{
														label: "Instagram",
														href: "https://www.instagram.com/02.07_hj/"
													},
													{
														label: "Google Drive",
														href: "https://drive.google.com/file/d/1DNYx-N-k6pUP2tDIk6MtIbgYslaHFo6G/view?usp=sharing"
													},
													{
														label: "Resume",
														href: "#"
													}
												].map((l) => /* @__PURE__ */ jsxs("a", {
													href: l.href,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "text-[13px] tracking-[0.18em] uppercase",
													style: {
														fontFamily: "ui-monospace, monospace",
														color: INK
													},
													children: ["→ ", l.label]
												}, l.label))
											})
										] }),
										c.kind === "about" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													fontFamily: "'Caveat', 'Patrick Hand', cursive",
													fontSize: 30,
													color: INK
												},
												children: "About"
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "mt-4 text-[13px] leading-relaxed",
												style: { color: "#3a352e" },
												children: [
													"사람들의 행동을 관찰하며 문제를 발견하고 더 나은 경험을 고민합니다.",
													/* @__PURE__ */ jsx("br", {}),
													"복지관 디자인 수업부터 UX/UI 프로젝트까지 사용자의 입장에서 생각하며 디자인으로 문제를 해결하는 경험을 쌓아왔습니다."
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "mt-5 space-y-2 text-[12px]",
												style: {
													fontFamily: "ui-monospace, monospace",
													color: INK
												},
												children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													style: { color: RED },
													children: "2019.03 – 2025.08"
												}), /* @__PURE__ */ jsx("div", {
													style: { color: "#3a352e" },
													children: "상명대학교 시각디자인전공 졸업"
												})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													style: { color: RED },
													children: "2016.03 – 2019.02"
												}), /* @__PURE__ */ jsx("div", {
													style: { color: "#3a352e" },
													children: "예림디자인고등학교 웹디자인과 졸업"
												})] })]
											})
										] }),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute left-0 right-0 bottom-4 text-center text-[10px] tracking-[0.28em] uppercase",
											style: {
												fontFamily: "ui-monospace, monospace",
												color: MUTED
											},
											children: [String(i + 1).padStart(2, "0"), " / 04"]
										})
									]
								}, c.kind);
							});
						})(),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute -bottom-14 left-0 right-0 flex items-center justify-between",
							style: {
								fontFamily: "ui-monospace, monospace",
								color: "rgba(243,237,226,0.8)",
								fontSize: 11,
								letterSpacing: "0.22em"
							},
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setWhoIdx((i) => Math.max(0, i - 1)),
									disabled: whoIdx === 0,
									style: { opacity: whoIdx === 0 ? .3 : 1 },
									children: "← PREV"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex gap-2",
									children: [
										0,
										1,
										2,
										3
									].map((i) => /* @__PURE__ */ jsx("button", {
										onClick: () => setWhoIdx(i),
										style: {
											width: 6,
											height: 6,
											borderRadius: 999,
											backgroundColor: i === whoIdx ? RED : "rgba(243,237,226,0.35)"
										},
										"aria-label": `card ${i + 1}`
									}, i))
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setWhoIdx((i) => Math.min(3, i + 1)),
									disabled: whoIdx === 3,
									style: { opacity: whoIdx === 3 ? .3 : 1 },
									children: "NEXT →"
								})
							]
						})
					]
				})
			}, "who-bg") })
		]
	});
}
//#endregion
export { Index as component };
