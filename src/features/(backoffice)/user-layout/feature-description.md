# 유저 상세 레이아웃

개별 유저의 상세 페이지를 탭 내비게이션으로 구성하는 레이아웃 셸.

## 누가, 언제
- **역할**: 관리자(ORG_ADMIN)
- **진입 경로**: 유저 목록에서 유저명 클릭
- **URL**: /backoffice/org/users/[uid] (하위 탭으로 리다이렉트)
- **목적**: 유저의 다양한 정보를 탭으로 구분하여 조회

## 화면 구성
### 레이아웃
```
[브레드크럼: < 유저 목록]
[탭 바: 기본 정보 | 수강 이력 | 활동 로그 | 접속 기기 | 접속 이력 | (강사 탭들)]
[탭 콘텐츠: children]
```

### 주요 요소
| 요소 | 설명 | 클릭 시 |
|------|------|---------|
| 브레드크럼 | "유저 목록" 링크 | user-list로 이동 |
| 기본 탭 (5개) | profile, enrollments, activity, sessions, access-logs | 해당 탭 콘텐츠 표시 |
| 강사 전용 탭 (4개) | instructor-courses, instructor-reviews, instructor-payouts, instructor-bank | 해당 탭 콘텐츠 표시 |

## 조건부 분기
| 조건 | 변화 |
|------|------|
| 유저 역할 = INSTRUCTOR | 강사 전용 탭 4개 추가 (담당 과정, 강사 평가, 정산 내역, 계좌 정보) |
| 존재하지 않는 userId | "존재하지 않는 유저입니다" + 목록 링크 표시 |

## 연결 페이지
| 방향 | 대상 | 조건 |
|------|------|------|
| 뒤로가기 | user-list | 항상 |
| 자식 | user-profile, user-enrollments 등 | 탭 선택 |

## 도메인 모델
| 모델 | 모듈 | 설명 |
|------|------|------|
| User | user | 유저 정보 (역할 기반 탭 분기) |

## 비즈니스 규칙
- UserDetailProvider 컨텍스트로 userId를 하위 탭에 공유
- 강사(INSTRUCTOR) 역할일 때만 강사 관련 탭 4개 추가 노출
