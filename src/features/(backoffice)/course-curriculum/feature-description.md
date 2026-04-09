# 커리큘럼 (Admin)

과정의 커리큘럼 구조를 편집하는 탭. PRE/LEARNING/POST 3단계 Phase 기반으로 과목과 활동을 관리.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 과정 템플릿 (isSequential, mode) |
| CourseSubject | course | 과목(챕터). Phase + requiredDayNum(회차 잠금) |
| CourseActivity | course | 활동. VIDEO/SCORM/QUIZ/ASSIGNMENT/SURVEY/OFFLINE |
| MediaAsset | media | 영상/SCORM 콘텐츠 (활동 추가 시 선택) |
| ExamTemplate | assessment.exam | 시험 템플릿 (활동 추가 시 선택) |
| AssignmentTemplate | assessment.assignment | 과제 템플릿 (활동 추가 시 선택) |

## 화면 구성

- **순서 강제 토글**: Phase 순서(PRE->LEARNING->POST)는 항상 강제. 토글 ON 시 Phase 내 활동도 순서 강제
- **3개 Phase 섹션**: 각 섹션 접기/펼치기, 과목 수 표시
- **과목**: 제목, Phase 뱃지, 회차 잠금 뱃지(requiredDayNum), 활동 수. DnD 순서 변경. 편집/삭제
- **활동**: 타입 아이콘, 제목, 미디어명, 타입+메타(시간/문항수). DnD 순서 변경. 편집/삭제
- **진행중 차수 경고**: 커리큘럼 전체 수정 불가 (앰버 배너)

## 모달

### 활동 추가 (AddActivityModal)
- 4개 탭: 미디어(VIDEO/SCORM) / 시험(ExamTemplate) / 과제(AssignmentTemplate) / 오프라인(제목만)
- 제목 필수. 템플릿 선택 시 제목 자동 채움. 과제는 강사 없으면 비활성

### 과목 편집 (EditSubjectModal)
- 과목명, Phase 변경, requiredDayNum (OFFLINE/BLENDED만)

### 활동 편집 (EditActivityModal)
- 활동명, QUIZ: 합격 필수 체크, VIDEO: 영상 길이(읽기전용), OFFLINE: 안내

## 비즈니스 규칙

- 진행중(ONGOING) 차수 존재 시 구조 변경 불가 (제목 편집만 허용)
- ASSIGNMENT는 강사 배정된 과정에서만 추가 가능
- OFFLINE 활동은 OFFLINE/BLENDED 모드에서만 유의미
- requiredDayNum: 해당 회차 출석 전까지 과목 접근 차단
- 활동 삭제 시 기존 학습 기록 유지, 신규 수강자에게만 미표시
