# 과정 상세 레이아웃 (Student)

과정 상세 페이지의 탭 네비게이션 레이아웃. 소개/커리큘럼/강사/리뷰 탭을 제공하며, 우측에 수강 신청 사이드바를 고정 표시한다.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 과정 기본 정보 |
| CourseDetail | course | 과정 상세 (학습 목표, 요구사항 등) |
| CourseSubject | course | 과정 섹션/활동 구조 |
| InstructorProfile | user | 강사 프로필 |

## 화면 구성

### 섹션: 네비게이션 바
- 장바구니 수량 표시 포함

### 섹션: 뒤로가기
- 대시보드로 돌아가기 링크

### 섹션: CourseHero
- 과정 제목, 강사명, 평점, 썸네일 등 핵심 정보 표시

### 섹션: 탭 바
- 소개(intro) / 커리큘럼(curriculum) / 강사(instructor) / 리뷰(reviews)
- URL 기반 탭 전환 (각 탭은 독립 feature)

### 섹션: DetailSidebar (우측 고정)
- 가격, 수강 신청/장바구니 담기 버튼
- 위시리스트 토글
- 이미 수강 중이면 "이어 학습" 버튼 표시
- 과목(subject) 요약 정보

## 모달

### 강사 프로필 모달
- 강사 이름 클릭 시 InstructorProfileModal 표시
- 강사 상세 프로필, 경력, 전문분야 등

## 비즈니스 규칙

- CourseProvider로 과정 데이터를 하위 탭에 공유
- courseId는 URL 파라미터에서 추출
- 수강 등록 상태에 따라 사이드바 CTA 분기 (수강 신청 vs 이어 학습)

