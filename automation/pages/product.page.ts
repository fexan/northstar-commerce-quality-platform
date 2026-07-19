import { expect, test, type Locator, type Page } from '@playwright/test'

export class ProductPage {
  readonly page: Page
  readonly container: Locator
  readonly title: Locator
  readonly description: Locator
  readonly price: Locator
  readonly addToCartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.getByTestId('product-container')
    this.title = this.container.getByTestId('product-title')
    this.description = this.container.getByTestId('product-description')
    this.price = this.container.getByTestId('product-price')
    this.addToCartButton = this.container.getByTestId('add-product-button')
  }

  async goto(handle: string): Promise<void> {
    await test.step(`Open product: ${handle}`, async () => {
      await this.page.goto(`/dk/products/${handle}`)
      await expect(this.title).toBeVisible()
    })
  }

  async selectOption(optionName: string, value: string): Promise<void> {
    await test.step(`Select ${optionName}: ${value}`, async () => {
      await expect(
        this.container.getByText(`Select ${optionName}`, { exact: true }),
      ).toBeVisible()
      const option = this.container.getByRole('button', {
        name: value,
        exact: true,
      })
      await expect(option).toHaveCount(1)
      await option.click()
    })
  }

  async addToCart(): Promise<void> {
    await test.step('Add the selected product to the cart', async () => {
      await expect(this.addToCartButton).toBeEnabled()
      await this.addToCartButton.click()
      await expect(this.page.getByTestId('nav-cart-link')).toContainText(
        'Cart (1)',
      )
    })
  }
}
