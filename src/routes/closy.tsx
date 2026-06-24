import { createFileRoute } from "@tanstack/react-router";
import ProjectPage, { type ProjectMeta } from "@/components/ProjectPage";

const coverImage = "/__l5e/assets-v1/ba3c5c06-961a-4c28-818f-21813579a91d/closy-cover.png";
const projectOverviewImage = "/__l5e/assets-v1/6b587f84-e74b-4037-a55e-075b01ade284/closy-project-overview.png";
const problemImage = "/__l5e/assets-v1/c962486d-bc50-4cd7-950b-2ea739d68abe/closy-problem.png";
const brandStoryImage = "/__l5e/assets-v1/faaee840-c13a-4554-a54e-d89d8c076327/closy-brand-story.png";
const ourStoryImage = "/__l5e/assets-v1/b26f564e-f000-4abc-a5c7-c4d994abba04/closy-our-story.png";
const personaImage = "/__l5e/assets-v1/38b14b75-d7c4-4023-b04c-710dc17b927d/closy-persona.png";

const meta: ProjectMeta = {
  code: "Thread 001",
  title: "Closy",
  question: "왜 옷은 많은데 입을 옷이 없을까?",
  type: "Team Project · UX/UI",
  contribution: ["Research", "Concept Development", "UI Design", "Content Design"],
  period: "2024",
  sections: [
    {
      id: "question",
      label: "Question",
      title: "왜 옷은 많은데 입을 옷이 없을까?",
      body: (
        <p>
          옷은 충분히 있는데도 매일 아침 입을 옷이 없다고 느끼는 순간,
          Closy는 그 작고 반복되는 질문에서 시작되었습니다.
        </p>
      ),
      images: [
        {
          src: coverImage,
          alt: "Closy cover collage showing the project concept and wardrobe mood",
        },
      ],
    },
    {
      id: "project-overview",
      label: "Project Overview",
      title: "AI 기반 코디네이터 서비스 Closy",
      body: (
        <>
          <p>옷장 속 옷과 사용자의 취향을 분석하여 상황에 맞는 코디를 추천하는 서비스입니다.</p>
          <p className="mt-4">
            사용자가 이미 가지고 있는 옷을 더 잘 활용하도록 돕고, 매일의 선택 피로를 줄이는 경험에 집중했습니다.
          </p>
        </>
      ),
      images: [
        {
          src: projectOverviewImage,
          alt: "Closy project overview introducing the AI coordinator service and product screen",
        },
      ],
    },
    {
      id: "problem-discovery",
      label: "Problem Discovery",
      title: "선택의 피로가 반복되는 아침",
      body: (
        <>
          <p>사용자들은 옷이 부족해서가 아니라 선택의 피로를 경험하고 있었습니다.</p>
          <p className="mt-4">
            날씨, 일정, 취향을 동시에 계산하며 매일 아침 반복되는 고민이 작은 불편을 넘어 피로로 축적되고 있음을 발견했습니다.
          </p>
        </>
      ),
      images: [
        {
          src: problemImage,
          alt: "Problem discovery page describing daily outfit decision fatigue",
        },
      ],
    },
    {
      id: "brand-story",
      label: "Brand Story",
      title: "친근한 AI 스타일리스트라는 방향",
      body: (
        <>
          <p>Closy는 사용자의 일상에 자연스럽게 스며드는 친근한 AI 스타일리스트를 목표로 했습니다.</p>
          <p className="mt-4">
            구매를 부추기기보다 이미 가진 옷 안에서 새로운 조합을 발견하게 하는 브랜드 태도를 설계했습니다.
          </p>
        </>
      ),
      images: [
        {
          src: brandStoryImage,
          alt: "Closy brand story board showing problem, vision, purpose and brand keywords",
        },
        {
          src: ourStoryImage,
          alt: "Closy story page explaining the everyday question behind the service",
        },
      ],
    },
    {
      id: "persona",
      label: "Persona",
      title: "핵심 사용자 정의",
      body: (
        <>
          <p>사용자의 상황과 니즈를 분석하여 대표 페르소나를 도출했습니다.</p>
          <p className="mt-4">
            출근 전 짧은 시간 안에 코디를 결정해야 하고, 새로운 조합을 원하지만 선택 과정에는 피로를 느끼는 사용자를 중심에 두었습니다.
          </p>
        </>
      ),
      images: [
        {
          src: personaImage,
          alt: "Closy persona board with user snapshots, goals and lifestyle notes",
        },
      ],
    },
    {
      id: "user-scenario",
      label: "User Scenario",
      title: "아침의 고민에서 추천까지",
      body: (
        <>
          <p>사용자가 아침에 코디를 고민하는 순간부터 추천을 받는 흐름을 정리했습니다.</p>
          <p className="mt-4">
            날씨와 일정 확인 → 오늘의 컨디션과 취향 반영 → 보유 의류 기반 추천 확인 → 빠른 결정이라는 시나리오로 경험을 설계했습니다.
          </p>
        </>
      ),
    },
    {
      id: "solution",
      label: "Solution",
      title: "상황을 이해하는 맞춤 코디 추천",
      body: (
        <>
          <p>날씨, 일정, 취향, 보유 의류를 종합적으로 분석하여 사용자 맞춤 코디를 추천합니다.</p>
          <p className="mt-4">
            단순한 상품 추천이 아니라 지금 가진 옷을 오늘의 맥락에 맞게 다시 발견하도록 돕는 것이 Closy의 핵심 해결 방식입니다.
          </p>
        </>
      ),
    },
    {
      id: "brand-identity",
      label: "Brand Identity",
      title: "브랜드 아이덴티티 구축",
      body: (
        <p>
          부드럽고 일상적인 톤, 기록물처럼 친근한 그래픽 요소, 그리고 옷장 안의 가능성을 꺼내는 메시지를 중심으로 브랜드 정체성을 구축했습니다.
        </p>
      ),
    },
    {
      id: "color-typography",
      label: "Color & Typography",
      title: "브랜드 컬러와 타이포그래피 시스템",
      body: (
        <p>
          편안한 베이지와 크림 계열의 색감, 과하게 꾸미지 않은 타이포그래피 조합으로 Closy만의 안정적이고 부드러운 인상을 정리했습니다.
        </p>
      ),
    },
    {
      id: "image-tone",
      label: "Image & Tone",
      title: "Closy만의 감성과 시각적 방향성",
      body: (
        <p>
          자연광, 옷감의 질감, 생활감 있는 소품을 활용해 Closy가 사용자 가까이에 있는 서비스처럼 느껴지도록 시각 톤을 설계했습니다.
        </p>
      ),
    },
    {
      id: "tone-voice",
      label: "Tone & Voice",
      title: "사용자와 대화하는 방식 정의",
      body: (
        <p>
          전문가처럼 단정하지만 친구처럼 부담 없는 말투를 기준으로, 추천이 명령처럼 느껴지지 않고 사용자의 하루를 가볍게 돕도록 언어 톤을 정리했습니다.
        </p>
      ),
    },
    {
      id: "final-mockup",
      label: "Final Mockup",
      title: "최종 서비스 화면",
      body: (
        <p>
          최종 화면은 사용자의 현재 맥락을 빠르게 파악하고, 고민 없이 조합을 선택할 수 있도록 정보 우선순위와 추천 흐름을 직관적으로 구성했습니다.
        </p>
      ),
    },
    {
      id: "closing",
      label: "Closing",
      title: "내 옷장 안에서 매일의 나를 발견하다.",
      body: (
        <p>
          Closy는 새 옷을 더 사게 하는 서비스가 아니라, 이미 가진 것 안에서 오늘의 나를 다시 발견하게 하는 작고 친절한 도구로 마무리됩니다.
        </p>
      ),
    },
  ],
  next: {
    to: "/pofin",
    title: "POFIN",
    question: "왜 좋아하는 작품인데 이야기할 사람이 없을까?",
  },
};

export const Route = createFileRoute("/closy")({
  head: () => ({
    meta: [
      { title: "Closy — Thread 001 · Archive of Small Questions" },
      {
        name: "description",
        content: "왜 옷은 많은데 입을 옷이 없을까? 선택 피로를 줄이는 AI 기반 코디네이터 서비스 Closy 케이스 스터디.",
      },
    ],
  }),
  component: () => <ProjectPage meta={meta} />,
});
