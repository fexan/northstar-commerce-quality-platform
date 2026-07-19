import { expect, test } from '../../../fixtures/test'

test('@api products API returns usable seeded product data', async ({
  storeApi,
}) => {
  const region = await storeApi.regionForCountry('dk')
  const products = await storeApi.listProducts(region.id)

  expect(products.length).toBeGreaterThanOrEqual(4)
  expect(
    products.every(
      (product) =>
        product.id &&
        product.title &&
        product.handle &&
        product.variants.length,
    ),
  ).toBeTruthy()
})
