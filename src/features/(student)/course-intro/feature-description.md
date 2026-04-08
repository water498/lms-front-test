# 과정 소개 (Student)

과정 상세 페이지의 "소개" 탭. 학습 목표, 사전 지식, 강의 소개 텍스트를 표시한다.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| CourseDetail | course | whatYouLearn, requirements, description 필드 |

## 화면 구성

### 섹션: 이런 걸 배워요
- 학습 목표 항목을 체크 아이콘과 함께 2열 그리드로 표시

### 섹션: 수강 전 필요 지식
- 사전 요구사항을 불릿 리스트로 표시

### 섹션: 강의 소개
- 리치 텍스트(ProseContent)로 강의 상세 설명 렌더링

## 비즈니스 규칙

- course-layout의 CourseProvider에서 detail 데이터를 전달받음
- 읽기 전용 뷰 (수강생 액션 없음)
