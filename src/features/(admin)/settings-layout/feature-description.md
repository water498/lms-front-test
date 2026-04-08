# 설정 레이아웃 (Admin)

조직 설정 페이지를 탭 내비게이션으로 구성하는 레이아웃 셸.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| OrgSettings | org | 조직 설정 |

## 화면 구성

- **탭 4개**: 일반, 조직 구조, 접근 관리, 감사로그
- 탭 콘텐츠는 children으로 렌더링 (각 탭은 독립 feature)
- 콘텐츠 영역은 흰색 카드 레이아웃

## 비즈니스 규칙

- 각 탭의 세부 기능은 settings-general, settings-org, settings-access, settings-audit feature에서 담당
