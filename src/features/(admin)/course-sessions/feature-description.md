# 차수 관리 (Admin)

과정의 차수(CourseSession) 인스턴스를 생성하고 관리하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| CourseSession | course | 차수 인스턴스 (COHORT / SELF_PACED) |
| CourseSessionInstructor | course | 차수별 강사 배정 (PRIMARY / ASSISTANT) |

## 화면 구성

- 차수 테이블: 이름, 유형(정규/자유수강), 기간, 수강현황/정원, 강사, 장소, 상태
- 상태 뱃지: DRAFT(준비중) / OPEN(모집중) / ONGOING(진행중) / CLOSED(종료) / CANCELLED(폐강)
- 수강 미달: enrolled < minEnrollment이면 빨간 "미달" 뱃지
- 차수 복사 ("(복사)" 접미어)
- 차수 삭제

## 모달

### 차수 생성 (CreateSessionModal)
- 유형: COHORT(기수, 시작/종료일, 최소인원) / SELF_PACED(상시)
- 정원 (0 = 무제한, 기본 30)
- 강사 배정: 체크박스 + 역할(주강사/보조강사). PRIMARY 1인 필수
- 장소 (오프라인 과정일 때)
- 노출 여부, 판매 여부 (B2C 개별 구매 허용)

## 비즈니스 규칙

- COHORT: 기수 번호, 시작/종료일 필수
- SELF_PACED: 상시 운영, 날짜 없음
- 정원 0 = 무제한
