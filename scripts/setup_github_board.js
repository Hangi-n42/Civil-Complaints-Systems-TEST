const { Octokit } = require('@octokit/rest');
async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!token || !repoFull) { console.error('GITHUB_TOKEN and GITHUB_REPOSITORY required'); process.exit(1); }
  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token, userAgent: 'dora-setup-script' });

  // 1) create labels
  const labels = [
    {name:'bug', color:'d73a4a'}, {name:'enhancement', color:'a2eeef'}, {name:'incident', color:'fbca04'}, {name:'good first issue', color:'7057ff'}, {name:'documentation', color:'0075ca'}, {name:'ops', color:'0e8a16'}
  ];
  for (const l of labels) {
    try { await octokit.issues.createLabel({ owner, repo, name: l.name, color: l.color }); } catch(e){ }
  }

  // 2) create 2 milestones
  const milestones = ['Sprint 1','Sprint 2'];
  for (const m of milestones) {
    try { await octokit.issues.createMilestone({ owner, repo, title: m }); } catch(e){ }
  }

  // 3) create sample backlog issues (10+)
  const sample = [
    '데이터 스키마 정의', 'ingestion 파이프라인 구축', 'TopicAnalyzer 초안 구현', 'ComplexityAnalyzer 초안 구현', 'AdaptiveRouter 설계', 'Retrieval 기본연동', 'PromptFactory 초안', 'FastAPI 기본 엔드포인트', 'Next.js Workbench 초기 페이지', '유닛 테스트 및 CI 설정', '데모 시나리오 작성'
  ];
  for (const title of sample) {
    try { await octokit.issues.create({ owner, repo, title, labels: ['good first issue'] }); } catch(e){}
  }

  // 4) Try to create a classic project board (may require permissions)
  try {
    const proj = await octokit.request('POST /repos/{owner}/{repo}/projects', { owner, repo, name: 'Kanban Board', body: 'Auto-created kanban', mediaType: { previews: ['inertia'] } });
    const cols = ['Backlog','To Do','In Progress','Review','Done'];
    for (const c of cols) {
      await octokit.request('POST /projects/{project_id}/columns', { project_id: proj.data.id, name: c, mediaType: { previews: ['inertia'] } });
    }
    console.log('Created project and columns');
  } catch(e) {
    console.warn('Could not create project board automatically:', e.message);
  }

  console.log('Setup complete. Created labels, milestones, sample issues.');
}

run().catch(e=>{ console.error(e); process.exit(1); });
