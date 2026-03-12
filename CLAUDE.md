# lms_front_test — Claude Context

LMS 본 개발 전 프론트엔드 실험 공간. 각 실험은 독립적인 라우트로 관리되며, 재사용 목적이 아닌 탐색 목적으로 작성한다.

---

## 스택

| 항목 | 버전/도구 |
|------|----------|
| Next.js | 16 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| 상태관리 | zustand |
| 아이콘 | lucide-react |
| 패키지 매니저 | pnpm |

---

## 폴더 구조

```
src/
├── app/
│   ├── page.tsx              ← 실험 목록 인덱스
│   ├── globals.css           ← Tailwind v4 임포트
│   └── experiments/
│       └── [실험명]/
│           └── page.tsx      ← 각 실험 페이지
└── components/               ← 실험 간 공유 컴포넌트 (필요 시)
```

---

## 실험 추가 방법

1. `src/app/experiments/[실험명]/page.tsx` 생성
2. `src/app/page.tsx`의 `experiments` 배열에 항목 추가:

```ts
{ href: "/experiments/실험명", title: "제목", description: "설명" }
```

---

## 스타일 규칙

- Tailwind v4 방식: `globals.css`에 `@import "tailwindcss"` 한 줄만 사용
- `tailwind.config.ts` 없음 — 커스텀 설정은 CSS 변수(`@theme`)로 처리
- 실험 간 스타일 격리가 필요하면 CSS Modules 사용

---

## 개발 커맨드

```bash
pnpm dev      # 개발 서버 (http://localhost:3000)
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint
```
