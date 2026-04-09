# 설정 - SSO 접근 (Admin)

SAML 기반 SSO 연동을 설정하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| TenantSsoConfig | org | SSO 설정 (SP/IdP 정보, 인증서) |

## 화면 구성

### 섹션: SP 정보 (읽기 전용)
- SP Entity ID / Audience URI (복사 버튼)
- ACS URL (복사 버튼)
- IdP(Azure AD, Okta 등)에 등록하라는 안내

### 섹션: IdP 설정
- IdP SSO URL 입력
- X.509 인증서 입력 (텍스트에리어)

### 섹션: 연결 상태
- 설정 완료 시 "연결됨" (초록), 미설정 시 "미설정" (회색)

### 액션
- 테스트 연결 버튼 (IdP 엔드포인트 ping)
- 저장 버튼

## 비즈니스 규칙

- IdP SSO URL과 인증서 모두 입력해야 연결 상태가 "연결됨"으로 전환
- 테스트 연결은 설정 완료 후에만 가능

## B2C/B2B 분기

- sso feature flag가 활성화된 B2B 테넌트에서만 의미 있음
