import { expect, test } from '../../../fixtures/test'
import { CartPage } from '../../../pages/cart.page'

test('API-prepared cart is displayed in the storefront UI', async ({
  page,
  preparedCart,
}) => {
  const cart = new CartPage(page)
  await cart.goto()

  await expect(cart.rowFor(preparedCart.product.title)).toHaveCount(1)
  await expect(cart.subtotal).toHaveAttribute(
    'data-value',
    String(preparedCart.cart.item_total),
  )
})
