import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useLocation, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
//#region src/styles.css?url
var styles_default = "/assets/styles-C8DNAPg4.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Kim Hyunjeong Portfolio" },
			{
				name: "description",
				content: "작은 불편함과 감정을 발견하고 경험으로 풀어내는 디자이너 김현정의 포트폴리오"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Kim Hyunjeong Portfolio"
			},
			{
				property: "og:description",
				content: "작은 불편함과 감정을 발견하고 경험으로 풀어내는 디자이너 김현정의 포트폴리오"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Kim Hyunjeong Portfolio"
			},
			{
				name: "twitter:description",
				content: "작은 불편함과 감정을 발견하고 경험으로 풀어내는 디자이너 김현정의 포트폴리오"
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/98db3292-3c92-4566-ab92-f35209ca1fc9/id-preview-2b9ade8a--1ed23826-5beb-40a5-b56b-a2f7a7280dc6.lovable.app-1782204123759.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/98db3292-3c92-4566-ab92-f35209ca1fc9/id-preview-2b9ade8a--1ed23826-5beb-40a5-b56b-a2f7a7280dc6.lovable.app-1782204123759.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Noto+Serif+KR:wght@400;500&family=Patrick+Hand&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	const { pathname } = useLocation();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(AnimatePresence, {
			mode: "wait",
			initial: false,
			children: /* @__PURE__ */ jsx(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: {
					duration: .4,
					ease: "easeInOut"
				},
				children: /* @__PURE__ */ jsx(Outlet, {})
			}, pathname)
		})
	});
}
//#endregion
//#region src/routes/pofin.tsx
var $$splitComponentImporter$4 = () => import("./pofin-b04jarEi.js");
var Route$4 = createFileRoute("/pofin")({
	head: () => ({ meta: [{ title: "POFIN — Thread 002 · Archive of Small Questions" }, {
		name: "description",
		content: "왜 좋아하는 작품인데 이야기할 사람이 없을까? 진도 기반 커뮤니티 POFIN 케이스 스터디."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/hyundai.tsx
var $$splitComponentImporter$3 = () => import("./hyundai-DwARyk4u.js");
var Route$3 = createFileRoute("/hyundai")({
	head: () => ({ meta: [{ title: "Hyundai Card — Thread 004 · Archive of Small Questions" }, {
		name: "description",
		content: "취향은 어떻게 공간 경험이 될까? Hyundai Card 브랜드 공간 케이스 스터디."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/graduation.tsx
var $$splitComponentImporter$2 = () => import("./graduation-BcI3nGh7.js");
var Route$2 = createFileRoute("/graduation")({
	head: () => ({ meta: [{ title: "Graduation Project — Thread 003 · Archive of Small Questions" }, {
		name: "description",
		content: "왜 우리는 애써 둥글게 살아야 할까? 시선과 자아에 대한 시각적 에세이."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/closy.tsx
var $$splitComponentImporter$1 = () => import("./closy-dNeHGrdw.js");
var Route$1 = createFileRoute("/closy")({
	head: () => ({ meta: [{ title: "Closy — Thread 001 · Archive of Small Questions" }, {
		name: "description",
		content: "왜 옷은 많은데 입을 옷이 없을까? 선택 피로를 줄이는 AI 기반 코디네이터 서비스 Closy 케이스 스터디."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-BsuU-NkD.js");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Archive of Small Questions — 김현정" },
		{
			name: "description",
			content: "사람들이 지나치는 작은 불편함과 감정을 발견합니다. 작은 질문에서 시작된 디자인 아카이브."
		},
		{
			property: "og:title",
			content: "Archive of Small Questions — 김현정"
		},
		{
			property: "og:description",
			content: "작은 질문에서 시작된 아카이브 — 김현정의 디자인 포트폴리오."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var PofinRoute = Route$4.update({
	id: "/pofin",
	path: "/pofin",
	getParentRoute: () => Route$5
});
var HyundaiRoute = Route$3.update({
	id: "/hyundai",
	path: "/hyundai",
	getParentRoute: () => Route$5
});
var GraduationRoute = Route$2.update({
	id: "/graduation",
	path: "/graduation",
	getParentRoute: () => Route$5
});
var ClosyRoute = Route$1.update({
	id: "/closy",
	path: "/closy",
	getParentRoute: () => Route$5
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	ClosyRoute,
	GraduationRoute,
	HyundaiRoute,
	PofinRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
