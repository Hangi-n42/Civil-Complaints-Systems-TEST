# ADR-XXX: [결정 제목]

- 상태: Proposed | Accepted | Deprecated | Superseded
- 작성일: YYYY-MM-DD
- 적용일: YYYY-MM-DD (선택)
- 의사결정자: 이름/역할
- 관련 이슈/PR: 링크
- 관련 문서: 링크 (예: PRD, WBS, API Spec, Schema, Manual)
- 대체/대상 ADR: ADR-YYY (선택)

## 1) Context (도입 배경)

- 현재 상황과 문제를 구체적으로 작성한다.
- 왜 기존 결정으로 부족한지 근거를 작성한다.
- 제약 조건(보안, 성능, 일정, 인력, 데모 안정성)을 명시한다.

예시 관점:
- 개인정보/온디바이스 제약
- API 계약 동기화 리스크
- 라우팅 설명 가능성 부족
- 운영 중 장애 복구 복잡도

## 2) Decision (결정 사항)

- 채택한 방안을 명확히 선언한다.
- 범위를 구체적으로 적는다: 모듈, API, 스키마, UI, 로그/평가
- 필요하면 필수 필드/포맷/정책을 고정한다.

작성 예시:
- 라우팅 키 포맷: `{topic_type}/{complexity_level}`
- 시간 정책: ISO-8601 `+09:00`
- 공통 응답 래퍼: `success`, `request_id`, `timestamp`, `data|error`

## 3) Alternatives Considered (대안 검토)

- 대안 A:
	- 장점:
	- 단점:
	- 기각/채택 사유:
- 대안 B:
	- 장점:
	- 단점:
	- 기각/채택 사유:

## 4) Consequences (기대 효과 및 한계)

- 기대 효과:
- 한계/트레이드오프:
- 리스크:
- 완화 전략:

## 5) Impact Scope (영향 범위)

- Backend:
- Frontend:
- API Contract:
- Schema/Data:
- Retrieval/Generation:
- Observability/Evaluation:
- Demo/Operations:

## 6) Validation Plan (검증 계획)

- 기능 검증 시나리오:
- 회귀 테스트 범위:
- 측정 지표:
	- 품질: Recall@K, F1, citation 정합성
	- 성능: p95 latency, timeout rate
	- 안정성: validation error rate, fallback rate
- 롤백 기준:

## 7) Follow-up Actions (후속 액션)

- [ ] 문서 동기화: PRD / WBS / MVP / specs / manuals
- [ ] API 계약 동기화: 요청/응답 필드 반영
- [ ] 코드 반영: 관련 모듈 구현/리팩토링
- [ ] 테스트/평가 파이프라인 업데이트
- [ ] 데모 시나리오 점검

## 8) Rollout / Timeline (적용 계획)

- Phase 1:
- Phase 2:
- Freeze 포인트:
- 담당 오너:

## 9) Changelog (변경 이력)

- YYYY-MM-DD: 초안 작성
- YYYY-MM-DD: 승인/변경

---

## ADR 작성 시 필수 점검

- [ ] 상태(`Proposed/Accepted/Deprecated/Superseded`)가 최신인가?
- [ ] 기존 ADR과 충돌 여부를 명시했는가?
- [ ] 대안 2개 이상을 검토했는가?
- [ ] 트레이드오프와 운영 리스크를 분리해 작성했는가?
- [ ] FE/BE/API/Schema 영향 범위를 모두 확인했는가?
- [ ] 검증 지표와 롤백 기준이 있는가?
