# LMS 전체 테이블 목록 — FigJam 레퍼런스

> **용도:** 서버 DB 모델링 전 전체 테이블 점검용. FigJam에서 도메인별 색상 카드로 배치할 것.
> **기준:** `src/lib/models.ts` + 각 feature `mockData.ts` / `store.ts` 전수 탐색 결과
> **총계:** 55개 테이블 / 17개 도메인

---

## 도메인 색상 가이드

| # | 도메인 | FigJam 색상 | HEX | 테이블 수 |
|---|--------|------------|-----|---------|
| 1 | 플랫폼 운영 | 인디고 | `#6366F1` | 3 |
| 2 | 테넌트 | 파랑 | `#3B82F6` | 3 |
| 3 | 조직 구조 | 청록 | `#14B8A6` | 4 |
| 4 | 포털 | 에메랄드 | `#10B981` | 2 |
| 5 | 사용자 & 인증 | 초록 | `#22C55E` | 4 |
| 6 | 감사 로그 | 빨강 | `#EF4444` | 1 |
| 7 | 학습 콘텐츠 | 주황 | `#F97316` | 8 |
| 8 | 오프라인 & 출결 | 노랑 | `#EAB308` | 2 |
| 9 | 수강 | 보라 | `#8B5CF6` | 1 |
| 10 | 학습 이력 | 핑크 | `#EC4899` | 6 |
| 11 | 평가 & 문항은행 | 호박 | `#F59E0B` | 7 |
| 12 | 수료증 | 황금 | `#D97706` | 2 |
| 13 | 미디어 라이브러리 | 슬레이트 | `#64748B` | 2 |
| 14 | 결제 | 라임 | `#65A30D` | 1 |
| 15 | B2C 전용 | 로즈 | `#F43F5E` | 2 |
| 16 | 메시징 & 크레딧 | 자주 | `#A855F7` | 6 |
| 17 | 공지 | 하늘 | `#0EA5E9` | 1 |

---

## 전체 테이블 한눈에 보기

```
🟣 플랫폼 운영 (3)          🔵 테넌트 (3)
  1  PlatformSettings         4  Tenant
  2  PlatformAuditLog          5  TenantInfra
  3  PlanConfig                6  TenantSsoConfig ⚠️

🩵 조직 구조 (4)             🟢 포털 (2)
  7  Site                    11  PortalBanner
  8  Department (self-ref)   12  LegalDocument
  9  JobGrade
 10  OrgSettings

🟩 사용자 & 인증 (4)         🔴 감사 로그 (1)
 13  User                    17  TenantAuditLog
 14  UserGroup
 15  UserGroupMember [pivot]
 16  AccessLog

🟠 학습 콘텐츠 (8)           🟡 오프라인 & 출결 (2)
 18  CourseCategory          26  OfflineSession
 19  Course                  27  AttendanceRecord
 20  CancellationPolicy
 21  CancellationRule
 22  Subject
 23  Activity
 24  CourseSession
 25  CourseSessionInstructor [pivot]

🟤 수강 (1)                  🩷 학습 이력 (6)
 28  Enrollment              29  LessonCompletion
                             30  ExamAttempt
                             31  AssignmentSubmission
                             32  SurveyResponse
                             33  SurveyAnswer
                             34  LearningEvent [append-only]

🟠 평가 & 문항은행 (7)        🏅 수료증 (2)
 35  BankQuestion            42  CertTemplate
 36  BankQuestionOption      43  IssuedCert
 37  ExamTemplate
 38  SurveyTemplate
 39  CompositionRule
 40  AssignmentTemplate
 41  RubricItem

🩶 미디어 (2)                💚 결제 (1)
 44  MediaAsset              46  Payment
 45  MediaAssetLinkedCourse
     [pivot]

🌸 B2C 전용 (2)              🟣 메시징 & 크레딧 (6)
 47  Cart                    49  MessageTemplate
 48  Wishlist                50  MessageHistory
                             51  AutomationRule
                             52  ChannelConfig ⚠️
                             53  CreditLedger [append-only]
                             54  CreditPool

☁️ 공지 (1)
 55  Announcement
```

---

## 각 테이블 상세

---

### 🟣 플랫폼 운영 — 인디고 `#6366F1`

