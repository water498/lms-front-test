# LMS 전체 테이블 목록 — FigJam 레퍼런스

> **용도:** 서버 DB 모델링 전 전체 테이블 점검용. FigJam에서 도메인별 색상 카드로 배치할 것.
> **기준:** `src/lib/models.ts` + 각 feature `mockData.ts` / `store.ts` 전수 탐색 결과
> **총계:** 71개 테이블 / 19개 도메인

---

## 도메인 색상 가이드

| # | 도메인 | FigJam 색상 | HEX | 테이블 수 |
|---|--------|------------|-----|---------|
| 1 | 플랫폼 운영 | 인디고 | `#6366F1` | 3 |
| 2 | 테넌트 | 파랑 | `#3B82F6` | 3 |
| 3 | 조직 구조 | 청록 | `#14B8A6` | 4 |
| 4 | 포털 | 에메랄드 | `#10B981` | 4 |
| 5 | 사용자 & 인증 | 초록 | `#22C55E` | 6 |
| 6 | 감사 로그 | 빨강 | `#EF4444` | 1 |
| 7 | 학습 콘텐츠 | 주황 | `#F97316` | 9 |
| 8 | SCORM | 황토 | `#D97706` | 2 |
| 9 | 오프라인 & 출결 | 노랑 | `#EAB308` | 2 |
| 10 | 수강 | 보라 | `#8B5CF6` | 2 |
| 11 | 학습 이력 | 핑크 | `#EC4899` | 7 |
| 12 | 평가 & 문항은행 | 호박 | `#F59E0B` | 7 |
| 13 | 수료증 | 황금 | `#B45309` | 2 |
| 14 | 미디어 라이브러리 | 슬레이트 | `#64748B` | 1 |
| 15 | 결제 | 라임 | `#65A30D` | 4 |
| 16 | B2C 전용 | 로즈 | `#F43F5E` | 4 |
| 17 | 코스 묶음 | 시안 | `#06B6D4` | 2 |
| 18 | 메시징 & 크레딧 | 자주 | `#A855F7` | 7 |
| 19 | 조직 공지 | 하늘 | `#0EA5E9` | 1 |

---

## 전체 테이블 한눈에 보기

```
🟣 플랫폼 운영 (3)           🔵 테넌트 (3)
  1  PlatformSetting          4  Tenant
  2  PlatformAuditLog          5  TenantInfra
  3  PlanConfig                6  TenantSsoConfig ⚠️

🩵 조직 구조 (4)             🟢 포털 (4)
  7  OrgSite                 11  PortalBanner
  8  OrgTeam (self-ref)      12  LegalDocument
  9  OrgPosition             13  PortalAnnouncement
 10  OrgSetting              14  UserAgreement

🟩 사용자 & 인증 (6)         🔴 감사 로그 (1)
 15  User                    21  TenantAuditLog
 16  UserGroup
 17  UserGroupMember [pivot]
 18  UserAccessLog
 19  UserInvitation
 20  Notification

🟠 학습 콘텐츠 (9)           🟡 오프라인 & 출결 (2)
 22  CourseCategory          31  OfflineSession
 23  Course                  32  OfflineAttendance
 24  CancellationPolicy
 25  CancellationRule
 26  CourseSubject
 27  CourseActivity
 28  CourseSession
 29  CourseSessionInstructor [pivot]
 30  CoursePrerequisite

🟫 SCORM (2)                 🟤 수강 (2)
 33  ScormSco                35  Enrollment
 34  ScormRuntime            36  WaitList

🩷 학습 이력 (7)             🟠 평가 & 문항은행 (7)
 37  ActivityCompletion      44  QuestionBank
 38  ExamAttempt             45  QuestionBankOption
 39  AssignmentSubmission    46  ExamTemplate
 40  SurveyResponse          47  SurveyTemplate
 41  SurveyAnswer            48  CompositionRule
 42  ActivityLog [append-only] 49 AssignmentTemplate
 43  VideoProgress           50  RubricItem

🏅 수료증 (2)                🩶 미디어 (1)
 51  CertificateTemplate     53  MediaAsset
 52  IssuedCertificate

💚 결제 (4)                  🌸 B2C 전용 (4)
 54  Order                   58  Cart
 55  OrderItem               59  Wishlist
 56  Payment                 60  Coupon
 57  PaymentRefund           61  CourseReview

🔷 코스 묶음 (2)             🟣 메시징 & 크레딧 (7)
 62  LearningPath            64  MessageTemplate
 63  LearningPathCourse      65  MessageHistory
                             66  MessageEventRule
                             67  MessageConfig ⚠️
                             68  CreditTransaction [append-only]
                             69  CreditBalance
                             70  CreditServiceRate

☁️ 조직 공지 (1)
 71  OrgAnnouncement
```

