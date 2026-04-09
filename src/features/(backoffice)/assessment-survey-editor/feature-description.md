# 설문 에디터 (Admin)

설문(SurveyTemplate) 템플릿을 섹션 단위로 구성하고 설정하는 3패널 에디터.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| SurveyTemplate | assessment/survey | 설문 템플릿 (익명 여부, 트리거 유형) |
| AssessmentSection | assessment/survey | 설문 섹션 (문항 그룹, 출제 수, 셔플) |
| QuestionGroup | assessment/question | 문항 그룹 (SURVEY 전용) |
| Question | assessment/question | 개별 문항 |

## 화면 구성

- **상단 바**: 설문 제목 인라인 편집, 총 문항 수 표시, 저장 버튼
- **좌측 패널 (섹션 목록)**: 섹션 추가/선택/순서 변경
- **중앙 패널 (섹션 편집)**: 섹션 이름, 문항 그룹 선택, 유형 필터(리커트/객관식 단일·복수/자유 서술), 출제 수, 셔플 토글, 문항 미리보기
- **우측 패널 (설문 설정)**: 트리거(수동/과정 완료 시 자동), 익명 응답 토글, 섹션 출제 수/셔플/삭제

## 비즈니스 규칙

- 출제 수가 그룹 보유 문항 수를 초과하면 저장 불가
- SURVEY 그룹만 선택 가능 (EXAM 그룹 제외)
- 트리거 COURSE_COMPLETE: 과정 완료 시 자동으로 설문 배포
