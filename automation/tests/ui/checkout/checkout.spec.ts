import { expect, test } from '../../../fixtures/test'
import {
  CheckoutPage,
  danishShippingAddress,
} from '../../../pages/checkout.page'

test('missing shipping fields prevent checkout progression', async ({
  page,
  preparedCart,
}) => {
  expect(preparedCart.cart.items).toHaveLength(1)
  const checkout = new CheckoutPage(page)
  await checkout.goto()
  await page.getByTestId('submit-address-button').click()

  await expect(page.getByTestId('shipping-first-name-input')).toBeFocused()
  await expect(page).toHaveURL(/step=address/)
})

test('checkout summary reflects the API-prepared product and quantity', async ({
  page,
  preparedCart,
}) => {
  const checkout = new CheckoutPage(page)
  await checkout.goto()

  await expect(
    page.getByTestId('items-table').getByTestId('product-title'),
  ).toHaveText(preparedCart.product.title)
  await expect(page.getByTestId('cart-subtotal')).toHaveAttribute(
    'data-value',
    String(preparedCart.cart.item_total),
  )
})

test('@smoke customer can complete checkout with manual test payment', async ({
  page,
  preparedCart,
}) => {
  expect(preparedCart.cart.items).toHaveLength(1)
  const checkout = new CheckoutPage(page)
  await checkout.goto()
  await checkout.fillShippingAddress({
    ...danishShippingAddress,
    email: `checkout-${crypto.randomUUID()}@example.test`,
  })
  await checkout.continueToDelivery()
  await checkout.selectDelivery()
  await checkout.selectManualPayment()
  await checkout.placeOrder()

  await expect(
    page.getByText('Your order was placed successfully.'),
  ).toBeVisible()
  await expect(page.getByTestId('order-id')).not.toBeEmpty()
})
