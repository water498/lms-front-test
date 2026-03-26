"use client";

import { useState } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  PenLine,
  X,
  CheckCircle2,
  Clock,
  Lock,
} from "lucide-react";

interface QnaItem {
  id: string;
  authorName: string;
  authorInitial: string;
  body: string;
  createdAt: string;
  isAnswered: boolean;
  activityTitle?: string;
  answer?: {
    authorName: string;
    body: string;
    createdAt: string;
  };
}

const MOCK_QNA: QnaItem[] = [
  {
    id: "q-1",
    authorName: "김태현",
    authorInitial: "김",
    body: "섹션 3의 랜덤 포레스트 실습에서 n_estimators 파라미터를 높이면 항상 성능이 좋아지나요? 무조건 높게 설정하면 안 되는 이유가 있나요?",
    createdAt: "2026-03-15",
    isAnswered: true,
    activityTitle: "의사결정나무와 랜덤 포레스트",
    answer: {
      authorName: "김민준 강사",
      body: "좋은 질문이에요! n_estimators를 높이면 분산이 줄어들어 일반적으로 성능이 향상되지만, 일정 수를 넘으면 개선 폭이 거의 없어지고 학습 시간만 늘어납니다. 보통 100~500 사이에서 적절한 값을 찾는 게 좋고, 실무에선 GridSearchCV나 조기 종료로 최적값을 찾습니다. 메모리와 시간 대비 성능 향상이 미미해지는 지점을 '수렴'이라고 하는데, 다음 섹션에서 더 자세히 다룹니다.",
      createdAt: "2026-03-16",
    },
  },
  {
    id: "q-2",
    authorName: "박수민",
    authorInitial: "박",
    body: "딥러닝 섹션에서 CNN을 학습할 때 GPU가 없는 환경에서는 어떻게 실습하면 좋을까요? 코랩을 써도 되나요?",
    createdAt: "2026-03-12",
    isAnswered: true,
    activityTitle: "CNN으로 이미지 분류하기",
    answer: {
      authorName: "김민준 강사",
      body: "물론이죠! Google Colab 무료 플랜도 T4 GPU를 제공하므로 이 강의 실습에는 충분합니다. 런타임 유형에서 GPU를 선택하시면 됩니다. 실습 코드 상단에 코랩용 설정 주석도 추가해 두었으니 참고해 주세요. Kaggle Notebook도 좋은 대안입니다.",
      createdAt: "2026-03-13",
    },
  },
  {
    id: "q-3",
    authorName: "이재원",
    authorInitial: "이",
    body: "MLflow 실습에서 실험 결과가 저장되지 않는 문제가 있습니다. mlflow.start_run() 이후에 오류가 발생하는데 어떻게 해결하나요? 오류 메시지: MlflowException: Could not find experiment with ID 0",
    createdAt: "2026-03-18",
    isAnswered: false,
    activityTitle: "MLflow로 실험 관리하기",
  },
  {
    id: "q-4",
    authorName: "최지은",
    authorInitial: "최",
    body: "트랜스포머 아키텍처 강의에서 Self-Attention 메커니즘의 Q, K, V 행렬이 어떤 역할을 하는지 좀 더 직관적으로 이해할 수 있는 방법이 있을까요?",
    createdAt: "2026-03-10",
    isAnswered: true,
    activityTitle: "트랜스포머와 BERT 활용",
    answer: {
      authorName: "김민준 강사",
      body: "비유를 들면 도서관 검색 시스템과 비슷합니다. Q(Query)는 '내가 찾고 싶은 것', K(Key)는 '각 책의 제목/색인', V(Value)는 '실제 책 내용'이라고 생각하면 됩니다. 내 검색어(Q)와 각 책 제목(K)의 유사도를 계산해 가중치를 구하고, 그 가중치로 실제 내용(V)을 가중 합산하는 것이죠. 강의 보충 자료로 시각화 노트북도 업로드해 두었으니 확인해 보세요!",
      createdAt: "2026-03-11",
    },
  },
];

interface WriteFormProps {
  onSubmit: (body: string) => void;
  onCancel: () => void;
}

function WriteForm({ onSubmit, onCancel }: WriteFormProps) {
  const [body, setBody] = useState("");
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 flex flex-col gap-3">
      <textarea
        autoFocus
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="강의 내용, 실습 코드, 개념 이해 등 궁금한 점을 자유롭게 작성해 주세요."
        rows={4}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          취소
        </button>
        <button
          onClick={() => body.trim() && onSubmit(body.trim())}
          disabled={!body.trim()}
          className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors"
        >
          질문 등록
        </button>
      </div>
    </div>
  );
}

export function QnaTab({ courseId, canPost }: { courseId?: string; canPost?: boolean }) {
  const [items, setItems] = useState<QnaItem[]>(MOCK_QNA);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [writing, setWriting] = useState(false);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (body: string) => {
    const newItem: QnaItem = {
      id: `q-new-${Date.now()}`,
      authorName: "홍길동",
      authorInitial: "홍",
      body,
      createdAt: new Date().toISOString().slice(0, 10),
      isAnswered: false,
    };
    setItems((prev) => [newItem, ...prev]);
    setWriting(false);
    setExpanded((prev) => new Set([...prev, newItem.id]));
  };

  const answered = items.filter((i) => i.isAnswered).length;
  const unanswered = items.length - answered;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">Q&A</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              답변 {answered}
            </span>
            {unanswered > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                미답변 {unanswered}
              </span>
            )}
          </div>
        </div>
        {!writing && (
          canPost
            ? (
              <button
                onClick={() => setWriting(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" />
                질문 작성
              </button>
            )
            : (
              <p className="flex items-center gap-1 text-xs text-zinc-500">
                <Lock className="w-3 h-3" />
                등록된 수강생만 질문을 남길 수 있습니다
              </p>
            )
        )}
      </div>

      {/* Write form */}
      {writing && (
        <WriteForm onSubmit={handleSubmit} onCancel={() => setWriting(false)} />
      )}

      {/* Q&A list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isOpen = expanded.has(item.id);
          return (
            <div
              key={item.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Question header */}
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-zinc-800/40 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 mt-0.5">
                  {item.authorInitial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-medium text-zinc-300">{item.authorName}</span>
                    {item.activityTitle && (
                      <span className="text-xs text-zinc-600">· {item.activityTitle}</span>
                    )}
                    <span className="text-xs text-zinc-600 ml-auto">{item.createdAt}</span>
                  </div>
                  <p className={`text-sm text-zinc-300 leading-snug ${isOpen ? "" : "line-clamp-2"}`}>
                    {item.body}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {item.isAnswered ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      답변 완료
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      미답변
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {isOpen && item.answer && (
                <div className="border-t border-zinc-800 bg-zinc-800/30 px-4 py-4 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400 shrink-0 mt-0.5">
                    강
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-violet-300">{item.answer.authorName}</span>
                      <span className="text-xs text-zinc-600">{item.answer.createdAt}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item.answer.body}</p>
                  </div>
                </div>
              )}

              {/* No answer yet */}
              {isOpen && !item.answer && (
                <div className="border-t border-zinc-800 px-4 py-3">
                  <p className="text-xs text-zinc-600">강사가 아직 답변을 작성하지 않았습니다. 조금만 기다려 주세요.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
