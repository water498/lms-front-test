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
│   ├── page.tsx                    ← 실험 목록 인덱스
│   ├── globals.css                 ← Tailwind v4 임포트
│   └── experiments/
│       └── [실험명]/
│           └── page.tsx            ← feature import wrapper (로직 없음)
└── features/
    └── (실험그룹명)/               ← 괄호 폴더로 실험별 그룹핑
        ├── home/                   ← 메인 라우트 피처
        │   ├── feature.tsx         ← 메인 컴포넌트 ("use client")
        │   ├── store.ts            ← 실험 로컬 상태
        │   ├── mockData.ts         ← 목 데이터
        │   ├── components/         ← Navbar, CourseCard 등
        │   └── sections/           ← HeroBanner, Tab 등 페이지 섹션
        └── [서브라우트]/           ← cart, my 등 서브 페이지
            ├── feature.tsx
            └── sections/
```

---

## 실험 추가 방법

1. `src/features/(실험명)/home/feature.tsx` 생성 (메인 컴포넌트)
2. `src/app/experiments/[실험명]/page.tsx` 생성 — feature import만:
   ```tsx
   import Feature from "@/features/(실험명)/home/feature";
   export default function Page() { return <Feature />; }
   ```
3. `src/app/page.tsx`의 `experiments` 배열에 항목 추가

### 구조 전환 기준
- 단일 page.tsx가 **200줄 이하**이고 서브 라우트 없음 → app에 직접 작성 가능
- **200줄 초과** 또는 **서브 라우트 존재** → features 구조 필수

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
- `student` (통합): TenantContext feature flag 기반, dev switcher로 B2C/B2B 전환
  - `b2c-student` / `b2b-student`: deprecated, 폴더만 참고용 유지
- `admin`: ORG_ADMIN 멀티페이지 관리자
- `platform-admin`: 슈퍼어드민 — 전체 테넌트(B2B·B2C) 생명주기 관리 내부툴

### 개발 원칙
- 기능은 B2C·B2B **공통으로 구현**, 해당 컨텍스트에서 필요 없는 UI는 **hide만** (제거 X)
- 테넌트 ID, 역할(role), 인증 방식(authProvider)은 User 모델의 핵심 필드
- 브랜딩(로고, 컬러), 메뉴 구성이 테넌트별로 달라질 수 있음을 UI 설계에 반영

---

## 공유 타입

모든 도메인 타입/인터페이스는 `src/lib/models.ts`에 정의한다.

- 새 도메인 엔티티 추가 시 → `models.ts`에 먼저 정의 후 `mockData.ts`에서 import
- UI 전용 타입 (컴포넌트 props, 로컬 상태 shape 등) → 해당 파일에 로컬 정의 허용
- `mockData.ts` / `store.ts`는 타입을 재정의하지 않고 `models.ts`에서 import

### 전환 로드맵

| 단계 | `models.ts` 역할 | Course 등 타입 방식 |
|------|-----------------|-------------------|
| 현재 (실험) | 공통 타입 SoT | flat optional 통합 |
| API 연동 시 | DB 스키마 1:1 반영 | 필드 필수화 + feature별 `Pick`/DTO |

실제 API 연동 시점에 `models.ts`를 `data-model.dbml` 기준으로 재정비한다.

---

---

## TenantContext 패턴

feature flag 기반 UI 분기. `tenantType` 직접 분기 금지 — `features.*` 플래그 사용.

**Store 위치:**
- `src/features/(b2c-student)/shared/tenant-context-store.ts` (기본값: B2C)
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
