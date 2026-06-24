import { createFileRoute } from "@tanstack/react-router";
import ProjectPage, { type ProjectMeta } from "@/components/ProjectPage";

const meta: ProjectMeta = {
  code: "Thread 003",
  title: "Graduation Project",
  question: "왜 우리는 애써 둥글게 살아야 할까?",
  type: "Individual Project · Visual & Editorial",
  contribution: ["Concept Development", "Visual Design", "Content Design"],
  period: "2023",
  overview:
    "남의 시선 속에서 자신을 깎아가며 ‘둥글게’ 살아가는 우리에 대한 시각적 에세이입니다. 모난 마음이 어떻게 다듬어지는지, 그리고 그렇게 다듬어진 모양이 정말 우리의 모양인지 묻는 졸업 프로젝트.",
  sections: [
    {
      id: "question",
      label: "Question",
      title: "왜 우리는 애써 둥글게 살아야 할까?",
      body:
        "‘둥글둥글하게 살아라’는 말은 자주 미덕처럼 쓰입니다. 하지만 그 말 뒤에서 우리는 자기 자신의 모서리를 조금씩 깎아내고 있는지도 모른다는 생각에서 출발했습니다.",
    },
    {
      id: "background",
      label: "Background",
      body:
        "타인의 시선과 사회적 기대 속에서 자신을 조정하며 사는 일상의 감정을 관찰했습니다. ‘예민하다’, ‘유난스럽다’는 말 앞에서 작아지는 순간들을 모았습니다.",
    },
    {
      id: "concept",
      label: "Concept",
      title: "모난 돌이 다듬어지는 풍경",
      body:
        "프로젝트의 시각적 메타포는 ‘파도에 깎이는 돌’입니다. 시간이 흐르며 둥글어지는 돌의 모양에서, 우리가 잃어버린 모서리를 떠올리게 합니다.",
    },
    {
      id: "visual",
      label: "Visual Design",
      bullets: [
        "흑백과 종이 질감 중심의 절제된 톤.",
        "타이포그래피는 정형과 비정형을 의도적으로 섞어 ‘다듬어지는 과정’을 시각화.",
        "이미지는 거친 입자감이 남는 인쇄 질감으로 표현.",
      ],
    },
    {
      id: "message",
      label: "Message",
      body:
        "‘둥글다’는 것이 늘 옳은 답은 아니라는 것, 모서리를 가진 채로도 우리는 충분히 같이 살 수 있다는 메시지를 담았습니다.",
    },
    {
      id: "outcome",
      label: "Outcome",
      bullets: [
        "졸업 전시에서 ‘오래 머무르게 되는 작업’으로 가장 많이 언급됨.",
        "관람객의 ‘나도 그런 적 있다’는 짧은 메모가 가장 큰 피드백.",
      ],
    },
    {
      id: "retro",
      label: "Retrospective",
      body:
        "이 프로젝트를 통해 ‘말로 잘 표현되지 않는 감정’을 디자인이 어떻게 받아낼 수 있는지를 고민했습니다. 정답을 주는 디자인이 아니라, 질문을 함께 머무르게 하는 디자인의 가능성을 봤습니다.",
    },
  ],
  next: {
    to: "/hyundai",
    title: "Hyundai Card",
    question: "취향은 어떻게 공간 경험이 될까?",
  },
};

export const Route = createFileRoute("/graduation")({
  head: () => ({
    meta: [
      { title: "Graduation Project — Thread 003 · Archive of Small Questions" },
      {
        name: "description",
        content: "왜 우리는 애써 둥글게 살아야 할까? 시선과 자아에 대한 시각적 에세이.",
      },
    ],
  }),
  component: () => <ProjectPage meta={meta} />,
});
