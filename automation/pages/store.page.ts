import { expect, type Locator, type Page } from '@playwright/test'

export class StorePage {
  readonly page: Page
  readonly productCards: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.getByTestId('product-wrapper')
  }

  async goto(): Promise<void> {
    await this.page.goto('/dk/store')
    await expect(
      this.page.getByRole('heading', { name: 'All products' }),
    ).toBeVisible()
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name })
  }

  async openProduct(name: string): Promise<void> {
    const card = this.productCard(name)
    await expect(card).toHaveCount(1)
    await card.locator('..').click()
  }
}
