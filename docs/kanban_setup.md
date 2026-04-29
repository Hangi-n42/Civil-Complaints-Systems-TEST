칸반 보드 및 백로그 설정 안내

스크립트 `scripts/setup_github_board.js` 는 다음을 자동으로 생성합니다:
- 레이블: bug, enhancement, incident, good first issue, documentation, ops
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
- Cycle Time: 이슈의 `created_at` → `closed_at` 차이(가능하면 각 칼럼 이동 타임스탬프 필요)
- Velocity: Sprint 별 완료 이슈 개수 (마일스톤 기반)
- Burndown: 스프린트 기간 동안 남은 이슈 수 추적

참고: 자동으로 심층 분석을 위해서는 프로젝트 칼럼 이동 로그(Projects API)를 추가로 조회해야 합니다. 필요하면 분석 스크립트를 추가 구현해 드립니다.
