import { defineConfig, devices } from '@playwright/test';

/**
 * [12주차 선택] Playwright 설정
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,           // 테스트 타임아웃: 30초
  expect: { timeout: 10000 },   // expect 타임아웃: 10초
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,  // CI에서만 재시도
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    // CI에서 GitHub Actions 리포터 사용
    ...(process.env.CI ? [['github'] as [string]] : []),
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',    // 첫 재시도 시 트레이스 저장
    screenshot: 'only-on-failure',  // 실패 시만 스크린샷
    video: 'retain-on-failure', // 실패 시만 비디오
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // CI에서는 Chromium만 실행 (속도)
    ...(process.env.CI ? [] : [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
    ]),
  ],

  // 로컬에서만 dev server 자동 시작
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    cwd: './frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60 * 1000,
  },

  outputDir: 'test-results/',
});
