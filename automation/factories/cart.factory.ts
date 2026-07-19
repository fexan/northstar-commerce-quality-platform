import type { MedusaStoreClient } from '../api/medusa-store.client'
import type { StoreCart, StoreProduct } from '../api/types'
import { createUniqueCustomer } from './customer.factory'

export interface PreparedCart {
  cart: StoreCart
  product: StoreProduct
  variantId: string
}

export async function createCartWithProduct(
  client: MedusaStoreClient,
  productHandle = 'sweatshirt',
  quantity = 1,
): Promise<PreparedCart> {
  const region = await client.regionForCountry('dk')
  const product = await client.productByHandle(productHandle, region.id)
  const variant = product.variants.find(
    (candidate) => (candidate.inventory_quantity ?? 0) > 0,
  )

  if (!variant)
    throw new Error(`No in-stock variant found for ${productHandle}`)

  const customer = createUniqueCustomer()
  const emptyCart = await client.createCart(region.id, customer.email)
  const cart = await client.addLineItem(emptyCart.id, variant.id, quantity)

  return { cart, product, variantId: variant.id }
}
