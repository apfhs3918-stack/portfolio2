import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion, useScroll, useTransform } from "framer-motion";
//#region src/components/ProjectPage.tsx
var IVORY = "#f3ede2";
var INK = "#1c1a17";
var RED = "#C95A5A";
var MUTED = "#8a8278";
var MonoLabel = ({ children, color = RED }) => /* @__PURE__ */ jsx("div", {
	className: "text-[10px] tracking-[0.32em] uppercase",
	style: {
		fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
		color
	},
	children
});
var Divider = () => /* @__PURE__ */ jsx("div", {
	className: "my-16 h-px w-full",
	style: {
		background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)`,
		opacity: .55
	}
});
var THREAD_ORDER = [
	{
		code: "THREAD 001",
		title: "CLOSY",
		to: "/closy"
	},
	{
		code: "THREAD 002",
		title: "POFIN",
		to: "/pofin"
	},
	{
		code: "THREAD 003",
		title: "HYUNDAI",
		to: "/hyundai"
	},
	{
		code: "THREAD 004",
		title: "GRADUATION",
		to: "/graduation"
	}
];
function ThreadProgress({ code }) {
	const currentIdx = THREAD_ORDER.findIndex((t) => t.code === code);
	return /* @__PURE__ */ jsx("div", {
		className: "mt-10 flex items-center justify-center gap-3",
		children: THREAD_ORDER.map((t, i) => {
			const isCurrent = i === currentIdx;
			const isPast = i < currentIdx;
			return /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: t.to,
					className: "flex flex-col items-center gap-1.5 group",
					"aria-current": isCurrent ? "page" : void 0,
					children: [/* @__PURE__ */ jsx("span", {
						className: "block rounded-full transition-all",
						style: {
							width: isCurrent ? 10 : 6,
							height: isCurrent ? 10 : 6,
							backgroundColor: isCurrent || isPast ? RED : "transparent",
							border: `1px solid ${RED}`,
							opacity: isCurrent ? 1 : isPast ? .7 : .4
						}
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[9px] tracking-[0.24em] uppercase",
						style: {
							fontFamily: "ui-monospace, monospace",
							color: isCurrent ? INK : MUTED,
							opacity: isCurrent ? 1 : .65
						},
						children: t.title
					})]
				}), i < THREAD_ORDER.length - 1 ? /* @__PURE__ */ jsx("span", {
					className: "block h-px w-8",
					style: {
						background: `repeating-linear-gradient(to right, ${RED} 0 3px, transparent 3px 6px)`,
						opacity: .4,
						marginBottom: 18
					}
				}) : null]
			}, t.code);
		})
	});
}
function ProjectPage({ meta }) {
	const { scrollY } = useScroll();
	const heroY = useTransform(scrollY, [0, 400], [0, -22]);
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen",
		style: {
			backgroundColor: IVORY,
			color: INK,
			fontFamily: "'Noto Serif KR', 'Cormorant Garamond', ui-serif, Georgia, serif"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "fixed top-6 left-6 md:top-8 md:left-10 text-[11px] tracking-[0.28em] uppercase z-30",
				style: {
					fontFamily: "ui-monospace, monospace",
					color: MUTED
				},
				children: "Archive of Small Questions · 2026"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "fixed top-6 right-6 md:top-8 md:right-10 text-[11px] tracking-[0.28em] uppercase z-30 transition-colors",
				style: {
					fontFamily: "ui-monospace, monospace",
					color: MUTED
				},
				children: "← back to archive"
			}),
			/* @__PURE__ */ jsx("section", {
				className: "px-6 md:px-16 pt-32 pb-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ jsx(MonoLabel, {
							color: MUTED,
							children: "Archive of Small Questions"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-sm",
							style: {
								color: MUTED,
								fontStyle: "italic"
							},
							children: "작은 질문에서 시작된 아카이브"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs",
							style: { color: MUTED },
							children: "사람들이 지나치는 작은 불편함과 감정을 발견합니다."
						}),
						/* @__PURE__ */ jsx(ThreadProgress, { code: meta.code })
					]
				})
			}),
			/* @__PURE__ */ jsx(motion.section, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
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
				className: "px-6 md:px-16 pt-12 pb-24",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto text-center",
					children: [
						/* @__PURE__ */ jsx(MonoLabel, { children: meta.code }),
						/* @__PURE__ */ jsx(motion.h1, {
							className: "mt-6 leading-[1.05]",
							style: {
								fontSize: "clamp(48px, 7vw, 88px)",
								fontWeight: 500,
								letterSpacing: "-0.02em",
								y: heroY
							},
							children: meta.title
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-10 mx-auto",
							style: {
								fontSize: "clamp(20px, 2.2vw, 28px)",
								fontStyle: "italic",
								color: "#3a352e",
								lineHeight: 1.5,
								maxWidth: 700
							},
							children: [
								"“",
								meta.question,
								"”"
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto mt-12 h-px w-16",
							style: { background: `repeating-linear-gradient(to right, ${RED} 0 4px, transparent 4px 8px)` }
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-left",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(MonoLabel, {
									color: MUTED,
									children: "Type"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm",
									style: { color: INK },
									children: meta.type
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(MonoLabel, {
									color: MUTED,
									children: "My Contribution"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm",
									style: { color: INK },
									children: meta.contribution.join(", ")
								})] }),
								meta.period ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(MonoLabel, {
									color: MUTED,
									children: "Period"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm",
									style: { color: INK },
									children: meta.period
								})] }) : null
							]
						})
					]
				})
			}),
			meta.overview ? /* @__PURE__ */ jsx("section", {
				className: "px-6 md:px-16 pb-16",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ jsx(MonoLabel, { children: "Project Overview" }), /* @__PURE__ */ jsx("div", {
						className: "mt-5 leading-[1.9]",
						style: {
							fontSize: 17,
							color: "#3a352e"
						},
						children: meta.overview
					})]
				})
			}) : null,
			/* @__PURE__ */ jsx("section", {
				className: "px-6 md:px-16 pb-32",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-6xl mx-auto",
					children: meta.sections.map((s, i) => /* @__PURE__ */ jsxs(motion.article, {
						initial: {
							opacity: 0,
							y: 18
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							margin: "-60px"
						},
						transition: {
							duration: .7,
							ease: [
								.2,
								.8,
								.2,
								1
							]
						},
						children: [
							i > 0 ? /* @__PURE__ */ jsx(Divider, {}) : /* @__PURE__ */ jsx("div", { className: "my-16" }),
							/* @__PURE__ */ jsxs("div", {
								className: "max-w-3xl mx-auto",
								children: [
									/* @__PURE__ */ jsx(MonoLabel, { children: s.label }),
									s.title ? /* @__PURE__ */ jsx("h2", {
										className: "mt-4",
										style: {
											fontSize: "clamp(22px, 2.4vw, 30px)",
											fontWeight: 500,
											letterSpacing: "-0.01em"
										},
										children: s.title
									}) : null,
									s.body ? /* @__PURE__ */ jsx("div", {
										className: "mt-5 leading-[1.9]",
										style: {
											fontSize: 16,
											color: "#3a352e"
										},
										children: s.body
									}) : null,
									s.bullets ? /* @__PURE__ */ jsx("ul", {
										className: "mt-5 space-y-3",
										style: { color: "#3a352e" },
										children: s.bullets.map((b, j) => /* @__PURE__ */ jsxs("li", {
											className: "flex gap-3 leading-[1.8]",
											style: { fontSize: 16 },
											children: [/* @__PURE__ */ jsx("span", {
												className: "mt-3 inline-block w-1.5 h-1.5 flex-shrink-0 rounded-full",
												style: { backgroundColor: RED }
											}), /* @__PURE__ */ jsx("span", { children: b })]
										}, j))
									}) : null
								]
							}),
							s.images?.length ? /* @__PURE__ */ jsx("div", {
								className: "mt-12 space-y-10",
								children: s.images.map((image) => /* @__PURE__ */ jsx("figure", {
									className: "mx-auto w-full max-w-5xl",
									children: /* @__PURE__ */ jsx("img", {
										src: image.src,
										alt: image.alt,
										loading: "lazy",
										className: "block w-full h-auto",
										style: {
											borderRadius: 6,
											boxShadow: "0 18px 48px rgba(28,26,23,0.08)"
										}
									})
								}, image.src))
							}) : null
						]
					}, s.id))
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "px-6 md:px-16 py-24 border-t",
				style: { borderColor: "rgba(28,26,23,0.08)" },
				children: /* @__PURE__ */ jsxs(Link, {
					to: meta.next.to,
					className: "block group max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ jsx(MonoLabel, {
							color: MUTED,
							children: "Next Thread"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-6 italic",
							style: {
								fontSize: "clamp(20px, 2vw, 26px)",
								color: "#3a352e",
								lineHeight: 1.5
							},
							children: [
								"“",
								meta.next.question,
								"”"
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 inline-flex items-center gap-3 text-[12px] tracking-[0.28em] uppercase transition-colors",
							style: {
								fontFamily: "ui-monospace, monospace",
								color: INK
							},
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "inline-block w-1.5 h-1.5 rounded-full",
									style: { backgroundColor: RED }
								}),
								meta.next.title,
								/* @__PURE__ */ jsx("span", {
									style: { color: RED },
									children: "→"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "px-6 md:px-16 py-12 text-center text-[11px] tracking-[0.28em] uppercase border-t",
				style: {
					fontFamily: "ui-monospace, monospace",
					color: MUTED,
					borderColor: "rgba(28,26,23,0.08)"
				},
				children: "Hyeon Jeong Kim — Content Designer · 2026"
			})
		]
	});
}
//#endregion
export { ProjectPage as t };
