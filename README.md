# AI-Civil-Affairs-Systems

민원 담당자를 위한 온디바이스 LLM 기반 검색/구조화/질의응답 시스템입니다.

## 한눈에 보기

- 목적: 민원 데이터를 로컬 환경에서 안전하게 구조화하고 검색/QA까지 연결
- 핵심 가치: 온디바이스 실행, 보안/프라이버시 중심 파이프라인
- 기술 축: FastAPI + Streamlit + Ollama + ChromaDB
- 데이터 축: AIHub 공공 민원 상담 데이터 기반 실험/평가 체계

## 주요 기능

1. 데이터 입수: CSV/JSON 배치 및 수동 입력
2. 구조화: Observation/Result/Request/Context 4요소 추출
3. 엔티티 추출: LOCATION/TIME/FACILITY/HAZARD/ADMIN_UNIT
4. 검색: 임베딩/벡터 인덱스 기반 시맨틱 검색
5. 생성: citation 포함 RAG 응답 생성

## 빠른 시작

### 1) 환경 준비

```bash
git clone https://github.com/Hangi-n42/AI-Civil-Affairs-Systems.git
cd AI-Civil-Affairs-Systems

python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
```

### 2) Ollama 실행

```bash
ollama serve
```

### 3) API/UI 실행

```bash
python scripts/run_api.py
python scripts/run_ui.py
```

- API 문서: http://localhost:8000/docs
- UI: http://localhost:8501

## Week3 벤치마크 실행 예시

```bash
python scripts/generate_week3_benchmark_cases_500.py \
  --input data/samples/initial_sample_20.json \
  --output data/samples/evaluation_set.json \
  --target 500 \
  --seed 42
```

```bash
python scripts/run_week3_model_benchmark.py \
  --config configs/week3_model_benchmark.yaml \
  --cases data/samples/evaluation_set.json \
  --model aihub_baseline
```

## 디렉터리 구조

```text
AI-Civil-Affairs-Systems/
├── app/          # 애플리케이션 코드 (api/core/ingestion/retrieval/generation/ui/tests)
├── configs/      # 실험/런타임 설정
├── data/         # 원천/가공/샘플 데이터
├── docs/         # 프로젝트 문서 (개요/계약/도메인/매뉴얼/이슈/명세)
├── logs/         # 실행 로그
├── reports/      # 평가/분석 결과
├── schemas/      # 데이터 스키마
├── scripts/      # 실행/평가/검증 스크립트
└── requirements.txt
```

## 문서 가이드

- 개요/로드맵: [docs/00_overview/prd.md](docs/00_overview/prd.md), [docs/00_overview/mvp_scope.md](docs/00_overview/mvp_scope.md), [docs/00_overview/wbs_8weeks_v2_updated.md](docs/00_overview/wbs_8weeks_v2_updated.md)
- 인터페이스/계약: [docs/10_contracts/api/api_spec.md](docs/10_contracts/api/api_spec.md), [docs/10_contracts/schema/schema_contract.md](docs/10_contracts/schema/schema_contract.md), [docs/10_contracts/interfaces/README.md](docs/10_contracts/interfaces/README.md)
- 도메인 문서: [docs/20_domains/ingestion_structuring/README.md](docs/20_domains/ingestion_structuring/README.md)
- 팀 매뉴얼(통합): [docs/30_manuals/manual.md](docs/30_manuals/manual.md)
- 이슈/액션 플랜: [docs/50_issues/week5_6_adaptive_rag_core_action_plan.md](docs/50_issues/week5_6_adaptive_rag_core_action_plan.md)
- 구현 명세: [docs/60_specs/api_interface_spec.md](docs/60_specs/api_interface_spec.md), [docs/60_specs/data_schema_spec.md](docs/60_specs/data_schema_spec.md), [docs/60_specs/ui_workbench_spec.md](docs/60_specs/ui_workbench_spec.md)
- 폴더 상세: [docs/00_overview/folder_structure.md](docs/00_overview/folder_structure.md)

## 팀 구성

- BE1(팀장): 데이터 파이프라인, 구조화, 평가, 발표 총괄
- FE: UI/UX, 검색/QA 화면, 데모 흐름
- BE2: 임베딩/벡터DB/검색/검색평가
- BE3: API/LLM/RAG/파싱/성능 안정화

## 저장소 링크

- 저장소: https://github.com/Hangi-n42/AI-Civil-Affairs-Systems
- 이슈: https://github.com/Hangi-n42/AI-Civil-Affairs-Systems/issues
- PR: https://github.com/Hangi-n42/AI-Civil-Affairs-Systems/pulls
- Project: https://github.com/users/Hangi-n42/projects/1

## 과제 완료 현황

- 학기 프로젝트 제안서: [docs/project_proposal.md](docs/project_proposal.md)
- DORA 자동 수집 워크플로우: [.github/workflows/dora-metrics.yml](.github/workflows/dora-metrics.yml)
- 칸반 Project 및 백로그: [docs/kanban_setup.md](docs/kanban_setup.md)

검증 결과
- GitHub Project #1 생성 및 저장소 연결 완료
- 11개 이슈 생성 완료
- 2개 마일스톤 생성 완료
- 5단 상태 필드 `Board Status` 생성 완료
- DORA JSON/SVG/MD 아티팩트 생성 완료

## 라이선스

대학 졸업 프로젝트 (비공개)

Last Updated: 2026-04-10
Status: Active Development

## DORA 지표 자동 수집

- 워크플로우: [.github/workflows/dora-metrics.yml](.github/workflows/dora-metrics.yml)
- 계산 스크립트: [.github/scripts/calc_dora_metrics.mjs](.github/scripts/calc_dora_metrics.mjs)
- 시안 대시보드: [docs/dora_dashboard.html](docs/dora_dashboard.html)
- 대시보드 이미지: [docs/dora_dashboard.svg](docs/dora_dashboard.svg)
- 자동 수집 스크립트: [scripts/dora_metrics.js](scripts/dora_metrics.js)
- 칸반/백로그 자동 구성: [scripts/setup_github_board.js](scripts/setup_github_board.js)
- 생성 결과: [scripts/artifacts/dora-metrics-20260430.json](scripts/artifacts/dora-metrics-20260430.json), [scripts/artifacts/dora-dashboard-20260430.svg](scripts/artifacts/dora-dashboard-20260430.svg), [scripts/artifacts/dora-report-20260430.md](scripts/artifacts/dora-report-20260430.md)

