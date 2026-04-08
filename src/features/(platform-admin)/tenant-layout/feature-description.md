# 테넌트 상세 레이아웃 (platform-admin)

개별 테넌트의 상세 정보를 탭으로 탐색하는 레이아웃 셸.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Tenant | - | 기업(테넌트) |

## 화면 구성

### 섹션: 헤더
- "기업 목록으로" 뒤로가기 링크
- 테넌트명, 서브도메인 표시
- "관리자 접속" 버튼 (impersonation으로 해당 기업 admin 화면 진입)
- 상태 배지(ACTIVE/TRIAL D-N/SUSPENDED)

### 섹션: 탭 네비게이션
- 개요, SSO, 크레딧, 인프라 4개 탭
- pathname 기반 활성 탭 판별, 탭 콘텐츠는 children으로 렌더링

## 비즈니스 규칙

- tenantId URL 파라미터로 테넌트 식별
- 존재하지 않는 테넌트 접근 시 에러 메시지 표시
- TenantDetailProvider로 상태(status, subdomain) 공유
