import { expect, test } from '@playwright/test'
import { ProductPage } from '../../../pages/product.page'
import { StorePage } from '../../../pages/store.page'

test('catalogue displays the stable seeded products', async ({ page }) => {
  const store = new StorePage(page)
  await store.goto()

  for (const product of [
    'Medusa T-Shirt',
    'Medusa Sweatshirt',
    'Medusa Sweatpants',
    'Medusa Shorts',
  ]) {
    await expect(store.productCard(product)).toHaveCount(1)
  }
})

test('@smoke product details match the selected catalogue item', async ({
  page,
}) => {
  const store = new StorePage(page)
  const product = new ProductPage(page)
  await store.goto()
  await store.openProduct('Medusa T-Shirt')

  await expect(product.title).toHaveText('Medusa T-Shirt')
  await expect(product.description).toContainText('classic T-shirt')
  await expect(product.price).toContainText('€10.00')
})

test('customer can select a complete product variant', async ({ page }) => {
  const product = new ProductPage(page)
  await product.goto('t-shirt')

  await product.selectOption('Color', 'Black')
  await product.selectOption('Size', 'M')

  await expect(product.addToCartButton).toBeEnabled()
  await expect(page).toHaveURL(/v_id=variant_/)
})
