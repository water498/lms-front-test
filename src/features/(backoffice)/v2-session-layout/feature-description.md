# 차수 상세 레이아웃 v2 (Backoffice)

과정 하위에 중첩된 차수 상세 페이지 레이아웃. URL에서 courseId + sessionId 직접 추출.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| CourseSession | course | 차수 |
| Course | course | 과정 (부모) |

## 화면 구성

### 탭 구조
- 대시보드, 수강생, 채점, 출석, Q&A, 자료실
- 오프라인 관리 (오프라인/블렌디드 과정만)

### 헤더
- 브레드크럼: 과정 목록 > {과정명} > {차수명}
- 알림 발송 버튼

## 비즈니스 규칙

- URL: /courses/[courseId]/sessions/[sessionId]/{tab}
- courseId를 URL에서 직접 추출 (v1은 session 객체에서 참조)
