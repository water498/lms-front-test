# 감사 로그 (platform-admin)

플랫폼 수준의 관리 액션 감사 로그를 조회하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| PlatformAuditLog | - | 플랫폼 감사 로그 |

## 화면 구성

### 섹션: 필터
- 기간 필터: 오늘, 7일, 30일, 전체 (토글 버튼)
- 액션 유형 필터: 드롭다운 (기업 생성, 정지, 재개, SSO 관련, 초대 등)

### 섹션: 로그 테이블
- 일시, 수행자, 액션(배지), 대상, 상세, IP 주소
- 액션 배지 색상: 파괴적(red), 긍정적(green), 일반(slate)
- 필터 결과 건수 표시, 해당 기간 로그 없으면 빈 상태 메시지

## 비즈니스 규칙

- 지원 액션: TENANT_CREATED, TENANT_SUSPENDED, TENANT_RESUMED, SUBDOMAIN_CHANGED, PLAN_CHANGED, USER_LIMIT_CHANGED, SSO_CONFIGURED/ENABLED/DISABLED, ADMIN_INVITED/RESENT, PLATFORM_SETTINGS_UPDATED, PLATFORM_PLAN_CHANGED
- 기간 필터와 액션 필터는 AND 조건으로 적용
