# 설문 목록 (Admin)

등록된 설문(SurveyTemplate) 템플릿을 조회하고 관리하는 목록 페이지.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| SurveyTemplate | assessment/survey | 설문 템플릿 |

## 화면 구성

- 설문 목록 테이블 (SurveyTable 컴포넌트)
- 설문명 클릭 시 설문 에디터(assessment-survey-editor)로 이동
- 새 설문 추가 버튼

## 비즈니스 규칙

- 설문 템플릿은 과정 커리큘럼에 연결하여 사용
