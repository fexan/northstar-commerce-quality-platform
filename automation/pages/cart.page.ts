import { expect, type Locator, type Page } from '@playwright/test'

export class CartPage {
  readonly page: Page
  readonly rows: Locator
  readonly subtotal: Locator
  readonly emptyCartMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.rows = page.getByTestId('product-row')
    this.subtotal = page.getByTestId('cart-subtotal')
    this.emptyCartMessage = page.getByTestId('empty-cart-message')
  }

  async goto(): Promise<void> {
    await this.page.goto('/dk/cart')
  }

  rowFor(productName: string): Locator {
    return this.rows.filter({ hasText: productName })
  }

  async updateQuantity(productName: string, quantity: number): Promise<void> {
    const row = this.rowFor(productName)
    await expect(row).toHaveCount(1)
    await row
      .getByTestId('product-select-button')
      .selectOption(String(quantity))
  }

  async remove(productName: string): Promise<void> {
    const row = this.rowFor(productName)
    await expect(row).toHaveCount(1)
    await row.getByRole('button').click()
    await expect(row).toHaveCount(0)
  }

  async subtotalValue(): Promise<number> {
    return Number(await this.subtotal.getAttribute('data-value'))
  }
}
