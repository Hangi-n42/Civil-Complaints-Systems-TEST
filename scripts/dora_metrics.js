const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!token || !repoFull) {
    console.error('GITHUB_TOKEN and GITHUB_REPOSITORY required');
    process.exit(1);
  }
  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token });
  const days = parseInt(process.env.DAYS || '30', 10);
  const since = dayjs().subtract(days, 'day').toISOString();

  // 1) fetch merged PRs since
  const prs = await octokit.paginate(octokit.pulls.list, {
    owner, repo, state: 'closed', per_page: 100
  });
  const merged = prs.filter(p => p.merged_at && p.merged_at >= since);

  // compute lead times (merge - first commit in PR)
  const prStats = [];
  for (const p of merged) {
    const commits = await octokit.paginate(octokit.pulls.listCommits, { owner, repo, pull_number: p.number, per_page: 100 });
    const firstCommitDate = commits.length ? commits[0].commit.committer.date : p.created_at;
    const leadMs = new Date(p.merged_at) - new Date(firstCommitDate);
    prStats.push({ number: p.number, merged_at: p.merged_at, lead_time_days: leadMs / (1000*60*60*24) });
  }

  const deploymentFrequency = merged.length / Math.max(1, days/7); // per week

  // 2) MTTR: use issues labeled 'incident' closed in period
  const issues = await octokit.paginate(octokit.issues.listForRepo, { owner, repo, state: 'all', since, per_page: 100 });
  const incidents = issues.filter(i => i.labels && i.labels.some(l => (l.name || l).toLowerCase().includes('incident')) );
  const mttrList = incidents.filter(i => i.closed_at).map(i => (new Date(i.closed_at) - new Date(i.created_at)) / (1000*60*60)); // hours
  const mttr = mttrList.length ? (mttrList.reduce((a,b)=>a+b,0)/mttrList.length) : null;

  // 3) Change Failure Rate: fraction of merged PRs followed by incident within 7 days
  let failures = 0;
  for (const p of merged) {
    const windowStart = dayjs(p.merged_at).toISOString();
    const windowEnd = dayjs(p.merged_at).add(7, 'day').toISOString();
    const related = incidents.find(i => i.created_at >= windowStart && i.created_at <= windowEnd);
    if (related) failures++;
  }
  const changeFailureRate = merged.length ? (failures / merged.length) : 0;

  const avgLeadDays = prStats.length ? (prStats.reduce((a,b)=>a+b.lead_time_days,0)/prStats.length) : null;

  const metrics = {
    period_days: days,
    merged_pr_count: merged.length,
    deployment_frequency_per_week: Number(deploymentFrequency.toFixed(2)),
    avg_lead_time_days: avgLeadDays ? Number(avgLeadDays.toFixed(2)) : null,
    mttr_hours: mttr ? Number(mttr.toFixed(2)) : null,
    change_failure_rate: Number(changeFailureRate.toFixed(3)),
    computed_at: new Date().toISOString(),
    prStats,
    incidents: incidents.map(i=>({number: i.number || null, title: i.title, created_at: i.created_at, closed_at: i.closed_at}))
  };

  const outDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const stamp = dayjs().format('YYYYMMDD');
  const jsonPath = path.join(outDir, `dora-metrics-${stamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(metrics, null, 2));
  console.log('Wrote metrics to', jsonPath);

  // generate a dependency-free SVG dashboard so Windows users can run it without native builds
  const chartValues = [
    { label: 'DeploymentFreq/wk', value: metrics.deployment_frequency_per_week || 0, color: '#1f77b4' },
    { label: 'AvgLeadDays', value: metrics.avg_lead_time_days || 0, color: '#ff7f0e' },
    { label: 'MTTR(h)', value: metrics.mttr_hours || 0, color: '#2ca02c' }
  ];
  const maxValue = Math.max(...chartValues.map(item => item.value), 1);
  const barWidth = 160;
  const gap = 60;
  const chartHeight = 240;
  const baseY = 300;
  const svgBars = chartValues.map((item, index) => {
    const barHeight = Math.max(6, Math.round((item.value / maxValue) * chartHeight));
    const x = 80 + index * (barWidth + gap);
    const y = baseY - barHeight;
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="12" fill="${item.color}" />
      <text x="${x + barWidth / 2}" y="${baseY + 28}" text-anchor="middle" font-size="16" fill="#1f2937">${item.label}</text>
      <text x="${x + barWidth / 2}" y="${y - 10}" text-anchor="middle" font-size="18" font-weight="700" fill="#111827">${item.value.toFixed(2)}</text>`;
  }).join('\n');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="920" height="420" viewBox="0 0 920 420">
    <rect width="100%" height="100%" rx="24" fill="#f8fafc" />
    <text x="460" y="52" text-anchor="middle" font-size="30" font-weight="700" fill="#0f172a">DORA Metrics Dashboard</text>
    <text x="460" y="84" text-anchor="middle" font-size="14" fill="#475569">Auto-generated locally without native dependencies</text>
    <line x1="60" y1="300" x2="860" y2="300" stroke="#cbd5e1" stroke-width="2" />
    ${svgBars}
  </svg>`;
  const svgPath = path.join(outDir, `dora-dashboard-${stamp}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Wrote dashboard SVG to', svgPath);

  // simple markdown report
  const report = [];
  report.push(`# DORA Metrics Report (${dayjs().format('YYYY-MM-DD')})\n`);
  report.push(`- Period (days): ${metrics.period_days}`);
  report.push(`- Merged PRs: ${metrics.merged_pr_count}`);
  report.push(`- Deployment frequency (/week): ${metrics.deployment_frequency_per_week}`);
  report.push(`- Avg lead time (days): ${metrics.avg_lead_time_days ?? 'N/A'}`);
  report.push(`- MTTR (hours): ${metrics.mttr_hours ?? 'N/A'}`);
  report.push(`- Change failure rate: ${metrics.change_failure_rate}`);
  report.push(`\nGenerated artifacts:\n- ${path.relative(process.cwd(), jsonPath)}\n- ${path.relative(process.cwd(), svgPath)}`);
  const reportPath = path.join(outDir, `dora-report-${stamp}.md`);
  fs.writeFileSync(reportPath, report.join('\n'));
  console.log('Wrote report to', reportPath);
}

run().catch(e=>{ console.error(e); process.exit(1); });
