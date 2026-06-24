import { createFileRoute } from "@tanstack/react-router";
import ProjectPage, { type ProjectMeta } from "@/components/ProjectPage";

const meta: ProjectMeta = {
  code: "Thread 002",
  title: "POFIN",
  question: "왜 좋아하는 작품인데 이야기할 사람이 없을까?",
  type: "Team Project · Service Design",
  contribution: ["Research", "Concept Development", "Service Planning", "Content Design"],
  period: "2024",
  overview:
    "POFIN은 ‘좋아하는 작품을 이야기하고 싶은데 상대의 진도를 몰라 망설이게 되는’ 순간에서 시작된 프로젝트입니다. 스포일러보다 더 큰 장벽인 ‘진도 차이’를 해결해, 작품 이야기를 마음 편히 나눌 수 있는 커뮤니티 서비스를 제안했습니다.",
  sections: [
    {
      id: "question",
      label: "Question",
      title: "왜 좋아하는 작품인데 이야기할 사람이 없을까?",
      body:
        "OTT와 웹툰이 일상이 되었지만, 좋아하는 작품을 진심으로 나눌 사람을 찾는 일은 오히려 어려워졌습니다. ‘어디까지 봤어?’라는 질문이 대화의 시작이자 끝이 되어버린 이유를 들여다봤습니다.",
    },
    {
      id: "problem",
      label: "Problem Discovery",
      title: "스포일러보다 더 큰 ‘진도 차이’",
      bullets: [
        "함께 보던 사람과의 진도가 달라지는 순간, 대화가 멈춘다.",
        "커뮤니티에 글을 올리고 싶어도 ‘스포 주의’가 부담스럽다.",
        "이야기를 나누고 싶은 감정은 작품을 본 직후 가장 강하지만 빠르게 사라진다.",
      ],
    },
    {
      id: "research",
      label: "Research",
      body:
        "OTT·웹툰·웹소설 사용자 15명을 인터뷰하고, 커뮤니티 글 200건의 ‘스포 주의’ 패턴을 분석했습니다.",
    },
    {
      id: "insight",
      label: "Insight",
      title: "사람들은 ‘스포 걱정 없는 같은 진도의 친구’를 원한다",
      body:
        "사용자는 더 많은 사람과 이야기하고 싶은 게 아니라, ‘나와 같은 회차를 본 사람’과 이야기하고 싶어합니다. 진도가 같다면 스포일러는 더 이상 문제가 아닙니다.",
    },
    {
      id: "solution",
      label: "Solution",
      title: "진도 기반의 작품 커뮤니티, POFIN",
      body:
        "사용자가 본 회차를 기록하면, 같은 회차까지 본 사람들과만 대화가 열리는 ‘진도 기반 채팅·게시판’을 설계했습니다.",
    },
    {
      id: "ia",
      label: "Information Architecture",
      bullets: [
        "작품 → 회차 → 같은 진도 라운지의 3단 구조로 단순화.",
        "마이페이지에서 ‘보고 있는 작품’과 ‘진도’를 한눈에 관리.",
        "스포일러 자동 블러 처리로 진도가 다른 글은 가린다.",
      ],
    },
    {
      id: "core",
      label: "Core Features",
      bullets: [
        "진도 라운지: 같은 회차를 본 사람들과만 열리는 채팅·게시판.",
        "감정 태그: ‘충격’, ‘여운’, ‘답답함’ 등 감정 단위로 회차 기록.",
        "스포 안전선: 내 진도 이후의 글은 자동으로 가려준다.",
      ],
    },
    {
      id: "ui",
      label: "UI Design",
      body:
        "작품의 분위기를 해치지 않도록 컬러를 절제하고, 진도와 감정 정보를 작품 카드 위에 자연스럽게 얹는 방식으로 디자인했습니다.",
    },
    {
      id: "outcome",
      label: "Outcome",
      bullets: [
        "프로토타입 사용자 12명 중 11명이 ‘스포 걱정 없이 이야기할 수 있어 좋다’고 응답.",
        "‘같은 회차 라운지’ 진입률 78%, 평균 체류 시간 9분.",
        "‘작품을 본 직후 이야기할 수 있는 곳이 생겼다’는 피드백.",
      ],
    },
    {
      id: "retro",
      label: "Retrospective",
      body:
        "POFIN은 ‘좋아하는 마음’을 어떻게 더 잘 흐르게 할 수 있을지에 대한 실험이었습니다. 막는 디자인(스포 주의)이 아니라, ‘같은 자리에 서 있는 사람’을 찾아주는 디자인이 더 따뜻한 경험을 만든다는 것을 배웠습니다.",
    },
  ],
  next: {
    to: "/graduation",
    title: "Graduation Project",
    question: "왜 우리는 애써 둥글게 살아야 할까?",
  },
};

export const Route = createFileRoute("/pofin")({
  head: () => ({
    meta: [
      { title: "POFIN — Thread 002 · Archive of Small Questions" },
      {
        name: "description",
        content:
          "왜 좋아하는 작품인데 이야기할 사람이 없을까? 진도 기반 커뮤니티 POFIN 케이스 스터디.",
      },
    ],
  }),
  component: () => <ProjectPage meta={meta} />,
});
