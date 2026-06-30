import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

/**
 * Test Suite: Authentication
 * Verifies: login success/failure paths against acceptance criteria
 * Validates: real user-facing behavior (error visibility, navigation)
 *
 * Traceability: TC-AUTH-001, TC-AUTH-002, TC-AUTH-003 (see docs/test-plan.md)
 */
test.describe('Authentication', () => {
  test('TC-AUTH-001: user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');

    await expect(dashboardPage.dashboardHeader).toBeVisible();
    expect(await dashboardPage.isLoaded()).toBe(true);
  });

  test('TC-AUTH-002: invalid credentials show an error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('InvalidUser', 'wrongpassword');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('TC-AUTH-003: empty username field blocks submission', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.passwordInput.fill('admin123');
    await loginPage.loginButton.click();

    // Required-field validation should appear instead of navigating away
    await expect(page).toHaveURL(/auth\/login/);
  });
});
