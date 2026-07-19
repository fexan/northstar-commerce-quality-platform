import { expect, test, type Page } from '@playwright/test'
import { CartPage } from '../../../pages/cart.page'
import { NavigationComponent } from '../../../components/navigation.component'
import { ProductPage } from '../../../pages/product.page'

async function addSweatshirt(page: Page) {
  const product = new ProductPage(page)
  await product.goto('sweatshirt')
  await product.selectOption('Size', 'M')
  await product.addToCart()
}

test('@smoke customer can add a product and retain the cart while navigating', async ({
  page,
}) => {
  const navigation = new NavigationComponent(page)
  const cart = new CartPage(page)
  await addSweatshirt(page)

  await navigation.openStore()
  await navigation.openCart()
  await expect(cart.rowFor('Medusa Sweatshirt')).toHaveCount(1)
})

test('cart quantity changes update the subtotal', async ({ page }) => {
  const cart = new CartPage(page)
  await addSweatshirt(page)
  await cart.goto()

  const originalSubtotal = await cart.subtotalValue()
  await cart.updateQuantity('Medusa Sweatshirt', 2)
  await expect
    .poll(() => cart.subtotalValue(), { timeout: 15_000 })
    .toBe(originalSubtotal * 2)
})

test('customer can remove an item from the cart', async ({ page }) => {
  const cart = new CartPage(page)
  await addSweatshirt(page)
  await cart.goto()

  await cart.remove('Medusa Sweatshirt')
  await expect(cart.emptyCartMessage).toBeVisible()
})
