const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function paginateAll(octokit, method, params) {
  return octokit.paginate(method, { ...params, per_page: 100 });
}

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repoFull = process.env.GITHUB_REPOSITORY;
  if (!token || !repoFull) {
    console.error('GITHUB_TOKEN and GITHUB_REPOSITORY required');
    process.exit(1);
  }

  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token, userAgent: 'kanban-metrics-script' });
  const lookbackDays = parseInt(process.env.KANBAN_WINDOW_DAYS || '30', 10);
  const since = dayjs().subtract(lookbackDays, 'day');

  const issues = (await paginateAll(octokit, octokit.issues.listForRepo, { owner, repo, state: 'all' }))
    .filter(issue => !issue.pull_request);
  const milestones = await paginateAll(octokit, octokit.issues.listMilestones, { owner, repo, state: 'all' });

  const completedIssues = issues.filter(issue => issue.closed_at && dayjs(issue.closed_at).isAfter(since));
  const cycleTimesHours = completedIssues.map(issue => dayjs(issue.closed_at).diff(dayjs(issue.created_at), 'hour', true));

  const milestoneMetrics = milestones
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(milestone => {
      const milestoneIssues = issues.filter(issue => issue.milestone && issue.milestone.number === milestone.number);
      const completed = milestoneIssues.filter(issue => issue.closed_at);
      const open = milestoneIssues.filter(issue => !issue.closed_at);
      const startDate = dayjs(milestone.created_at);
      const endDate = milestone.due_on ? dayjs(milestone.due_on).endOf('day') : dayjs().endOf('day');
      const days = Math.max(1, endDate.diff(startDate, 'day') + 1);
      const burndown = [];

      for (let offset = 0; offset < days; offset += 1) {
        const current = startDate.add(offset, 'day');
        const remaining = milestoneIssues.filter(issue => {
          const created = dayjs(issue.created_at);
          const closed = issue.closed_at ? dayjs(issue.closed_at) : null;
          return created.valueOf() <= current.endOf('day').valueOf() && (!closed || closed.valueOf() > current.endOf('day').valueOf());
        }).length;
        burndown.push({ date: current.format('YYYY-MM-DD'), remaining });
      }

      return {
        number: milestone.number,
        title: milestone.title,
        state: milestone.state,
        due_on: milestone.due_on,
        created_at: milestone.created_at,
        completed_issues: completed.length,
        open_issues: open.length,
        cycle_time_hours: completed.length
          ? Number(average(completed.map(issue => dayjs(issue.closed_at).diff(dayjs(issue.created_at), 'hour', true))).toFixed(2))
          : null,
        burndown,
      };
    });

  const metrics = {
    repository: repoFull,
    generated_at: new Date().toISOString(),
    window_days: lookbackDays,
    cycle_time: {
      sample_size: cycleTimesHours.length,
      average_hours: cycleTimesHours.length ? Number(average(cycleTimesHours).toFixed(2)) : null,
      median_hours: cycleTimesHours.length ? Number(median(cycleTimesHours).toFixed(2)) : null,
      p95_hours: cycleTimesHours.length ? Number([...cycleTimesHours].sort((a, b) => a - b)[Math.min(cycleTimesHours.length - 1, Math.ceil(cycleTimesHours.length * 0.95) - 1)].toFixed(2)) : null,
    },
    velocity: {
      total_completed_issues: completedIssues.length,
      by_milestone: milestoneMetrics.map(metric => ({
        milestone: metric.title,
        completed_issues: metric.completed_issues,
      })),
    },
    burndown: milestoneMetrics.map(metric => ({
      milestone: metric.title,
      due_on: metric.due_on,
      points: metric.burndown,
    })),
    milestones: milestoneMetrics,
  };

  const outDir = path.join(process.cwd(), '..', 'reports', 'kanban');
  fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'kanban_metrics_latest.json');
  fs.writeFileSync(jsonPath, JSON.stringify(metrics, null, 2));

  const markdownLines = [
    '# Kanban Metrics Report',
    '',
    `- Repository: ${repoFull}`,
    `- Generated at: ${metrics.generated_at}`,
    `- Window days: ${lookbackDays}`,
    '',
    '## Cycle Time',
    `- Sample size: ${metrics.cycle_time.sample_size}`,
    `- Average hours: ${metrics.cycle_time.average_hours ?? 'N/A'}`,
    `- Median hours: ${metrics.cycle_time.median_hours ?? 'N/A'}`,
    `- P95 hours: ${metrics.cycle_time.p95_hours ?? 'N/A'}`,
    '',
    '## Velocity',
    `- Completed issues: ${metrics.velocity.total_completed_issues}`,
    ...metrics.velocity.by_milestone.map(item => `- ${item.milestone}: ${item.completed_issues}`),
    '',
    '## Burndown',
    ...metrics.burndown.map(item => `- ${item.milestone}: ${item.points.length} daily points`),
    '',
    '## Artifacts',
    `- JSON: ${path.relative(process.cwd(), jsonPath)}`,
  ];

  const reportPath = path.join(outDir, 'kanban_weekly_report.md');
  fs.writeFileSync(reportPath, markdownLines.join('\n'));

  const docsReportDir = path.join(process.cwd(), '..', 'docs', 'kanban_reports');
  fs.mkdirSync(docsReportDir, { recursive: true });
  const docsReportPath = path.join(docsReportDir, 'kanban_weekly_report_latest.md');
  fs.writeFileSync(docsReportPath, markdownLines.join('\n'));

  console.log(JSON.stringify({ jsonPath, reportPath, docsReportPath, metrics }, null, 2));
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});