# 오프라인 (Admin)

과정의 오프라인 회차(OfflineSession)를 관리하고, QR 출결 및 수동 출결을 처리하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| CourseSession | course | 차수 (COHORT만 오프라인 회차 지원) |
| OfflineSession | offline_course | 오프라인 회차 인스턴스 (날짜, 장소, 강사) |
| OfflineAttendance | offline_course | 회차별 출결 기록 (PRESENT/LATE/ABSENT/EXCUSED) |

## 화면 구성

- COHORT 차수만 필터 (SELF_PACED 제외)
- 오프라인 회차 테이블: 회차번호, 일시, 장소+주소, 강사, 정원, 출석률, 상태
- 상태 뱃지: SCHEDULED(예정) / COMPLETED(완료) / CANCELLED(취소)
- 출석률: COMPLETED일 때만 표시, SCHEDULED는 "—"

## 모달

### 오프라인 회차 생성 (CreateOfflineSessionModal)
- 날짜, 시작/종료 시간, 장소(이름+주소+좌표), 정원
- 강사 배정: PRIMARY 1인 필수, ASSISTANT 추가 가능

### QR 모달 (QrModal)
- 출결 모드: 유효 시간 설정 (시작 N분 전 ~ M분 후). QR 스캔으로 자동 출석 처리
- 평가 모드: 커리큘럼 활동 선택 -> 해당 활동 URL QR 생성

### 출결 관리 (AttendanceModal)
- 요약: 출석/지각/결석/공결 카운트
- 학습자별 상태 버튼 (PRESENT/LATE/ABSENT/EXCUSED)
- 수동 변경 시 checkInMethod=MANUAL, checkedAt 초기화

## 비즈니스 규칙

- COHORT 차수만 오프라인 회차 지원
- 출석률 = (출석 + 지각) / 전체
- QR 출결 시 checkedAt 자동 기록, 수동 변경 시 checkedAt 초기화
