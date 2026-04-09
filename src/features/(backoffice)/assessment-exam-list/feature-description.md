# 시험 목록 (Admin)

등록된 시험(ExamTemplate) 템플릿을 조회하고 관리하는 목록 페이지.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| ExamTemplate | assessment/exam | 시험 템플릿 |

## 화면 구성

- 시험 목록 테이블 (ExamTable 컴포넌트)
- 시험명 클릭 시 시험 에디터(assessment-exam-editor)로 이동
- 새 시험 추가 버튼

## 비즈니스 규칙

- 시험 템플릿은 과정 커리큘럼에 연결하여 사용
