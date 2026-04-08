# 관리자 대시보드 (Admin)

조직(테넌트) 전체 현황을 한눈에 파악하는 메인 대시보드.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Course | course | 과정 상태별 통계 |
| Enrollment | enrollment | 최근 수강 신청 현황 |
| PlatformAnnouncement | org | 플랫폼 공지 배너 |

## 화면 구성

- **플랫폼 배너**: 긴급(URGENT) / 점검(MAINTENANCE) 공지를 상단에 노출. 개별 닫기(dismiss) 가능
- **KPI 카드 4개**: 총 수강생, 활성 과정, 이번 달 수료율, 진행 중 수강 (증감 표시)
- **최근 수강 신청**: 최근 등록된 수강 내역 테이블
- **과정 상태 개요**: PUBLISHED / DRAFT / ARCHIVED 건수 요약
- **활동 피드**: 수강 신청, 과정 발행, 취소, 초대 등 타임라인

## 비즈니스 규칙

- 플랫폼 배너는 PUBLISHED 상태의 URGENT/MAINTENANCE만 표시
- 배너 dismiss는 세션 단위 (새로고침 시 재노출)
