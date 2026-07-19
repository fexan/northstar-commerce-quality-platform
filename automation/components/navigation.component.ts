import { expect, type Page } from '@playwright/test'

export class NavigationComponent {
  constructor(private readonly page: Page) {}

  async openStore(): Promise<void> {
    await this.page.getByTestId('nav-store-link').click()
    await expect(this.page).toHaveURL(/\/dk$/)
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('nav-cart-link').click()
    await expect(this.page).toHaveURL(/\/dk\/cart$/)
  }
}