---

## 각 테이블 상세

---

### 🟣 플랫폼 운영 — 인디고 `#6366F1`

#### 1. PlatformSetting
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

#### 7. OrgSite
> 사업장 (서울 본사, 부산 지점 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |

---

#### 8. OrgTeam
> 부서. parent_id self-ref로 무한 depth 트리 구조.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| parent_id | UUID? FK → OrgTeam | NULL = 최상위 |
| order | int | 같은 레벨 내 정렬 순서 |

---

#### 9. OrgPosition
> 직급 (사원/대리/과장 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| order | int | 직급 순서 (낮은 값 = 하위 직급) |

---

#### 10. OrgSetting
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

#### 13. PortalAnnouncement
> 학습자 포털 공지사항 (learner-facing view).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| type | enum | 공지 / 이벤트 / 업데이트 |
| date | date | 공지 날짜 |
| is_new | boolean | 신규 표시 여부 |

> 설계 노트: OrgAnnouncement(관리자 생성 엔티티)의 view/read model. 직접 테이블 또는 derived view로 구현 가능.

---

#### 14. UserAgreement
> 사용자의 이용약관/개인정보처리방침 동의 이력.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → User | |
| legal_document_id | UUID FK → LegalDocument | |
| version | int | 동의한 버전 |
| agreed_at | timestamptz | |
| ip | varchar? | 동의 시점 IP |

---

### 🟩 사용자 & 인증 — 초록 `#22C55E`

#### 15. User
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
| site_id | UUID? FK → OrgSite | |
| department_id | UUID? FK → OrgTeam | |
| job_grade_id | UUID? FK → OrgPosition | |
| auth_provider | enum | LOCAL / SSO |
| idp_managed_fields | varchar[]? | SSO only. IdP 관리 필드 목록 (`name`/`email`/`avatar`) |
| avatar_url | varchar? | |
| joined_at | timestamptz | |
| last_login_at | timestamptz? | |

> ⚠️ **SSO 주의:** `idp_managed_fields`에 포함된 필드는 LMS에서 편집 불가. 다음 SSO 로그인 시 IdP 값으로 덮어씌워짐.

---

#### 16. UserGroup
> 테넌트 내 임의 그룹. 수강 일괄 배정, 공지 대상 지정 등에 활용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| name | varchar | |
| description | text? | |
| created_at | timestamptz | |

---

#### 17. UserGroupMember [pivot]
> User ↔ UserGroup N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| group_id | UUID FK → UserGroup | composite PK |
| added_at | timestamptz | |

---

#### 18. UserAccessLog
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

#### 19. UserInvitation
> 관리자가 사용자를 초대한 이력.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| email | varchar | 초대 대상 이메일 |
| role | enum | LEARNER / INSTRUCTOR / ORG_ADMIN |
| invited_by | varchar | 초대자 이름 (스냅샷) |
| invited_at | timestamptz | |
| status | enum | PENDING / ACCEPTED / EXPIRED |
| expires_at | timestamptz | |

---

#### 20. Notification
> 사용자 알림 (수강 등록, 수료증 발급, 시험 결과 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| user_id | UUID FK → User | |
| type | enum | ENROLLMENT / CERT_ISSUED / EXAM_RESULT / ANNOUNCEMENT / SYSTEM |
| title | varchar | |
| body | text | |
| read | boolean | 읽음 여부 |
| created_at | timestamptz | |
| link_url | varchar? | 관련 페이지 URL |

---

### 🔴 감사 로그 — 빨강 `#EF4444`

#### 21. TenantAuditLog
> 테넌트 관리자(ORG_ADMIN)의 데이터 변경 작업 이력. Layer 2 Audit.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| timestamp | timestamptz | |
| actor_id | UUID FK → User | |
| actor | varchar | 작업자 이름 (스냅샷) |
| action | enum | ENROLLMENT_CANCEL / ENROLLMENT_CREATE / COURSE_CREATE / COURSE_UPDATE / USER_ROLE_CHANGE / ORG_STRUCTURE_UPDATE / SETTINGS_UPDATE / CERT_ISSUE |
| target | varchar | 대상 설명 |
| detail | text | 변경 내용 요약 |

---

### 🟠 학습 콘텐츠 — 주황 `#F97316`

#### 22. CourseCategory
> 과정 카테고리 (개발/디자인/비즈니스 등).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| label | varchar | 표시명 |
| order | int | |

---

#### 23. Course
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
| cert_template_id | UUID? FK → CertificateTemplate | 수료증 템플릿 |
| cert_completion_rate | int? | 수료 기준 진도율 (%) |
| cert_require_exam | boolean | 수료 조건 시험 필수 여부 |
| cert_auto_issue | boolean | 수료증 자동 발급 여부 |
| created_at | timestamptz | |

> 설계 노트: `cert_*` 4개 컬럼은 CertConfig embedded 처리 (1:1 관계, 별도 테이블 불필요)

---

#### 24. CancellationPolicy
> 과정별 환불 정책 헤더.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| course_id | UUID PK FK → Course | 1:1 |
| no_refund_after_start | boolean | 수강 시작 후 환불 불가 여부 |

---

#### 25. CancellationRule
> 환불 정책 세부 규칙.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| days_before_start | int | N일 이상 전 취소 시 적용 |
| refund_pct | int | 환불 비율 0~100 |

---

#### 26. CourseSubject
> 커리큘럼 챕터. Course → CourseSubject(챕터) → CourseActivity(콘텐츠) 트리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| title | varchar | |
| order | int | |

---

#### 27. CourseActivity
> 콘텐츠 단위 (VIDEO/SCORM/QUIZ/ASSIGNMENT).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| subject_id | UUID FK → CourseSubject | |
| title | varchar | |
| type | enum | VIDEO / SCORM / QUIZ / ASSIGNMENT |
| order | int | Subject 내 순서 |
| duration | int? | 분 단위 (VIDEO) |
| question_count | int? | QUIZ / ASSIGNMENT |
| media_asset_id | UUID? FK → MediaAsset | VIDEO / SCORM |
| exam_template_id | UUID? FK → ExamTemplate | QUIZ |
| assign_template_id | UUID? FK → AssignmentTemplate | ASSIGNMENT |
| survey_template_id | UUID? FK → SurveyTemplate | SURVEY 활동 (기존 누락) |

---

#### 28. CourseSession
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

---

#### 29. CourseSessionInstructor [pivot]
> CourseSession ↔ User(강사) N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| session_id | UUID FK → CourseSession | composite PK |
| user_id | UUID FK → User | composite PK (INSTRUCTOR 역할) |
| order | int | 강사 표시 순서 |

---

#### 30. CoursePrerequisite
> 과정 선수 조건. A 과정 수강 전에 B 과정을 완료해야 하는 경우 사용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| course_id | UUID FK → Course | composite PK (수강할 과정) |
| prerequisite_course_id | UUID FK → Course | composite PK (먼저 이수할 과정) |
| required_completion | boolean | true = 수료 필수, false = 수강 이력만 |

---

### 🟡 오프라인 & 출결 — 노랑 `#EAB308`

#### 31. OfflineSession
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

#### 32. OfflineAttendance
> 오프라인 회차별 수강생 출석 기록.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| offline_session_id | UUID FK → OfflineSession | |
| learner_id | UUID FK → User | |
| learner_name | varchar | 스냅샷 |
| status | enum | PRESENT / LATE / ABSENT / EXCUSED |
| method | enum | QR / MANUAL |
| checked_at | timestamptz? | QR 체크인 시각 (MANUAL은 NULL) |

---

### 🟫 SCORM — 황토 `#D97706`

#### 33. ScormSco
> SCORM 패키지 내 SCO (Shareable Content Object) 단위.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| media_asset_id | UUID FK → MediaAsset | SCORM 패키지 |
| identifier | varchar | imsmanifest.xml의 SCO identifier |
| title | varchar | |
| launch_href | varchar | 실행 경로 |
| order | int | 순서 |

---

#### 34. ScormRuntime
> SCORM 런타임 상태. 학습자별 SCO 진행 상태를 LMS가 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| enrollment_id | UUID FK → Enrollment | |
| sco_id | UUID FK → ScormSco | |
| learner_id | UUID FK → User | |
| lesson_status | enum | not attempted / incomplete / completed / passed / failed |
| suspend_data | text? | 이어하기 데이터 |
| score_raw | float? | |
| score_min | float? | |
| score_max | float? | |
| session_time | varchar? | HH:MM:SS |
| total_time | varchar? | 누적 학습 시간 |
| updated_at | timestamptz | |

---

### 🟤 수강 — 보라 `#8B5CF6`

#### 35. Enrollment
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
| payment_id | UUID? FK → Payment | B2C 결제 연결 |
| expires_at | timestamptz? | 수강 만료일 (자유수강 기간제) |
| completed_at | timestamptz? | 수료 완료일 |
| source | enum? | SELF / ADMIN_ASSIGNED / PAYMENT |

---

#### 36. WaitList
> 수강 대기. 정원 초과 시 대기 목록에 등록.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_session_id | UUID FK → CourseSession | |
| user_id | UUID FK → User | |
| user_name | varchar | 스냅샷 |
| requested_at | timestamptz | |
| status | enum | WAITING / APPROVED / CANCELLED |

---

### 🩷 학습 이력 — 핑크 `#EC4899`

#### 37. ActivityCompletion
> 액티비티별 완료 기록. Enrollment.progress 업데이트 트리거.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| activity_id | UUID FK → CourseActivity | |
| course_session_id | UUID FK → CourseSession | |
| completed_at | timestamptz | |
| duration_sec | int | 실제 학습 소요 시간 (초) |

---

#### 38. ExamAttempt
> 시험 응시 기록. 재시험 시 별도 레코드 추가.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| learner_id | UUID FK → User | |
| exam_template_id | UUID FK → ExamTemplate | |
| course_session_id | UUID FK → CourseSession | |
| score | int | 점수 |
| passed | boolean | |
| submitted_at | timestamptz | |
| duration_sec | int? | 소요 시간 (초) |

---

#### 39. AssignmentSubmission
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

#### 40. SurveyResponse
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

#### 41. SurveyAnswer
> 설문 응답 상세 (문항별 응답값).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| response_id | UUID FK → SurveyResponse | |
| question_id | UUID FK → QuestionBank | |
| value | text | 선택지 ID 또는 텍스트 응답 |

---

#### 42. ActivityLog [append-only]
> xAPI verb 기반 학습 이벤트 로그. Layer 3 Audit. 삭제/수정 없음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| learner_id | UUID FK → User | |
| verb | enum | ENROLLED / ACTIVITY_STARTED / ACTIVITY_COMPLETED / VIDEO_WATCHED / EXAM_SUBMITTED / ASSIGNMENT_SUBMITTED / SURVEY_SUBMITTED / COURSE_COMPLETED / CERTIFICATE_ISSUED |
| object_type | enum | ACTIVITY / EXAM / ASSIGNMENT / COURSE / SESSION |
| object_id | UUID | 대상 엔티티 ID |
| object_title | varchar? | 스냅샷 |
| result_score | int? | 시험 점수 |
| result_passed | boolean? | 합격 여부 |
| result_duration_sec | int? | 소요 시간 |
| result_progress | int? | 진도율 % |
| timestamp | timestamptz | |
| session_id | UUID? FK → CourseSession | |
| course_id | UUID? FK → Course | |

---

#### 43. VideoProgress
> 동영상 시청 진행 기록. 이어보기 구현에 활용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| enrollment_id | UUID FK → Enrollment | |
| activity_id | UUID FK → CourseActivity | |
| learner_id | UUID FK → User | |
| watched_sec | int | 시청한 총 시간 (초) |
| total_sec | int | 영상 전체 길이 (초) |
| last_position | int | 마지막 재생 위치 (초) |
| completed | boolean | 시청 완료 여부 |
| updated_at | timestamptz | |

---

### 🟠 평가 & 문항은행 — 호박 `#F59E0B`

#### 44. QuestionBank
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

#### 45. QuestionBankOption
> 객관식 선택지. QuestionBank에서 분리하여 CRUD 독립적으로 관리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| question_id | UUID FK → QuestionBank | |
| text | varchar | 선택지 텍스트 |
| correct | boolean? | EXAM 전용. SURVEY는 NULL |
| order | int | 선택지 순서 |

---

#### 46. ExamTemplate
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

#### 47. SurveyTemplate
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

#### 48. CompositionRule
> 문항 구성 규칙. tag 기반으로 QuestionBank에서 랜덤 추출.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| template_id | UUID FK | ExamTemplate 또는 SurveyTemplate (polymorphic) |
| template_kind | enum | EXAM / SURVEY |
| label | varchar | 규칙 이름 |
| tag_filter | varchar[] | 필터링할 태그 목록 |
| count | int | 추출할 문항 수 |
| shuffle | boolean | 문항 순서 무작위화 |
| order | int | 규칙 순서 |

---

#### 49. AssignmentTemplate
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

#### 50. RubricItem
> 과제 채점 기준 항목.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| assign_template_id | UUID FK → AssignmentTemplate | |
| criteria | varchar | 채점 기준명 |
| points | int | 배점 |
| order | int | |

---

### 🏅 수료증 — 황금 `#B45309`

#### 51. CertificateTemplate
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

#### 52. IssuedCertificate
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
| template_id | UUID FK → CertificateTemplate | |
| status | enum | VALID / REVOKED / EXPIRED |
| issued_at | timestamptz | |
| expired_at | timestamptz? | NULL = 영구 유효 |
| reissued_at | timestamptz? | |
| revoked_at | timestamptz? | |
| revoked_reason | text? | |
| revoked_by | UUID? FK → User | |

---

### 🩶 미디어 라이브러리 — 슬레이트 `#64748B`

#### 53. MediaAsset
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

> 설계 노트: `MediaAssetLinkedCourse` pivot 테이블 제거. CourseActivity → MediaAsset 체인으로 역추적 가능.

---

### 💚 결제 — 라임 `#65A30D`

#### 54. Order
> 주문 헤더. 쿠폰 적용 및 결제 상태 추적의 기준 단위.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| order_number | varchar UNIQUE | 사람이 읽는 주문번호 (OK-20260320-A4F2) |
| user_id | UUID FK → User | |
| coupon_id | UUID? FK → Coupon | 적용 쿠폰 |
| subtotal_amount | int | 할인 전 금액 (KRW) |
| discount_amount | int | 쿠폰 등 할인액 |
| total_amount | int | 실 결제 금액 |
| status | enum | PENDING / PAID / CANCELLED / REFUNDED |
| created_at | timestamptz | |
| paid_at | timestamptz? | |

---

#### 55. OrderItem
> 주문 라인 아이템. Order ↔ Course N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| order_id | UUID FK → Order | |
| course_id | UUID FK → Course | |
| unit_price | int | 결제 시점 가격 (이후 변경 불영향) |
| discount_amount | int | 해당 아이템 할인액 |
| final_price | int | unit_price - discount_amount |

---

#### 56. Payment
> 결제 내역. B2C 전용. B2B는 Payment 레코드 없음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| order_id | UUID FK → Order | |
| user_id | UUID FK → User | |
| amount | int | KRW |
| status | enum | PAID / REFUNDED / CANCELLED |
| pg_provider | enum? | TOSS / IAMPORT / KCP / NICEPAY |
| pg_tid | varchar? | PG사 거래번호 |
| payment_method | enum? | CARD / BANK_TRANSFER / KAKAO_PAY / NAVER_PAY |
| receipt_url | varchar? | |
| paid_at | timestamptz | |

---

#### 57. PaymentRefund
> 환불 내역. Payment에서 분리하여 부분 환불 이력 관리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| payment_id | UUID FK → Payment | |
| amount | int | 환불 금액 |
| reason | text | 환불 사유 |
| refunded_at | timestamptz | |
| refunded_by | varchar | 처리자 이름 (스냅샷) |

---

### 🌸 B2C 전용 — 로즈 `#F43F5E`

#### 58. Cart
> 장바구니. B2C 학습자가 CourseSession을 담아두는 임시 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| course_session_id | UUID FK → CourseSession | composite PK |
| added_at | timestamptz | |

---

#### 59. Wishlist
> 위시리스트. B2C 학습자가 관심 Course를 저장.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| user_id | UUID FK → User | composite PK |
| course_id | UUID FK → Course | composite PK |
| added_at | timestamptz | |

---

#### 60. Coupon
> 할인 쿠폰. B2C 결제 시 적용.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| code | varchar UNIQUE | |
| discount_type | enum | AMOUNT / PERCENT |
| discount_value | int | 할인액 또는 할인율 |
| max_uses | int? | NULL = 무제한 |
| used_count | int | |
| expires_at | timestamptz? | NULL = 무기한 |
| applicable_course_ids | varchar[] | 빈 배열 = 전체 과정 적용 |
| created_at | timestamptz | |

---

#### 61. CourseReview
> 과정 수강 후기. B2C 학습자가 작성.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| course_id | UUID FK → Course | |
| user_id | UUID FK → User | |
| user_name | varchar | 스냅샷 |
| rating | int | 1~5 |
| body | text | 후기 내용 |
| created_at | timestamptz | |
| visible | boolean | 관리자 노출 여부 |

---

### 🔷 코스 묶음 — 시안 `#06B6D4`

#### 62. LearningPath
> 여러 과정을 묶은 코스 묶음 (학습 패키지).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| tenant_id | UUID FK → Tenant | |
| title | varchar | |
| description | text? | |
| thumbnail_url | varchar? | CDN URL |
| price | int? | B2C 전용 번들 가격 |
| status | enum | PUBLISHED / DRAFT |
| created_at | timestamptz | |

---

#### 63. LearningPathCourse [pivot]
> LearningPath ↔ Course N:M.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| learning_path_id | UUID FK → LearningPath | composite PK |
| course_id | UUID FK → Course | composite PK |
| order | int | 코스 묶음 내 순서 |

---

### 🟣 메시징 & 크레딧 — 자주 `#A855F7`

#### 64. MessageTemplate
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

#### 65. MessageHistory
> 발송 이력.

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

#### 66. MessageEventRule
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

#### 67. MessageConfig ⚠️
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

#### 68. CreditTransaction [append-only]
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

#### 69. CreditBalance
> 테넌트 크레딧 풀 설정 + 잔액 캐시. CreditTransaction SUM으로 재계산 가능.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| tenant_id | UUID PK FK → Tenant | 1:1 |
| balance | int | 현재 잔액 (캐시) |
| auto_topup | boolean | 자동 충전 여부 |
| auto_topup_threshold | int? | 잔액 N 이하 시 충전 |
| auto_topup_amount | int? | 자동 충전 크레딧 수 |

---

#### 70. CreditServiceRate
> 메시지·AI 서비스별 크레딧 요율표. 요율 변경 이력을 effective_from으로 관리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK | |
| service_type | enum | MESSAGING / AI |
| sub_type | varchar | SMS / EMAIL / KAKAO 또는 AI 모델 ID |
| direction | enum? | INPUT / OUTPUT (AI 전용) |
| credits_per_unit | int | 크레딧 / unit_size |
| unit_size | int | 1 (메시지 1건) / 1000 (1K 토큰) |
| unit_label | varchar | "메시지" / "1K 토큰" |
| effective_from | date | 요율 이력 관리용 |

---

### ☁️ 조직 공지 — 하늘 `#0EA5E9`

#### 71. OrgAnnouncement
> 관리자가 생성하는 공지사항 엔티티.

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
| QuestionBankOption | 선택지 독립 CRUD, 집계 쿼리 |
| CourseSessionInstructor | User FK 필요 (string[] 탈피) |
| SurveyAnswer | 문항별 집계 쿼리 효율 |
| PaymentRefund | 부분 환불 이력 분리, 안전한 환불 이력 보존 |

### 제거된 테이블
| 테이블 | 이유 |
|--------|------|
| MediaAssetLinkedCourse | CourseActivity → MediaAsset 체인으로 역추적 가능, 불필요 |

### B2C / B2B 공통 전략
- 모든 테이블은 B2C/B2B 공용. UI만 context에 따라 hide.
- `Course.price`: B2B 테넌트 = NULL
- `Payment`, `Cart`, `Wishlist`, `Coupon`, `CourseReview`: B2B에도 테이블 존재하나 UI hide

### 3-레이어 감사 구조
```
Layer 1 — UserAccessLog     : 로그인/로그아웃 이력
Layer 2 — TenantAuditLog    : 관리자 데이터 변경 이력
          PlatformAuditLog  : 플랫폼 운영자 테넌트 관리 이력
Layer 3 — ActivityLog       : 학습자 학습 활동 이벤트 (xAPI verb)
```

### 공지 아키텍처
```
OrgAnnouncement  (admin entity)  → 관리자가 생성/발송
PortalAnnouncement (learner view) → 학습자 포털에 노출되는 공지
UserAgreement                     → 이용약관 동의 이력
```
