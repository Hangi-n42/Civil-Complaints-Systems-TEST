칸반 보드 및 백로그 설정 안내

스크립트 `scripts/setup_github_board.js` 는 다음을 자동으로 생성합니다:
- 레이블: type: bug/feature/docs/chore/refactor/test, area: backend/frontend/data-pipeline/retrieval/structuring/ops, priority: high/medium/low, status: blocked/needs-triage/ready-for-review, good first issue, incident, ops
- 마일스톤: Sprint 1, Sprint 2
- 샘플 이슈(10개 이상)
- (가능하면) classic Project "Kanban Board" 와 컬럼(Backlog/To Do/In Progress/Review/Done)

실행 방법 (로컬 또는 GitHub Actions에서 수동 실행 가능):

```bash
cd scripts
npm ci
GITHUB_TOKEN=<<your token>> GITHUB_REPOSITORY=owner/repo node setup_github_board.js
```

분석
- Cycle Time: 이슈의 `created_at` → `closed_at` 차이
- Velocity: Sprint 별 완료 이슈 개수 (마일스톤 기반)
- Burndown: 스프린트 기간 동안 남은 이슈 수 추적

자동 분석 산출물
- 워크플로우: [.github/workflows/kanban-metrics.yml](.github/workflows/kanban-metrics.yml)
- 계산 스크립트: [scripts/calc_kanban_metrics.js](scripts/calc_kanban_metrics.js)
- JSON 최신본: [reports/kanban/kanban_metrics_latest.json](reports/kanban/kanban_metrics_latest.json)
- 주간 보고서: [docs/kanban_reports/kanban_weekly_report_latest.md](docs/kanban_reports/kanban_weekly_report_latest.md)
