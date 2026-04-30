# ADR Guide

이 디렉터리는 Civil Complaints Systems의 아키텍처 의사결정(ADR/ARD)을 관리한다.

현재 기준 문서는 [adr_architecture_decision_record.md](adr_architecture_decision_record.md)이며,
신규/변경 결정은 반드시 [template.md](template.md)를 사용해 기록한다.

## 1. 문서 목적

- 핵심 아키텍처 결정의 근거와 트레이드오프를 추적한다.
- 코드/스펙/운영 규칙 변경 시 판단 기준을 제공한다.
- 팀 간(Frontend, Backend, QA) 계약 충돌을 사전에 줄인다.

## 2. 현재 운영 원칙 (요약)

- On-device 우선 처리
- Adaptive RAG 단계 적용
- 계약 기반 API 통합
- Week5-8: 코어 구현 + 데모 동결 중심 운영
- 라우팅 기준: `topic_type + complexity_level`

## 3. 소스 오브 트루스

- 통합 기준 문서: [adr_architecture_decision_record.md](adr_architecture_decision_record.md)
- 신규 단건 ADR: 본 폴더에 별도 파일로 추가 가능
- 충돌 시 우선: 최신 ADR 본문 > 관련 사양 문서 > 구현 메모

참고: 현재 기준 문서는 제목에 `ARD` 표기를 사용하지만,
운영 관점에서는 ADR과 동일한 아키텍처 결정 기록 문서로 취급한다.

## 4. 신규 ADR 작성 규칙

1. [template.md](template.md)를 복사해 새 파일을 만든다.
2. 파일명은 `adr-xxxx-short-title.md` 형식을 권장한다.
3. 상태(`Proposed`, `Accepted`, `Deprecated`, `Superseded`)를 반드시 명시한다.
4. `Context -> Decision -> Consequences -> Follow-up Actions` 순서를 유지한다.
5. 영향 범위(모듈, API, 스키마, 운영)를 체크리스트로 명시한다.
6. 관련 문서/이슈/PR 링크를 기록한다.

## 5. 변경 프로세스

1. 문제 정의: 왜 기존 결정으로 부족한지 수치/사례로 작성
2. 대안 비교: 최소 2개 이상 대안과 채택/기각 사유 작성
3. 영향 분석: API 계약, 데이터 스키마, FE/BE 워크플로우 영향 명시
4. 검증 계획: 회귀 리스크와 검증 시나리오 정의
5. 동시 반영: ADR + 관련 문서 + 코드 변경을 가능한 단일 PR로 묶기

## 6. ADR 업데이트가 필요한 대표 상황

- 라우팅 기준 변경 (예: `length/is_multi` -> `complexity_level`)
- API 공통 래퍼/에러 코드/시간 정책 변경
- 핵심 스택 변경 (모델, 벡터DB, 프레임워크)
- FE/BE 아키텍처 경계 변경
- 데이터 계약(스키마/필수 필드) 변경

## 7. 최소 검토 체크리스트

- 상태와 적용일이 명확한가?
- 기존 결정과 충돌 여부를 명시했는가?
- 대안/트레이드오프가 누락되지 않았는가?
- 운영 영향(성능, 안정성, 보안, 데모 리스크)을 포함했는가?
- 후속 액션이 실행 가능한 단위로 작성되었는가?

## 8. 현재 기준 문서

- [adr_architecture_decision_record.md](adr_architecture_decision_record.md)
