# OpenKnock LMS — 인프라 아키텍처

멀티테넌트 B2B LMS의 배포 구조, 데이터 격리, 업데이트 흐름 정리.

---

## 1. 전체 인프라 그림

```
┌─────────────────────────────────────────────────────────────────┐
│                       OpenKnock 인프라                           │
│                                                                 │
│   Control Plane API            Control Plane DB                 │
│   ┌────────────────┐           ┌─────────────────┐             │
│   │ - 테넌트 목록   │◀─────────▶│ tenants         │             │
│   │ - 계약/플랜    │           │ billing         │             │
│   │ - 집계 통계    │           │ platform_settings│             │
│   │ - 플랫폼어드민  │           │ audit_logs      │             │
│   └──────┬─────────┘           └─────────────────┘             │
└──────────┼──────────────────────────────────────────────────────┘
           │ HTTP API 호출 (DB 직접 접근 ✕)
    ┌──────┴──────────────────────────────┐
    ▼                                     ▼
┌──────────────────┐               ┌──────────────────┐
│  롯데건설 인프라   │               │   삼성 인프라     │
│                  │               │                  │
│  Tenant API      │               │  Tenant API      │
│  ┌────────────┐  │               │  ┌────────────┐  │
│  │ LMS 전체   │  │               │  │ LMS 전체   │  │
│  │ 기능       │  │               │  │ 기능       │  │
│  └──────┬─────┘  │               │  └──────┬─────┘  │
│         ▼        │               │         ▼        │
│  ┌────────────┐  │               │  ┌────────────┐  │
│  │ 롯데 RDS   │  │               │  │ 삼성 RDS   │  │
│  │ 수강자     │  │               │  │ 수강자     │  │
│  │ 과정/성적  │  │               │  │ 과정/성적  │  │
│  └────────────┘  │               │  └────────────┘  │
└──────────────────┘               └──────────────────┘
```

**핵심 원칙:**
- Control Plane은 테넌트 DB에 직접 접근하지 않는다
- Control Plane ↔ Tenant 통신은 API 호출로만 이루어진다
- 각 기업은 자신의 데이터만 물리적으로 분리된 DB에 저장한다

---

## 2. 신규 계약 → 배포 흐름

```
계약 완료
   │
   ▼
인프라 프로비저닝 (Terraform 등)
├── 기업 AWS 계정에 RDS 생성
└── EC2 / ECS 서버 세팅
   │
   ▼
Docker 이미지 배포 (코드는 동일, 환경변수만 다름)
┌──────────────────────────────────────────────┐
│ IMAGE:  openknock/tenant-app:v1.0.0          │
│ ENV:    DATABASE_URL = lotte-rds.aws.com     │
│         TENANT_ID    = lotte                 │
└──────────────────────────────────────────────┘
   │
   ▼
Control Plane DB에 테넌트 등록
INSERT INTO tenants (id='lotte', api_url='lotte.api.openknock.com', ...)
   │
   ▼
완료 — 플랫폼 관리자 화면에 롯데건설 테넌트 노출
```

> 기업에게 소스코드를 넘기는 것이 아니라,
> 오픈녹이 해당 기업 인프라에 Docker 이미지를 배포하고 운영한다.

---

## 3. 코드 업데이트 / 마이그레이션 흐름

```
git push (main branch)
   │
   ▼
CI/CD 파이프라인 (GitHub Actions 등)
   │
   ▼
Docker 이미지 빌드
openknock/tenant-app:v1.2.3
   │
   ▼
Control Plane에서 테넌트 목록 조회
[lotte, samsung, hyundai, ...]
   │
   ├──▶ 롯데건설 서버에 v1.2.3 배포
   │         └── DB 마이그레이션 자동 실행 (alembic upgrade head)
   │
   ├──▶ 삼성 서버에 v1.2.3 배포
   │         └── DB 마이그레이션 자동 실행
   │
   └──▶ 현대 서버에 v1.2.3 배포
             └── DB 마이그레이션 자동 실행

※ 수동 배포 없음 — CI/CD가 테넌트 수만큼 자동 반복
```

---

## 4. 성장 경로 (권장)

```
초기 — Pooled (운영 단순, 비용 최소)
┌─────────────────────────────────────┐
│ OpenKnock 서버 1대                   │
│ 중소기업 A, B, C가 공유              │
│ tenant_id 컬럼으로 데이터 격리       │
└─────────────────────────────────────┘

대기업 계약 발생 시 — 하이브리드
┌──────────────────┐  ┌────────────┐  ┌────────────┐
│ Pooled 서버      │  │ 롯데 전용   │  │ 삼성 전용   │
│ 중소기업 A, B, C │  │ Silo       │  │ Silo       │
└──────────────────┘  └────────────┘  └────────────┘
         ↑ 코드 동일 / 배포 방식만 다름
```

Silo 전환 조건: 기업이 "물리적 데이터 분리"를 계약 조건으로 요구할 때.
그 전까지는 Pooled로 운영하는 것이 압도적으로 단순하다.

---

## 5. 이 프로젝트 코드 관점

```
lms/backend/app/modules/
│
├── [CONTROL-PLANE DB] — OpenKnock 서버에서만 실행
│   ├── platform/    PlatformSetting, PlatformAuditLog
│   └── tenant/      Tenant, TenantSsoConfig, TenantInfra
│
└── [PER-TENANT DB] — 기업별 서버에 배포
    ├── user/        User, OrgUnit, OrgMember
    ├── course/      Course, CourseSession, CourseSubject
    ├── enrollment/  Enrollment, LearningProgress
    ├── certificate/ CertificateTemplate, IssuedCertificate
    ├── assessment/  ExamTemplate, AssignmentTemplate, Survey
    ├── payment/     Order, Payment, Credit
    ├── messaging/   MessageTemplate, MessageLog
    └── ...
```

배포 시 분리 방식:
```
control_plane_app  →  platform + tenant 모듈만 포함
tenant_app         →  나머지 모든 모듈 포함
                       + TENANT_ID 환경변수 주입
```

---

## 6. 핵심 원칙 요약

| 원칙 | 내용 |
|------|------|
| 코드는 하나 | 배포는 여러 곳 — 같은 Docker 이미지, 다른 환경변수 |
| 코드 전달 없음 | 기업에게 소스코드를 주는 게 아니라 우리가 배포·운영 |
| API로만 통신 | Control Plane은 테넌트 DB에 직접 접근하지 않음 |
| tenant_id 필수 | Pooled/Silo 무관하게 모든 테이블에 존재 |
| 운영 자동화 | Silo의 다중 배포 부담은 CI/CD 파이프라인으로 해결 |
