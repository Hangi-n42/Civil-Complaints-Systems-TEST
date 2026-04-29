프로젝트명: 민원 담당자를 위한 Adaptive RAG Workbench

1. 목표 타겟
- 1차 사용자: 민원 접수·분류·답변 초안 작성을 담당하는 공공기관 실무자
- 2차 사용자: 팀장·검수자처럼 답변 품질과 처리 현황을 확인해야 하는 관리자
- 데모 사용자: 학교 과제 평가자 및 발표 청중

2. 문제 정의
- 민원 처리에서 가장 시간이 많이 드는 구간은 유사 사례 탐색, 법령/근거 확인, 답변 초안 정리입니다.
- 현재 흐름은 검색, 정리, 생성, 검토가 분리되어 있어 처리 시간이 길고 품질 편차가 큽니다.
- 복합 민원은 하나의 질의 안에 여러 하위 요청이 섞여 있어, 단순 검색형 RAG만으로는 응답 품질이 불안정합니다.

3. 해결 전략
- 입력 민원을 먼저 분석해 주제와 복잡도를 분리합니다.
- 주제/복잡도에 따라 검색 전략과 프롬프트를 다르게 적용합니다.
- 최종 응답은 요약, 근거, 제한사항, 인용, 초안 편집 가능 상태로 제공해 검토 시간을 줄입니다.

4. 핵심 기능 (Top 3)
1. Adaptive Analyzer + Router
	 - 입력 민원의 주제, 요청 분해 결과, 복잡도 점수를 추출합니다.
	 - `topic_type`과 `complexity_level` 조합으로 검색/생성 전략을 결정합니다.
2. Topic-aware Retrieval
	 - 유사 민원, 판례, 내부 규정, FAQ를 주제별로 우선 검색합니다.
	 - 단순 민원과 복합 민원에 서로 다른 Top-K 및 재정렬 전략을 적용합니다.
3. Workbench UI
	 - 좌측: 민원 선택/상태
	 - 중앙: 요약, 요청 분해, 근거 목록
	 - 우측: 답변 초안, citation, 편집 가능 패널

5. 기술 스택
- Backend: Python, FastAPI, Pydantic, Uvicorn
- Retrieval: ChromaDB, 임베딩 모델, 재정렬 로직
- Generation: PromptFactory, response normalization
- Frontend: Node.js, Next.js, React
- DevOps/지표: GitHub Actions, GitHub Projects, JSON artifact, Chart.js/SVG 시안

6. 데이터와 범위
- 입력 데이터: 공공 민원 텍스트, 구조화 메타데이터, 유사 사례 샘플
- In Scope: analyzer, router, retrieval, generation, workbench, DORA 자동 수집, 프로젝트 운영 자동화
- Out of Scope: 실제 행정 시스템 연동, 모바일 앱, 대규모 외부 서비스 배포

7. 평가 기준
- 기능 정확도
	- 주제 분류와 복잡도 분류가 의도대로 동작하는지 확인
	- 요청 분해가 복합 민원에서 정상적으로 작동하는지 확인
- 검색 품질
	- Top-K 결과에 실제 관련 근거가 포함되는지 확인
	- citation이 응답과 일치하는지 확인
- 생성 품질
	- 답변 초안이 검토 가능한 수준의 완성도를 가지는지 확인
	- 제한사항과 근거를 함께 제시하는지 확인
- 운영 지표
	- DORA 4대 지표가 자동 수집되는지 확인
	- Project 보드에서 백로그/진행/검토/완료 흐름이 유지되는지 확인

8. 완료 판정 시나리오
- 민원 하나를 선택한다.
- analyzer가 주제와 복잡도를 산출한다.
- router가 전략을 선택한다.
- retriever가 근거를 검색한다.
- generator가 초안을 만든다.
- UI에서 초안과 citation을 함께 확인하고 편집할 수 있다.
- 위 흐름이 연속적으로 성공하면 기능 완료로 판정한다.

9. 16주 마일스톤 초안
- 1–2주: 요구정의, 데이터 범위 확정, 평가 기준 초안 작성
- 3–4주: ingestion/structuring 정리, 스키마 및 샘플셋 고정
- 5–6주: TopicAnalyzer, ComplexityAnalyzer, request segmentation 구현
- 7–8주: AdaptiveRouter, routing trace, retrieval 정책 연결
- 9–10주: PromptFactory, response normalization, citation 포맷 정리
- 11–12주: FastAPI API, 통합 테스트, 오류 처리 보강
- 13–14주: Next.js Workbench UI, 편집/검토 플로우 연결
- 15주: DORA 대시보드, Project 백로그 분석, 데모 안정화
- 16주: 최종 데모, 보고서, 제출본 정리

10. 팀원 역할 분담
- BE1(리드): 데이터 파이프라인, 구조화, 평가, 발표 총괄
- BE2: Analyzer/Router/Research 기반 검색 품질 개선
- BE3: Retrieval, Generation, API 통합, DORA 수집 파이프라인
- FE: Workbench UI, 상태 패널, 답변 검토 UX
- PM/QA: 일정 관리, 이슈 분배, 검증 체크리스트, 발표 자료 정리

11. 리스크와 대응
- 데이터 품질 불균형: 샘플 검수와 오류 사례를 별도 수집
- 복합 민원 오분류: request segmentation과 복수 라우팅 trace 보강
- 생성 결과 환각: citation 강제, 제한사항 문구 포함, 검토 편집 단계 제공
- 배포/의존성 이슈: 로컬 우선 실행, GitHub Actions로 재현 가능한 파이프라인 유지

12. 산출물
- 제안서: [docs/project_proposal.md](docs/project_proposal.md)
- PRD: [docs/00_overview/prd.md](docs/00_overview/prd.md)
- Project 보드: https://github.com/users/Hangi-n42/projects/1
- DORA 대시보드 시안: [docs/dora_dashboard.html](docs/dora_dashboard.html)
- DORA 아티팩트: [scripts/artifacts/dora-metrics-20260430.json](scripts/artifacts/dora-metrics-20260430.json), [scripts/artifacts/dora-dashboard-20260430.svg](scripts/artifacts/dora-dashboard-20260430.svg), [scripts/artifacts/dora-report-20260430.md](scripts/artifacts/dora-report-20260430.md)