#### 1. PlatformSettings
> 플랫폼 전역 설정. 레코드 1개 (singleton).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | varchar PK | 고정값 `'global'` |
| service_name | varchar | 서비스 표시명 |
| ops_email | varchar | 운영팀 이메일 |
| support_email | varchar | 고객지원 이메일 |
| root_domain | varchar | 루트 도메인 |
| session_timeout_min | int | 세션 타임아웃 (분) |
| require_2fa_platform_admin | boolean | 플랫폼 관리자 2FA 강제 여부 |
| audit_log_retention_days | int | 감사 로그 보존 기간 (일) |
| trial_days | int | 신규 테넌트 트라이얼 기간 |
| trial_expiry_warning_days | int | 만료 경고 D-N |
| storage_threshold_pct | int | 스토리지 경고 임계값 (%) |
| user_threshold_pct | int | 사용자 수 경고 임계값 (%) |
| email_alerts_enabled | boolean | 이메일 알림 활성화 |
| slack_webhook_url | varchar? | Slack 알림 웹훅 URL |

---

#### 2. PlatformAuditLog
> 플랫폼 운영자(SUPER_ADMIN)의 테넌트 관리 작업 이력. Layer 2 Audit.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| timestamp | timestamptz | |
| actor | varchar | 작업자 이름/이메일 (스냅샷) |
| action | enum | TENANT_CREATED / TENANT_SUSPENDED / TENANT_RESUMED / SUBDOMAIN_CHANGED / PLAN_CHANGED / USER_LIMIT_CHANGED / SSO_CONFIGURED / SSO_ENABLED / SSO_DISABLED / ADMIN_INVITED / ADMIN_INVITE_RESENT / PLATFORM_SETTINGS_UPDATED |
| target_type | enum | TENANT / PLATFORM |
| target_name | varchar | 대상 테넌트명 또는 'platform' |
| detail | text | 변경 내용 요약 |
| ip | varchar | 요청 IP |

---

#### 3. PlanConfig
> 플랫폼에서 정의하는 구독 플랜 규격. Tenant.plan이 이를 참조.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | varchar PK | 'STARTER' / 'GROWTH' / 'ENTERPRISE' |
| label | varchar | 표시명 |
| max_users | int | 최대 사용자 수 (0 = 무제한) |
| storage_gb | int | 스토리지 한도 |
| monthly_krw | int | 월 요금 (KRW) |

---

### 🔵 테넌트 — 파랑 `#3B82F6`

#### 4. Tenant
> B2B 고객사 단위. 모든 핵심 엔티티는 tenant_id로 격리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| name | varchar | 표시명 |
| subdomain | varchar UNIQUE | `{subdomain}.lms.io` |
| plan | varchar FK → PlanConfig | |
| status | enum | TRIAL / ACTIVE / SUSPENDED |
| trial_ends_at | timestamptz? | TRIAL 상태일 때만 |
| max_users | int | 플랜 한도 (개별 덮어쓰기 가능) |
| current_users | int | 현재 활성 사용자 수 (캐시) |
| admin_email | varchar | 대표 관리자 이메일 |
| admin_invite_status | enum? | PENDING / ACCEPTED |
| contract_start | date | |
| contract_end | date | |
| storage_used_gb | float | |
| storage_max_gb | float | |

---

#### 5. TenantInfra
> AWS 인프라 프로비저닝 정보. platform-admin 전용 뷰.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| aws_region | varchar | 데이터 거주 리전 |
| db_host | varchar | RDS 엔드포인트 |
| s3_bucket | varchar | 테넌트 전용 버킷 |
| ec2_instance_type | varchar | 앱 인스턴스 타입 |
| provisioned_at | timestamptz | |
| ec2_status | enum | HEALTHY / WARNING / DOWN |
| rds_status | enum | HEALTHY / WARNING / DOWN |
| s3_status | enum | HEALTHY / WARNING / DOWN |
| checked_at | timestamptz | 상태 최종 확인 시각 |

---

#### 6. TenantSsoConfig ⚠️
> SSO 자격증명 (SAML/OIDC). 민감정보 — Tenant에서 분리, 암호화 저장 필요.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| enabled | boolean | |
| provider | enum | SAML / OIDC |
| idp_entity_id | varchar? | SAML |
| idp_sso_url | varchar? | SAML |
| idp_certificate | text? | SAML — **암호화 저장** |
| issuer_url | varchar? | OIDC |
| client_id | varchar? | OIDC |
| client_secret | varchar? | OIDC — **암호화 저장** |

