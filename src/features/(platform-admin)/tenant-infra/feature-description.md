# 테넌트 인프라 (platform-admin)

개별 테넌트의 AWS 인프라 정보와 Control Plane 제어 기능을 제공하는 탭.

## 도메인 모델

| 모델 | 모듈 | 설명 |
|------|------|------|
| Tenant | - | 기업(테넌트) |

## 화면 구성

### 섹션: 인프라 정보
- AWS 리전, EC2 인스턴스 타입, DB 호스트, S3 버킷, 프로비저닝 일시
- EC2/RDS/S3 서비스 상태 배지 (HEALTHY/WARNING/ERROR) + 확인 시각

### 섹션: Control Plane
- 마지막 동기화 시각 (주기: 15분)
- 설정 재동기화, 캐시 초기화, 헬스체크 실행 버튼
- 실행 중 로딩 스피너 표시

## 비즈니스 규칙

- 서비스 상태: HEALTHY(green), WARNING(amber), ERROR(red)
- Control Plane 액션은 동시에 하나만 실행 가능
