# 과정 정보 (Admin)

과정(Course) 템플릿의 기본 정보, 선수과정, 수료증, 환불 정책을 관리하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 과정 템플릿 (모드, 가격, 설명, 태그 등) |
| CourseCategory | course | 과정 카테고리 |
| CoursePrerequisite | course | 선수과정 연결 (다른 과정 + 수료 필수 여부) |
| CancellationRule | course | 환불 규칙 (N일 전 -> 환불%) |
| CertificateTemplate | certificate | 수료증 템플릿 |

## 화면 구성

- 상태 뱃지 (DRAFT / PUBLISHED / ARCHIVED)
- 기본 정보: 제목, 카테고리, 강사, 태그, 모드(온라인/오프라인/혼합), 설명
- 가격 (0 = 무료), 기본 최소 수강인원
- 선수과정: 다른 과정 선택 + 수료 필수 여부 토글. 동일 과정 중복 불가
- 수료증: 템플릿 선택, 수료율(0~100%), 자동발급 토글
- 환불 규칙: N일 전 -> 환불% 테이블. daysBeforeStart 내림차순 자동 정렬. "개강 후 환불 불가" 체크박스
- 발행 버튼 (DRAFT -> PUBLISHED)
- 보관 버튼 (PUBLISHED -> ARCHIVED)

## 비즈니스 규칙

- 보관(ARCHIVED) 전환은 진행중(ONGOING) 차수가 없어야 가능
- 수료증 자동발급은 수료율 달성 시 즉시 발급
- 환불 규칙은 저장 시 자동 정렬
