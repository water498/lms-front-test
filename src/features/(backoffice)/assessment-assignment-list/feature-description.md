# 과제 목록 (Admin)

등록된 과제(AssignmentTemplate) 템플릿을 조회하고 관리하는 목록 페이지.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| AssignmentTemplate | assessment/assignment | 과제 템플릿 |

## 화면 구성

- 과제 목록 테이블 (AssignmentTable 컴포넌트)
- 과제명 클릭 시 과제 에디터(assessment-assignment-editor)로 이동
- 새 과제 추가 버튼

## 비즈니스 규칙

- 과제 템플릿은 과정 커리큘럼에 연결하여 사용
