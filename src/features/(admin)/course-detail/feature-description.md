# 과정 상세 (Admin)

과정(Course) 템플릿의 상세 정보를 관리하는 싱글 페이지. 과정 정보, 커리큘럼, 차수, 리뷰, 수강생, 오프라인 회차를 탭으로 구성.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 과정 템플릿 (모드, 순서강제, 수료증 설정 포함) |
| CourseSubject | course | 과목(챕터). Phase(PRE/LEARNING/POST) + 회차 잠금 |
| CourseActivity | course | 활동. VIDEO/SCORM/QUIZ/ASSIGNMENT/SURVEY/OFFLINE |
| CourseSession | course | 차수 인스턴스 (COHORT/SELF_PACED) |
| CoursePrerequisite | course | 선수과정 연결 |
| CourseReview | course | 수강 리뷰 |
| CourseCategory | course | 과정 카테고리 |
| CancellationRule | course | 환불 규칙 (N일 전 -> 환불%) |
| CertificateTemplate | certificate | 수료증 템플릿 |
| OfflineSession | offline_course | 오프라인 회차 인스턴스 |
| OfflineAttendance | offline_course | 회차별 출결 기록 |
| MediaAsset | media | 영상/SCORM 콘텐츠 |
| ExamTemplate | assessment.exam | 시험 템플릿 |
| AssignmentTemplate | assessment.assignment | 과제 템플릿 |
| Enrollment | enrollment | 수강 등록 |

## 화면 구성

### 탭: 과정 정보
- 상태 뱃지 (DRAFT/PUBLISHED/ARCHIVED), 제목, 카테고리, 강사, 태그, 모드(온라인/오프라인/혼합)
- 설명, 가격 (0=무료), 기본 최소 수강인원
- 선수과정 설정: 다른 과정 선택 + 수료 필수 여부 토글
- 수료증 설정: 템플릿 선택, 수료율, 자동발급 토글
- 환불 규칙 테이블: N일 전 -> 환불%. 자동 정렬. "개강 후 환불 불가" 체크박스
- 발행 버튼 (DRAFT->PUBLISHED), 보관 버튼 (PUBLISHED->ARCHIVED, 진행중 차수 없어야 함)

### 탭: 커리큘럼
- **순서 강제 토글**: Phase 순서(PRE->LEARNING->POST)는 항상 강제. 토글 ON 시 Phase 내 활동도 순서 강제
- **3개 Phase 섹션**: 각 섹션 접기/펼치기, 과목 수 표시
- **과목 (SubjectAccordion)**: 제목, Phase 뱃지, 회차 잠금 뱃지 (requiredDayNum 설정 시), 활동 수
  - DnD 순서 변경 (진행중 차수 있으면 비활성)
  - 편집(EditSubjectModal) / 삭제
- **활동 (ActivityRow)**: 타입 아이콘, 제목, 미디어명, 타입 + 메타(시간/문항수)
  - DnD 순서 변경
  - 편집(EditActivityModal) / 삭제 (수강생 있으면 경고 모달)
- **진행중 차수 경고**: hasOngoingSessions=true이면 커리큘럼 전체 수정 불가 (앰버 배너)

### 탭: 차수 관리
- 차수 테이블: 이름, 유형(정규/자유수강), 기간, 수강현황/정원, 강사, 장소, 상태
- 상태: DRAFT(준비중) / OPEN(모집중) / ONGOING(진행중) / CLOSED(종료) / CANCELLED(폐강)
- 수강 미달 표시: enrolled < minEnrollment이면 빨간 "미달" 뱃지
- 차수 생성(CreateSessionModal), 복사, 삭제

### 탭: 리뷰
- 요약 카드: 평균 별점 (공개 리뷰 기준), 전체/공개/숨김 수
- 리뷰 테이블: 학습자, 별점, 내용, 작성일, 공개/숨김 토글

### 탭: 수강생
- 차수별 필터 드롭다운
- 수강생 테이블: 이름(클릭 시 UserDrawer 열림), 차수, 진도율 바, 등록일

### 탭: 오프라인
- COHORT 차수만 필터
- 오프라인 회차 테이블: 회차번호, 일시, 장소, 강사, 정원, 출석률, 상태
- 회차 생성(CreateOfflineSessionModal), QR(QrModal), 출결(AttendanceModal)

## 모달

### 활동 추가 (AddActivityModal)
- 4개 탭: 미디어(VIDEO/SCORM 선택) / 시험(ExamTemplate 선택) / 과제(AssignmentTemplate 선택) / 오프라인(제목만)
- 제목 입력 필수. 템플릿/미디어 선택 시 제목 자동 채움
- 과제 탭: 강사 없는 과정이면 비활성 (Ban 아이콘 + 툴팁)

### 과목 편집 (EditSubjectModal)
- 과목명, Phase(PRE/LEARNING/POST) 변경
- requiredDayNum: OFFLINE/BLENDED 모드만 표시. 비워두면 출석 제한 없음

### 활동 편집 (EditActivityModal)
- 활동명 수정, 타입 뱃지(읽기전용)
- QUIZ: 합격 필수(수료 조건) 체크박스
- VIDEO: 영상 길이 표시(읽기전용)
- OFFLINE: 출석 시 자동 완료 안내

### 차수 생성 (CreateSessionModal)
- 유형: COHORT(기수, 시작/종료일, 최소인원) / SELF_PACED(상시)
- 정원(0=무제한), 강사 배정(PRIMARY/ASSISTANT), 장소(오프라인 시)
- 노출 여부, 판매 여부(B2C 개별 구매 허용)

### 오프라인 회차 생성 (CreateOfflineSessionModal)
- 날짜, 시작/종료 시간, 장소(이름+주소+좌표), 정원
- 강사 배정: PRIMARY 1인 필수, ASSISTANT 추가 가능

### QR 모달 (QrModal)
- 출결 모드: 유효 시간 설정 (시작 N분 전 ~ M분 후)
- 평가 모드: 커리큘럼 활동 선택 -> 해당 활동 URL QR 생성

### 출결 관리 (AttendanceModal)
- 요약: 출석/지각/결석/공결 카운트
- 학습자별 상태 버튼 (PRESENT/LATE/ABSENT/EXCUSED)
- 수동 변경 시 checkInMethod=MANUAL

## 비즈니스 규칙

- 진행중(ONGOING) 차수 존재 시 커리큘럼 구조 변경 불가 (제목 등 비파괴적 편집만 허용)
- ASSIGNMENT 활동은 강사 배정된 과정에서만 추가 가능
- OFFLINE 활동은 OFFLINE/BLENDED 모드에서만 유의미
- 과목의 requiredDayNum: 해당 회차 출석 완료 전까지 과목 접근 차단 (OFFLINE/BLENDED만)
- 활동 삭제 시 기존 수강생 학습 기록은 유지, 신규 수강자에게만 미표시
- 보관(ARCHIVED) 전환은 진행중 차수가 없어야 가능
- 환불 규칙은 daysBeforeStart 내림차순 자동 정렬
- 리뷰 평균 별점은 공개 리뷰만 기준
- 출석률 = (출석 + 지각) / 전체
