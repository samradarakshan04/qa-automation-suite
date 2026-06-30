import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    this.dashboardHeader = page.getByText('Dashboard', { exact: true });
  }

  async isLoaded(): Promise<boolean> {
    return await this.dashboardHeader.isVisible();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }
}
