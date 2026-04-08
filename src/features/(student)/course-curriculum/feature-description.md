# 과정 커리큘럼 (Student)

과정 상세 페이지의 "커리큘럼" 탭. 섹션별 활동 목록을 아코디언으로 펼쳐 보여준다.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| CourseSubject | course | 과정 섹션 (순서, 제목) |
| CourseActivity | course | 활동 (VIDEO, QUIZ, ASSIGNMENT, SCORM, SURVEY, OFFLINE) |

## 화면 구성

### 섹션: 요약 정보
- 총 섹션 수, 총 강의 수, 총 소요 시간 표시

### 섹션: 섹션 아코디언
- 각 섹션을 펼치기/접기 가능 (첫 번째 섹션 기본 펼침)
- 섹션 헤더: 순서 번호, 제목, 강의 수, 소요 시간
- 활동 목록: 타입별 아이콘(VIDEO/QUIZ/ASSIGNMENT/SCORM/SURVEY/OFFLINE), 제목
- VIDEO: 소요 시간(분) 표시
- QUIZ/ASSIGNMENT: 문항 수 표시

## 비즈니스 규칙

- course-layout의 CourseProvider에서 subjects 데이터를 전달받음
- 읽기 전용 뷰 (미등록 상태에서도 커리큘럼 미리보기 가능)
