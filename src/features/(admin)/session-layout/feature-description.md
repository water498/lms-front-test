# 차수 상세 레이아웃 (Admin)

차수(CourseSession) 상세 페이지의 탭 네비게이션 쉘. 과정-차수 브레드크럼과 알림 발송 버튼을 제공한다.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 상위 과정 정보 (제목, 모드) |
| CourseSession | course | 차수 (일정, 정원, 상태 등) |
| CourseEnrollee | enrollment | 차수별 수강생 |

## 화면 구성

- 브레드크럼: 과정 관리 > 과정명 > 차수명
- 알림 발송 버튼 (우측 상단) — NotifyModal 호출
- 탭 바: 대시보드, 차수 정보, 수강생, 채점, Q&A, 학습 이력, 자료실
  - 오프라인/혼합 과정: "오프라인 관리" 탭 추가
  - 정규(COHORT) 차수: "대기자" 탭 추가
- 탭 하단에 children(탭 콘텐츠) 렌더링

## 모달

### 알림 발송 (NotifyModal)
- session-dashboard의 NotifyModal 재사용
- 수료 기준 미달 인원 수 자동 계산하여 전달

## 비즈니스 규칙

- 탭 가시성은 과정 모드(OFFLINE/BLENDED)와 차수 유형(COHORT)에 따라 동적 결정
