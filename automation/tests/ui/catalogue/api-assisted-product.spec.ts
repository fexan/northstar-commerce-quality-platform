import { expect, test } from '../../../fixtures/test'
import { ProductPage } from '../../../pages/product.page'

test('API-selected product details agree with the storefront UI', async ({
  page,
  storeApi,
}) => {
  const region = await storeApi.regionForCountry('dk')
  const apiProduct = await storeApi.productByHandle('t-shirt', region.id)
  const productPage = new ProductPage(page)

  await productPage.goto(apiProduct.handle)

  await expect(productPage.title).toHaveText(apiProduct.title)
  await expect(productPage.description).toHaveText(apiProduct.description ?? '')
})
