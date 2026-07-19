import { expect, test } from '../../../fixtures/test'
import { createUniqueCustomer } from '../../../factories/customer.factory'

test('@api cart API creates and retrieves an isolated cart', async ({
  storeApi,
}) => {
  const region = await storeApi.regionForCountry('dk')
  const customer = createUniqueCustomer()
  const created = await storeApi.createCart(region.id, customer.email)
  const retrieved = await storeApi.retrieveCart(created.id)

  expect(retrieved.id).toBe(created.id)
  expect(retrieved.region_id).toBe(region.id)
  expect(retrieved.email).toBe(customer.email)
  expect(retrieved.items).toEqual([])
})

test('@api adding a line item updates cart contents and totals', async ({
  preparedCart,
  storeApi,
}) => {
  const retrieved = await storeApi.retrieveCart(preparedCart.cart.id)

  expect(retrieved.items).toHaveLength(1)
  expect(retrieved.items[0].variant_id).toBe(preparedCart.variantId)
  expect(retrieved.items[0].quantity).toBe(1)
  expect(retrieved.item_total).toBeGreaterThan(0)
  expect(retrieved.total).toBeGreaterThan(0)
})
