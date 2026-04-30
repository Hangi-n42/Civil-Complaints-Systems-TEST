const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

function loadLabelDefinitions() {
  const labelsPath = path.join(process.cwd(), '..', '.github', 'labels', 'labels.json');
  return JSON.parse(fs.readFileSync(labelsPath, 'utf8'));
}

async function upsertLabel(octokit, owner, repo, label) {
  try {
    await octokit.issues.createLabel({ owner, repo, name: label.name, color: label.color, description: label.description });
  } catch (error) {
    if (error.status === 422) {
      await octokit.request('PATCH /repos/{owner}/{repo}/labels/{name}', {
        owner,
        repo,
        name: label.name,
        new_name: label.name,
        color: label.color,
        description: label.description,
      });
    } else {
      throw error;
    }
  }
}

async function listAllIssues(octokit, owner, repo) {
  return octokit.paginate(octokit.issues.listForRepo, { owner, repo, state: 'all', per_page: 100 });
}

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!token || !repoFull) { console.error('GITHUB_TOKEN and GITHUB_REPOSITORY required'); process.exit(1); }
  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token, userAgent: 'dora-setup-script' });

  // 1) create labels
  const labels = loadLabelDefinitions();
  for (const label of labels) {
    await upsertLabel(octokit, owner, repo, label);
  }

  // 2) create 2 milestones
  const milestones = ['Sprint 1','Sprint 2'];
  const existingMilestones = await octokit.paginate(octokit.issues.listMilestones, { owner, repo, state: 'all', per_page: 100 });
  for (const m of milestones) {
    if (!existingMilestones.some(item => item.title === m)) {
      await octokit.issues.createMilestone({ owner, repo, title: m });
    }
  }

  // 3) create sample backlog issues (10+)
  const sample = [
    { title: '데이터 스키마 정의', labels: ['type: feature', 'area: data-pipeline', 'priority: high'], milestone: 'Sprint 1' },
    { title: 'ingestion 파이프라인 구축', labels: ['type: feature', 'area: data-pipeline', 'priority: high'], milestone: 'Sprint 1' },
    { title: 'TopicAnalyzer 초안 구현', labels: ['type: feature', 'area: structuring', 'priority: medium'], milestone: 'Sprint 1' },
    { title: 'ComplexityAnalyzer 초안 구현', labels: ['type: feature', 'area: structuring', 'priority: medium'], milestone: 'Sprint 1' },
    { title: 'AdaptiveRouter 설계', labels: ['type: feature', 'area: retrieval', 'priority: high'], milestone: 'Sprint 1' },
    { title: 'Retrieval 기본연동', labels: ['type: feature', 'area: retrieval', 'priority: high'], milestone: 'Sprint 1' },
    { title: 'PromptFactory 초안', labels: ['type: feature', 'area: backend', 'priority: medium'], milestone: 'Sprint 2' },
    { title: 'FastAPI 기본 엔드포인트', labels: ['type: feature', 'area: backend', 'priority: high'], milestone: 'Sprint 2' },
    { title: 'Next.js Workbench 초기 페이지', labels: ['type: feature', 'area: frontend', 'priority: medium'], milestone: 'Sprint 2' },
    { title: '유닛 테스트 및 CI 설정', labels: ['type: test', 'area: ops', 'priority: high'], milestone: 'Sprint 2' },
    { title: '데모 시나리오 작성', labels: ['type: docs', 'area: frontend', 'priority: low'], milestone: 'Sprint 2' },
    { title: '배포 알림 자동화', labels: ['type: chore', 'area: ops', 'priority: medium'], milestone: 'Sprint 2' },
  ];
  const existingIssues = await listAllIssues(octokit, owner, repo);
  const milestoneLookup = new Map(existingMilestones.map(item => [item.title, item.number]));
  for (const issue of sample) {
    const existingIssue = existingIssues.find(existing => existing.title === issue.title);
    if (!existingIssue) {
      await octokit.issues.create({ owner, repo, title: issue.title, labels: issue.labels, milestone: milestoneLookup.get(issue.milestone) });
    } else {
      await octokit.issues.update({ owner, repo, issue_number: existingIssue.number, labels: issue.labels, milestone: milestoneLookup.get(issue.milestone) });
    }
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

  console.log('Setup complete. Synced labels, milestones, sample issues.');
}

run().catch(e=>{ console.error(e); process.exit(1); });
