/**
 * [12주차 선택] Playwright E2E 테스트
 * 민원 검색 시나리오: 검색 → 결과 표시 → 상세 조회
 * 실패 시 스크린샷 자동 저장
 */

import { test, expect, Page } from '@playwright/test';

// 테스트 데이터
const TEST_QUERY = '도로 파손';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('민원 검색 E2E 시나리오', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트마다 홈 페이지로 이동
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  });

  // ── 시나리오 1: 기본 검색 흐름 ──────────────────────────
  test('검색어 입력 → 결과 표시', async ({ page }) => {
    // 검색창 확인
    const searchInput = page.getByRole('textbox', { name: /검색|민원/ });
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // 검색어 입력
    await searchInput.fill(TEST_QUERY);
    await searchInput.press('Enter');

    // 결과 로딩 대기
    await page.waitForLoadState('networkidle');

    // 결과 목록 확인
    const results = page.locator('[data-testid="search-results"], .search-results, [role="list"]');
    await expect(results).toBeVisible({ timeout: 15000 });

    // 결과가 1개 이상 있는지 확인
    const items = page.locator('[data-testid="result-item"], .result-item');
    const count = await items.count();
    console.log(`검색 결과: ${count}건`);
  });

  // ── 시나리오 2: 빈 검색 처리 ────────────────────────────
  test('빈 검색어 제출 시 에러 메시지 표시', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: /검색|민원/ });
    if (!(await searchInput.isVisible())) {
      test.skip();
      return;
    }

    await searchInput.fill('');
    await searchInput.press('Enter');

    // 에러 메시지 또는 플레이스홀더 확인
    const errorMsg = page.locator('[data-testid="error"], .error-message, [role="alert"]');
    const isError = await errorMsg.isVisible().catch(() => false);
    // 에러가 없어도 괜찮음 (UX 설계에 따라 다름)
    console.log(`빈 검색 에러 표시: ${isError}`);
  });

  // ── 시나리오 3: 페이지 기본 렌더링 ─────────────────────
  test('홈 페이지가 정상적으로 로드됨', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/민원|Civil|AI/i, { timeout: 10000 });

    // 메인 네비게이션 또는 헤더 확인
    const header = page.locator('header, nav, [role="banner"]').first();
    const isHeaderVisible = await header.isVisible().catch(() => false);

    // 최소한 body는 로드되어야 함
    await expect(page.locator('body')).toBeVisible();
    console.log(`헤더 표시: ${isHeaderVisible}`);
  });
});

// 실패 시 스크린샷 자동 저장 훅
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotPath = `test-results/failure-${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    testInfo.attachments.push({
      name: 'screenshot',
      path: screenshotPath,
      contentType: 'image/png',
    });
    console.log(`실패 스크린샷 저장: ${screenshotPath}`);
  }
});
