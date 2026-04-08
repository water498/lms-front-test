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
│   ├── page.tsx                         ← 실험 목록 인덱스
│   ├── globals.css                      ← Tailwind v4 임포트
│   └── experiments/
│       └── {역할}/                      ← admin, student, instructor, platform-admin
│           ├── page.tsx                 ← feature import wrapper (로직 없음)
│           └── {라우트}/page.tsx         ← 각 페이지도 feature import만
└── features/
    └── ({역할})/                        ← (admin), (student), (instructor), (platform-admin)
        ├── {역할}-dashboard/            ← 역할별 메인 대시보드
        │   ├── feature.tsx              ← 메인 컴포넌트 ("use client")
        │   ├── feature-description.md   ← 기능 설명서
        │   └── mockData.ts             ← 목 데이터
        ├── {도메인}-list/               ← 목록 페이지 (course-list, user-list 등)
        │   ├── feature.tsx
        │   ├── feature-description.md
        │   ├── mockData.ts
        │   └── components/
        ├── {도메인}-layout/             ← 탭 내비게이션 레이아웃 (course-layout 등)
        │   ├── feature.tsx              ← 탭 네비 + children 렌더링
        │   ├── context.tsx              ← 공유 상태 (프로토타입 전용, 프로덕션에서 제거)
        │   └── mockData.ts
        └── {도메인}-{탭}/               ← 독립 탭 feature (course-info, session-grading 등)
            ├── feature.tsx
            └── feature-description.md
```

### 네이밍 규칙
- 모든 feature 디렉토리는 `({역할})/{feature-name}/` 2층 구조
- 복수형 사용 금지 (courses → course-list)
- 목록: `*-list`, 레이아웃: `*-layout`, 에디터: `*-editor`
- 도메인 prefix로 구분 (course-*, session-*, user-*, instructor-*, platform-*)

### Layout feature 패턴
탭 구조 페이지는 layout feature + 독립 탭 feature로 구성:
- `course-layout/feature.tsx` → 탭 네비게이션, `children` prop 수용
- `course-info/feature.tsx`, `course-curriculum/feature.tsx` → 각 탭 콘텐츠
- app route: `layout.tsx`에서 layout feature 호출, 각 탭은 `{tab}/page.tsx`

---

## 실험 추가 방법

1. `src/features/({역할})/{feature-name}/feature.tsx` 생성
2. `src/app/experiments/{역할}/{라우트}/page.tsx` 생성 — feature import만:
   ```tsx
   import Feature from "@/features/({역할})/{feature-name}/feature";
   export default function Page() { return <Feature />; }
   ```
3. `src/app/page.tsx`의 `experiments` 배열에 항목 추가

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

---

## 비즈니스 컨텍스트

### 최종 제품: B2B2C 멀티태넌트 LMS

| 고객 유형 | 인증 방식 | 특징 |
|----------|----------|------|
| **B2C** | 이메일/소셜 (Google, Kakao 등) | 개인 학습자, 자유 결제·위시리스트 |
| **B2B** | SSO (SAML/OIDC — Azure AD, Okta 등) | 기업 직원, 테넌트 관리자 존재, 개인 결제 없음 |

### 실험 구조
- `student` (통합): TenantContext feature flag 기반, dev switcher로 B2C/B2B 전환. `features/(student)/`
- `instructor`: 강사 전용 포털 (사이드바, role guard). `features/(instructor)/`
- `admin`: ORG_ADMIN 멀티페이지 관리자
- `platform-admin`: 슈퍼어드민 — 전체 테넌트(B2B·B2C) 생명주기 관리 내부툴

### 개발 원칙
- 기능은 B2C·B2B **공통으로 구현**, 해당 컨텍스트에서 필요 없는 UI는 **hide만** (제거 X)
- 테넌트 ID, 역할(role), 인증 방식(authProvider)은 User 모델의 핵심 필드
- 브랜딩(로고, 컬러), 메뉴 구성이 테넌트별로 달라질 수 있음을 UI 설계에 반영

---

## 공유 타입

모든 도메인 타입/인터페이스는 `src/lib/models.ts`에 정의한다.

- 타입의 기준은 백엔드 SQLAlchemy 모델 (`backend/app/modules/`)
- 새 도메인 엔티티 추가 시 → 백엔드 모델 변경 후 `models.ts` 반영
- UI 전용 타입 (컴포넌트 props, 로컬 상태 shape 등) → 해당 파일에 로컬 정의 허용
- `mockData.ts` / `store.ts`는 타입을 재정의하지 않고 `models.ts`에서 import

### 전환 로드맵

| 단계 | `models.ts` 역할 | Course 등 타입 방식 |
|------|-----------------|-------------------|
| 현재 (실험) | 백엔드 모델 반영 | flat optional 통합 |
| API 연동 시 | DB 스키마 1:1 반영 | 필드 필수화 + feature별 `Pick`/DTO |

실제 API 연동 시점에 `models.ts`를 백엔드 SQLAlchemy 모델 기준으로 재정비한다.

---

---

## TenantContext 패턴

feature flag 기반 UI 분기. `tenantType` 직접 분기 금지 — `features.*` 플래그 사용.

**Store 위치:**
- `src/features/(student)/shared/tenant-context-store.ts` (기본값: B2C)
- `src/features/(admin)/shared/tenant-context-store.ts` (기본값: B2B)

| 플래그 | B2C | B2B | 용도 |
|--------|-----|-----|------|
| `payments` | ✅ | ❌ | 결제 버튼, 주문 내역 탭 |
| `cart` | ✅ | ❌ | 장바구니 아이콘·버튼 |
| `orgStructure` | ❌ | ✅ | 조직 구조 설정 |
| `sso` | ❌ | ✅ | SSO 설정 |
| `mandatoryCourses` | ❌ | ✅ | 필수 수강 과정 |

---

### ⚠️ SSO 사용자 프로필 주의사항
B2B SSO 사용자는 이름·이메일이 IdP(회사 디렉토리)에서 관리됨.
LMS에서 자유 편집 허용 시 다음 SSO 로그인 때 IdP 값으로 덮어씌워짐.

실제 구현 시:
- `idpManagedFields: ("name" | "email" | "avatar")[]` → 해당 필드 read-only 처리
- 비밀번호 변경 UI → SSO 사용자에게 완전히 숨김
- 현재 B2C 실험에서는 모든 필드가 app-managed이므로 해당 없음
