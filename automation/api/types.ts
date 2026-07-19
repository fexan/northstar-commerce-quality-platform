export interface StoreRegion {
  id: string
  currency_code: string
  countries: Array<{ iso_2: string }>
}

export interface StoreProductOptionValue {
  value: string
}

export interface StoreProductVariant {
  id: string
  title: string
  inventory_quantity?: number
  options?: Array<{ value: string }>
}

export interface StoreProduct {
  id: string
  title: string
  handle: string
  description?: string
  variants: StoreProductVariant[]
  options?: Array<{ title: string; values: StoreProductOptionValue[] }>
}

export interface StoreCartLineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  total: number
  variant_id: string
}

export interface StoreCart {
  id: string
  region_id: string
  email?: string
  currency_code: string
  items: StoreCartLineItem[]
  item_total: number
  subtotal: number
  total: number
}

export interface StoreCustomer {
  id: string
  email: string
  first_name?: string
  last_name?: string
}