---

### 🩵 조직 구조 — 청록 `#14B8A6`

#### 7. Site
> 사업장 (서울 본사, 부산 지점 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |

---

#### 8. Department
> 부서. parent_id self-ref로 무한 depth 트리 구조.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| parent_id | UUID? FK → Department | NULL = 최상위 |
| order | int | 같은 레벨 내 정렬 순서 |

---

#### 9. JobGrade
> 직급 (사원/대리/과장 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| order | int | 직급 순서 (낮은 값 = 하위 직급) |

---

#### 10. OrgSettings
> 조직 기본 설정 + 브랜딩 (로고, 브랜드 색상). Tenant 1:1.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| name | varchar | 조직 표시명 |
| contact_email | varchar | |
| brand_color | varchar | hex 색상 |
| logo_url | varchar? | CDN URL |
| favicon_url | varchar? | CDN URL |

---

### 🟢 포털 — 에메랄드 `#10B981`

#### 11. PortalBanner
> 학습자 포털 배너/팝업 슬라이더.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| image_url | varchar? | CDN URL |
| link_url | varchar? | 클릭 시 이동 URL |
| active | boolean | |
| start_date | date? | 노출 시작일 (NULL = 즉시) |
| end_date | date? | 노출 종료일 (NULL = 무기한) |
| order | int | 배너 순서 |

---

#### 12. LegalDocument
> 이용약관 / 개인정보처리방침 버전 이력.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| type | enum | TERMS / PRIVACY |
| content | text | HTML 또는 Markdown 본문 |
| version | int | 순차 증가 |
| effective_date | date | 적용일 |
| created_at | timestamptz | |

---

### 🟩 사용자 & 인증 — 초록 `#22C55E`

#### 13. User
> 시스템 내 모든 사용자. B2C(LOCAL)와 B2B(SSO) 공통.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| email | varchar | UNIQUE per tenant |
| name | varchar | |
| role | enum | LEARNER / INSTRUCTOR / ORG_ADMIN / SUPER_ADMIN |
| status | enum | ACTIVE / INACTIVE |
| employee_id | varchar? | B2B 사번 |
| site_id | UUID? FK → Site | |
| department_id | UUID? FK → Department | |
| job_grade_id | UUID? FK → JobGrade | |
| auth_provider | enum | LOCAL / SSO |
| idp_managed_fields | varchar[]? | SSO only. IdP 관리 필드 목록 (`name`/`email`/`avatar`) |
| avatar_url | varchar? | |
| joined_at | timestamptz | |
| last_login_at | timestamptz? | |

> ⚠️ **SSO 주의:** `idp_managed_fields`에 포함된 필드는 LMS에서 편집 불가. 다음 SSO 로그인 시 IdP 값으로 덮어씌워짐.

---

#### 14. UserGroup
> 테넌트 내 임의 그룹. 수강 일괄 배정, 공지 대상 지정 등에 활용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| description | text? | |
| created_at | timestamptz | |

---

#### 15. UserGroupMember [pivot]
> User ↔ UserGroup N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| group_id | UUID FK → UserGroup | composite PK |
| added_at | timestamptz | |

---

#### 16. AccessLog
> 로그인/로그아웃/세션만료 이력. Layer 1 Audit.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| user_id | UUID FK → User | |
| user_name | varchar | 스냅샷 (이름 변경 후에도 이력 보존) |
| type | enum | LOGIN / LOGOUT / SESSION_EXPIRED / AUTO_LOGIN |
| scope | enum | USER / ADMIN |
| occurred_at | timestamptz | |
| ip | varchar | |
| user_agent | text | |

---

### 🔴 감사 로그 — 빨강 `#EF4444`

#### 17. TenantAuditLog
> 테넌트 관리자(ORG_ADMIN)의 데이터 변경 작업 이력. Layer 2 Audit.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| timestamp | timestamptz | |
| actor_id | UUID FK → User | |
| actor | varchar | 작업자 이름 (스냅샷) |
| action | enum | ENROLLMENT_CANCEL / ENROLLMENT_CREATE / COURSE_CREATE / COURSE_UPDATE / USER_ROLE_CHANGE / ORG_STRUCTURE_UPDATE / SETTINGS_UPDATE / CERT_ISSUE |
| target | varchar | 대상 설명 (예: "김민준 / React 기초") |
| detail | text | 변경 내용 요약 (예: "ACTIVE → CANCELLED") |

---

### 🟠 학습 콘텐츠 — 주황 `#F97316`

#### 18. CourseCategory
> 과정 카테고리 (개발/디자인/비즈니스 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| label | varchar | 표시명 |
| order | int | |

---

#### 19. Course
> 과정 — 커리큘럼 정의 단위. B2C/B2B/Admin 공통.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| instructor_id | UUID FK → User | 대표 강사 |
| category_id | UUID FK → CourseCategory | |
| tags | varchar[] | |
| status | enum | PUBLISHED / DRAFT / ARCHIVED |
| mode | enum | ONLINE / OFFLINE / BLENDED |
| price | int? | B2C 전용. B2B = NULL |
| description | text? | |
| thumbnail | varchar? | CSS gradient 또는 이미지 URL |
| level | enum? | 입문 / 초급 / 중급 / 고급 |
| duration | varchar? | 예: "20시간" |
| default_min_enrollment | int? | 차수 생성 시 기본 최소 수강 인원 |
| cert_template_id | UUID? FK → CertTemplate | 수료증 템플릿 |
| cert_completion_rate | int? | 수료 기준 진도율 (%) |
| cert_require_exam | boolean | 수료 조건 시험 필수 여부 |
| cert_auto_issue | boolean | 수료증 자동 발급 여부 |
| created_at | timestamptz | |

> 설계 노트: `cert_*` 4개 컬럼은 CertConfig embedded 처리 (1:1 관계, 별도 테이블 불필요)

---

#### 20. CancellationPolicy
> 과정별 환불 정책 헤더.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| course_id | UUID PK FK → Course | 1:1 |
| no_refund_after_start | boolean | 수강 시작 후 환불 불가 여부 |

---

#### 21. CancellationRule
> 환불 정책 세부 규칙. 취소 시점에 따른 환불 비율 정의.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| days_before_start | int | N일 이상 전 취소 시 적용 |
| refund_pct | int | 환불 비율 0~100 |

---

#### 22. Subject
> 커리큘럼 챕터. Course → Subject(챕터) → Activity(콘텐츠) 트리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| title | varchar | |
| order | int | |

---

#### 23. Activity
> 콘텐츠 단위 (VIDEO/SCORM/QUIZ/ASSIGNMENT).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| subject_id | UUID FK → Subject | |
| title | varchar | |
| type | enum | VIDEO / SCORM / QUIZ / ASSIGNMENT |
| order | int | Subject 내 순서 |
| duration | int? | 분 단위 (VIDEO) |
| question_count | int? | QUIZ / ASSIGNMENT |
| media_asset_id | UUID? FK → MediaAsset | VIDEO / SCORM |
| exam_template_id | UUID? FK → ExamTemplate | QUIZ |
| assign_template_id | UUID? FK → AssignmentTemplate | ASSIGNMENT |

---

#### 24. CourseSession
> 차수 — 과정 운영 단위. COHORT(기수제) 또는 SELF_PACED(자유수강).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| name | varchar | 예: "2025 1기" |
| type | enum | SELF_PACED / COHORT |
| cohort_number | int? | COHORT 기수 번호 |
| start_date | date? | COHORT 전용 |
| end_date | date? | COHORT 전용 |
| capacity | int | 0 = 무제한 |
| enrolled | int | 캐시 (실제는 Enrollment COUNT) |
| status | enum | DRAFT / OPEN / ONGOING / CLOSED |
| visible | boolean | 학습자 목록 노출 여부 |
| for_sale | boolean | B2C 판매 노출 여부 |
| location | varchar? | 오프라인 전용 |
| completion_threshold | int | 수료 기준 진도율 (%) |
| min_enrollment | int? | 최소 수강 인원 (NULL = 체크 안 함) |
| target_departments | varchar[]? | 수강 대상 부서 필터 |
| target_job_grades | varchar[]? | 수강 대상 직급 필터 |
| target_sites | varchar[]? | 수강 대상 사업장 필터 |
| pre_exam_template_id | UUID? FK → ExamTemplate | 수강 전 진단 시험 |
| final_exam_template_id | UUID? FK → ExamTemplate | 수료 조건 시험 |
| pre_survey_template_id | UUID? FK → SurveyTemplate | 수강 전 설문 |
| post_survey_template_id | UUID? FK → SurveyTemplate | 수료 후 설문 |
| pre_assignment_template_id | UUID? FK → AssignmentTemplate | 수강 전 과제 |
| post_assignment_template_id | UUID? FK → AssignmentTemplate | 수료 후 과제 |

> 설계 노트: `target_*` 3개 배열 컬럼 — 단순 필터링용, 별도 pivot 테이블 불필요.
> 평가 FK 6개 — CourseSession 컬럼으로 유지.

---

#### 25. CourseSessionInstructor [pivot]
> CourseSession ↔ User(강사) N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| session_id | UUID FK → CourseSession | composite PK |
| user_id | UUID FK → User | composite PK (INSTRUCTOR 역할) |
| order | int | 강사 표시 순서 |

---

### 🟡 오프라인 & 출결 — 노랑 `#EAB308`

#### 26. OfflineSession
> 오프라인 회차 (일차 수업). CourseSession 1개에 여러 회차.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_session_id | UUID FK → CourseSession | |
| day_num | int | 몇 번째 회차 |
| date | date | |
| start_time | time | |
| end_time | time | |
| location | varchar | |
| max_capacity | int | |
| status | enum | SCHEDULED / COMPLETED / CANCELLED |

---

#### 27. AttendanceRecord
> 오프라인 회차별 수강생 출석 기록.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| offline_session_id | UUID FK → OfflineSession | |
| learner_id | UUID FK → User | |
| status | enum | PRESENT / LATE / ABSENT / EXCUSED |
| method | enum | QR / MANUAL |
| checked_at | timestamptz? | QR 체크인 시각 (MANUAL은 NULL) |

---

### 🟤 수강 — 보라 `#8B5CF6`

#### 28. Enrollment
> 수강 신청. 진도율 요약 포함 (빠른 조회용).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| user_id | UUID FK → User | |
| course_session_id | UUID FK → CourseSession | |
| status | enum | ACTIVE / COMPLETED / CANCELLED / EXPIRED |
| progress | int | 진도율 % (요약 캐시) |
| enrolled_at | timestamptz | |
| last_studied_at | timestamptz? | |

---

### 🩷 학습 이력 — 핑크 `#EC4899`

#### 29. LessonCompletion
> 레슨별 완료 기록. Enrollment.progress 업데이트 트리거.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| activity_id | UUID FK → Activity | |
| course_session_id | UUID FK → CourseSession | |
| completed_at | timestamptz | |
| duration_sec | int | 실제 학습 소요 시간 (초) |

---

#### 30. ExamAttempt
> 시험 응시 기록. 재시험 시 attempt_number 증가.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| exam_template_id | UUID FK → ExamTemplate | |
| course_session_id | UUID FK → CourseSession | |
| attempt_number | int | 몇 번째 시도 |
| score | int | 점수 |
| passed | boolean | |
| submitted_at | timestamptz | |
| duration_sec | int? | 소요 시간 (초) |

---

#### 31. AssignmentSubmission
> 과제 제출 기록. 강사 채점/피드백 포함.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| assignment_template_id | UUID FK → AssignmentTemplate | |
| course_session_id | UUID FK → CourseSession | |
| submitted_at | timestamptz | |
| file_url | varchar? | 파일 제출 CDN URL |
| text_content | text? | 텍스트 제출 내용 |
| grade | int? | 채점 점수 |
| feedback | text? | 강사 피드백 |
| graded_at | timestamptz? | |
| graded_by | UUID? FK → User | 채점 강사 |

---

#### 32. SurveyResponse
> 설문 응답 헤더. 실제 응답 내용은 SurveyAnswer에 분리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| survey_template_id | UUID FK → SurveyTemplate | |
| course_session_id | UUID FK → CourseSession | |
| submitted_at | timestamptz | |
| anonymous | boolean | 익명 응답 여부 |

---

#### 33. SurveyAnswer
> 설문 응답 상세 (문항별 응답값). 집계 쿼리 효율을 위해 SurveyResponse에서 분리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| response_id | UUID FK → SurveyResponse | |
| question_id | UUID FK → BankQuestion | |
| value | text | 선택지 ID 또는 텍스트 응답 |

---

#### 34. LearningEvent [append-only]
> xAPI verb 기반 학습 이벤트 로그. Layer 3 Audit. 삭제/수정 없음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| learner_id | UUID FK → User | |
| verb | enum | ENROLLED / LESSON_STARTED / LESSON_COMPLETED / VIDEO_WATCHED / EXAM_SUBMITTED / ASSIGNMENT_SUBMITTED / SURVEY_SUBMITTED / COURSE_COMPLETED / CERTIFICATE_ISSUED |
| object_type | enum | LESSON / EXAM / ASSIGNMENT / COURSE / SESSION |
| object_id | UUID | 대상 엔티티 ID |
| object_title | varchar? | 스냅샷 (변경 후에도 이력 보존) |
| result_score | int? | 시험 점수 |
| result_passed | boolean? | 합격 여부 |
| result_duration_sec | int? | 소요 시간 |
| result_progress | int? | 진도율 % |
| timestamp | timestamptz | |
| session_id | UUID? FK → CourseSession | |
| course_id | UUID? FK → Course | |

---

### 🟠 평가 & 문항은행 — 호박 `#F59E0B`

#### 35. BankQuestion
> 문항 원본. EXAM과 SURVEY 공용 뱅크. tags로 CompositionRule과 연결.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| kind | enum | EXAM / SURVEY |
| type | enum | SINGLE / MULTIPLE / TRUE_FALSE / SHORT (EXAM) / LIKERT / TEXT (SURVEY) |
| text | text | 문항 내용 |
| answer | text? | SHORT 모범답안 |
| scale | int? | LIKERT 척도 (5점, 7점 등) |
| tags | varchar[] | CompositionRule.tag_filter와 매칭 |
| created_at | timestamptz | |

---

#### 36. BankQuestionOption
> 객관식 선택지. BankQuestion에서 분리하여 CRUD 독립적으로 관리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| question_id | UUID FK → BankQuestion | |
| text | varchar | 선택지 텍스트 |
| correct | boolean? | EXAM 전용. SURVEY는 NULL |
| order | int | 선택지 순서 |

---

#### 37. ExamTemplate
> 시험 템플릿. CompositionRule 목록으로 문항 구성 정의.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| sub_type | enum | SHORT (단답형 퀴즈) / FINAL (수료 시험) |
| passing_score | int | 합격 기준 점수 |
| time_limit | int? | 분 단위 (NULL = 무제한) |
| max_attempts | int? | 최대 응시 횟수 (NULL = 무제한) |
| usage_count | int | 사용 차수 수 (캐시) |
| created_at | timestamptz | |

---

#### 38. SurveyTemplate
> 설문 템플릿. 수강 전/후 설문, 수동 발송 등에 활용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| anonymous | boolean | 익명 응답 여부 |
| trigger_type | enum | MANUAL / COURSE_COMPLETE |
| response_count | int | 누적 응답 수 (캐시) |
| status | enum | ACTIVE / CLOSED |
| created_at | timestamptz | |

---

#### 39. CompositionRule
> 문항 구성 규칙. tag 기반으로 BankQuestion에서 랜덤 추출. ExamTemplate/SurveyTemplate 공용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| template_id | UUID FK | ExamTemplate 또는 SurveyTemplate (polymorphic) |
| template_kind | enum | EXAM / SURVEY |
| label | varchar | 규칙 이름 (예: "React 기초 문항") |
| tag_filter | varchar[] | 필터링할 태그 목록 |
| count | int | 추출할 문항 수 |
| shuffle | boolean | 문항 순서 무작위화 |
| order | int | 규칙 순서 |

---

#### 40. AssignmentTemplate
> 과제 템플릿. 제출 방식(파일/텍스트/둘 다)과 채점 기준표 포함.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| instructions | text | 과제 안내문 |
| submission_type | enum | FILE / TEXT / BOTH |
| usage_count | int | |
| created_at | timestamptz | |

---

#### 41. RubricItem
> 과제 채점 기준 항목.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| assign_template_id | UUID FK → AssignmentTemplate | |
| criteria | varchar | 채점 기준명 |
| points | int | 배점 |
| order | int | |

---

### 🏅 수료증 — 황금 `#D97706`

#### 42. CertTemplate
> 수료증 템플릿. HTML 기반 + 변수 치환 (`{{recipientName}}` 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| active | boolean | 기본 템플릿 여부 |
| validity_years | int? | NULL = 무기한 유효 |
| background_image_url | varchar? | CDN URL |
| html_template | text | `{{변수}}` 포함 HTML |

---

#### 43. IssuedCert
> 실제 발급된 수료증. publicToken으로 외부 URL 검증.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| cert_number | varchar UNIQUE | 사람이 읽을 수 있는 일련번호 |
| public_token | UUID UNIQUE | 공개 URL 검증용 (외부 노출) |
| user_id | UUID FK → User | 수령인 |
| course_id | UUID FK → Course | |
| session_id | UUID FK → CourseSession | |
| template_id | UUID FK → CertTemplate | |
| status | enum | VALID / REVOKED / EXPIRED |
| issued_at | timestamptz | |
| expired_at | timestamptz? | NULL = 영구 유효 |
| reissued_at | timestamptz? | |
| revoked_at | timestamptz? | |
| revoked_reason | text? | |
| revoked_by | UUID? FK → User | |

---

### 🩶 미디어 라이브러리 — 슬레이트 `#64748B`

#### 44. MediaAsset
> 미디어 파일 메타데이터. CDN 업로드 후 상태 추적.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| display_name | varchar | |
| original_name | varchar | 업로드 시 원본 파일명 |
| mime_type | varchar | |
| asset_type | enum | VIDEO / PDF / IMAGE / SCORM |
| size_bytes | bigint | |
| status | enum | PENDING / VALIDATING / PROCESSING / ACTIVE / ERROR |
| cdn_base_url | varchar? | |
| launch_href | varchar? | SCORM 진입점 경로 |
| scorm_version | enum? | '1.2' / '2004' |
| error_message | text? | |
| tags | varchar[] | |
| uploaded_at | timestamptz | |

---

#### 45. MediaAssetLinkedCourse [pivot]
> MediaAsset ↔ Course 다대다 연결. Activity에서 참조 중인 과정 추적.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| media_asset_id | UUID FK → MediaAsset | composite PK |
| course_id | UUID FK → Course | composite PK |

---

### 💚 결제 — 라임 `#65A30D`

#### 46. Payment
> 결제 내역. B2C 전용. B2B는 Payment 레코드 없음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| order_number | varchar UNIQUE | PG사 주문번호 |
| user_id | UUID FK → User | |
| course_session_id | UUID FK → CourseSession | |
| amount | int | KRW |
| status | enum | PAID / REFUNDED / CANCELLED |
| paid_at | timestamptz | |
| refunded_at | timestamptz? | |

---

### 🌸 B2C 전용 — 로즈 `#F43F5E`

#### 47. Cart
> 장바구니. B2C 학습자가 CourseSession을 담아두는 임시 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| course_session_id | UUID FK → CourseSession | composite PK |
| added_at | timestamptz | |

---

#### 48. Wishlist
> 위시리스트. B2C 학습자가 관심 Course를 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| course_id | UUID FK → Course | composite PK |
| added_at | timestamptz | |

---

### 🟣 메시징 & 크레딧 — 자주 `#A855F7`

#### 49. MessageTemplate
> 메시지 템플릿. SMS/EMAIL/KAKAO 채널별로 분리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| channel | enum | SMS / EMAIL / KAKAO |
| subject | varchar? | EMAIL 제목 |
| content | text | 본문 (`{{변수}}` 포함) |
| variables | varchar[] | 사용된 변수 목록 |
| char_count | int? | SMS 전용 글자 수 |
| kakao_code | varchar? | 카카오 알림톡 코드 |
| kakao_approval | enum? | APPROVED / PENDING / REJECTED |
| tags | varchar[]? | |
| created_at | timestamptz | |

---

#### 50. MessageHistory
> 발송 이력. 개별 수신자 기록은 별도 테이블로 확장 가능.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| template_id | UUID? FK → MessageTemplate | NULL = 직접 발송 |
| sent_at | timestamptz | |
| channel | enum | SMS / EMAIL / KAKAO |
| subject | varchar? | |
| preview | text | 발송 내용 일부 |
| recipient_count | int | |
| status | enum | SENT / FAILED / SCHEDULED |

---

#### 51. AutomationRule
> 자동화 규칙. 트리거 이벤트 발생 시 지정 채널로 자동 발송.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| trigger | enum | ENROLLMENT_CREATED / COURSE_COMPLETED / ASSIGNMENT_DUE_D3 / SESSION_REMINDER_1H / CERTIFICATE_ISSUED / ACCOUNT_INVITED |
| channel | enum | SMS / EMAIL / KAKAO |
| template_id | UUID FK → MessageTemplate | |
| active | boolean | |

---

#### 52. ChannelConfig ⚠️
> 발송 채널 자격증명. API 키 암호화 저장 필수. Tenant 1:1.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| sms_sender_number | varchar? | |
| sms_api_key | varchar? | **암호화 저장** |
| sms_connected | boolean | |
| email_sender | varchar? | |
| email_smtp_host | varchar? | |
| email_smtp_port | int? | |
| email_connected | boolean | |
| kakao_channel_id | varchar? | |
| kakao_channel_key | varchar? | **암호화 저장** |
| kakao_connected | boolean | |

---

#### 53. CreditLedger [append-only]
> 크레딧 원장. 충전(TOPUP/GRANT)과 사용(USAGE) 전체 이력. 삭제/수정 없음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| channel | enum? | SMS / EMAIL / KAKAO (TOPUP/GRANT는 NULL) |
| type | enum | TOPUP / GRANT / USAGE |
| amount | int | 양수 = 충전/지급, 음수 = 사용 |
| description | varchar | |
| created_at | timestamptz | |

---

#### 54. CreditPool
> 테넌트 크레딧 풀 설정 + 잔액 캐시. CreditLedger SUM으로 재계산 가능.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| balance | int | 현재 잔액 (캐시) |
| auto_topup | boolean | 자동 충전 여부 |
| auto_topup_threshold | int? | 잔액 N 이하 시 충전 |
| auto_topup_amount | int? | 자동 충전 크레딧 수 |

---

### ☁️ 공지 — 하늘 `#0EA5E9`

#### 55. Announcement
> 공지사항. 전체(ALL) 또는 특정 과정(COURSE) 대상으로 발송.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| type | enum | ANNOUNCEMENT / SYSTEM_NOTICE |
| target | enum | ALL / COURSE |
| target_course_id | UUID? FK → Course | COURSE 대상 시 |
| content | text? | 본문 |
| sent_at | timestamptz? | NULL = 미발송/임시저장 |
| views | int | 조회수 (캐시) |

---

## 설계 노트

### embedded 컬럼으로 유지한 것들 (별도 테이블 불필요)
| 항목 | 위치 | 이유 |
|------|------|------|
| CertConfig 4개 컬럼 | Course | 1:1, 쿼리 단순 |
| targetAudience 3개 배열 컬럼 | CourseSession | 단순 필터, JOIN 불필요 |
| 평가 FK 6개 컬럼 | CourseSession | FK 참조만 필요 |
| TenantSsoConfig | **별도 테이블 분리** | 민감정보, 독립 CRUD |

### 별도 테이블로 정규화한 것들
| 항목 | 이유 |
|------|------|
| BankQuestionOption | 선택지 독립 CRUD, 집계 쿼리 |
| CourseSessionInstructor | User FK 필요 (string[] 탈피) |
| SurveyAnswer | 문항별 집계 쿼리 효율 |
| MediaAssetLinkedCourse | 다대다 명시 필요 |

### B2C / B2B 공통 전략
- 모든 테이블은 B2C/B2B 공용. UI만 context에 따라 hide.
- `Course.price`: B2B 테넌트 = NULL
- `Payment`, `Cart`, `Wishlist`: B2B에도 테이블 존재하나 UI hide

### 3-레이어 감사 구조
```
Layer 1 — AccessLog          : 로그인/로그아웃 이력
Layer 2 — TenantAuditLog     : 관리자 데이터 변경 이력
          PlatformAuditLog   : 플랫폼 운영자 테넌트 관리 이력
Layer 3 — LearningEvent      : 학습자 학습 활동 이벤트 (xAPI verb)
```
