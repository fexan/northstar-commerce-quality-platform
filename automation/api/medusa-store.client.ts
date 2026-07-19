import { expect, type APIRequestContext } from '@playwright/test'
import { environment } from '../config/environment'
import type {
  StoreCart,
  StoreCustomer,
  StoreProduct,
  StoreRegion,
} from './types'

export class MedusaStoreClient {
  private readonly headers: Record<string, string>

  constructor(private readonly request: APIRequestContext) {
    if (!environment.publishableKey) {
      throw new Error(
        'MEDUSA_PUBLISHABLE_KEY or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required',
      )
    }

    this.headers = {
      'x-publishable-api-key': environment.publishableKey,
    }
  }

  async listRegions(): Promise<StoreRegion[]> {
    const response = await this.request.get(
      `${environment.backendBaseUrl}/store/regions`,
      { headers: this.headers },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { regions: StoreRegion[] }).regions
  }

  async regionForCountry(countryCode: string): Promise<StoreRegion> {
    const regions = await this.listRegions()
    const region = regions.find((candidate) =>
      candidate.countries.some(
        (country) => country.iso_2.toLowerCase() === countryCode.toLowerCase(),
      ),
    )
    if (!region) throw new Error(`No region found for ${countryCode}`)
    return region
  }

  async listProducts(regionId?: string): Promise<StoreProduct[]> {
    const response = await this.request.get(
      `${environment.backendBaseUrl}/store/products`,
      {
        headers: this.headers,
        params: {
          limit: 100,
          fields:
            '*variants.calculated_price,+variants.inventory_quantity,*variants.options',
          ...(regionId ? { region_id: regionId } : {}),
        },
      },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { products: StoreProduct[] }).products
  }

  async productByHandle(
    handle: string,
    regionId?: string,
  ): Promise<StoreProduct> {
    const products = await this.listProducts(regionId)
    const product = products.find((candidate) => candidate.handle === handle)
    if (!product) throw new Error(`Product not found: ${handle}`)
    return product
  }

  async createCart(regionId: string, email?: string): Promise<StoreCart> {
    const response = await this.request.post(
      `${environment.backendBaseUrl}/store/carts`,
      {
        headers: this.headers,
        data: { region_id: regionId, ...(email ? { email } : {}) },
      },
    )
    expect(response.status()).toBe(200)
    return ((await response.json()) as { cart: StoreCart }).cart
  }

  async retrieveCart(cartId: string): Promise<StoreCart> {
    const response = await this.request.get(
      `${environment.backendBaseUrl}/store/carts/${cartId}`,
      {
        headers: this.headers,
        params: {
          fields:
            '*items,*items.variant,*items.product,+items.total,+item_total,+subtotal,+total',
        },
      },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { cart: StoreCart }).cart
  }

  async addLineItem(
    cartId: string,
    variantId: string,
    quantity: number,
  ): Promise<StoreCart> {
    const response = await this.request.post(
      `${environment.backendBaseUrl}/store/carts/${cartId}/line-items`,
      {
        headers: this.headers,
        data: { variant_id: variantId, quantity },
      },
    )
    expect(response.status()).toBe(200)
    return ((await response.json()) as { cart: StoreCart }).cart
  }

  async registerCustomerIdentity(
    email: string,
    password: string,
  ): Promise<string> {
    const response = await this.request.post(
      `${environment.backendBaseUrl}/auth/customer/emailpass/register`,
      { data: { email, password } },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { token: string }).token
  }

  async createCustomer(
    token: string,
    data: {
      email: string
      first_name: string
      last_name: string
      phone?: string
    },
  ): Promise<StoreCustomer> {
    const response = await this.request.post(
      `${environment.backendBaseUrl}/store/customers`,
      {
        headers: { ...this.headers, authorization: `Bearer ${token}` },
        data,
      },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { customer: StoreCustomer }).customer
  }

  async provisionCustomer(data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<StoreCustomer> {
    const token = await this.registerCustomerIdentity(data.email, data.password)
    return this.createCustomer(token, {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
    })
  }

  private adminHeaders(): Record<string, string> {
    if (!environment.adminApiKey) {
      throw new Error(
        'MEDUSA_ADMIN_API_KEY is required to clean up test customers',
      )
    }

    return { authorization: `Basic ${environment.adminApiKey}` }
  }

  async findCustomersByEmail(email: string): Promise<StoreCustomer[]> {
    const response = await this.request.get(
      `${environment.backendBaseUrl}/admin/customers`,
      {
        headers: this.adminHeaders(),
        params: { email, limit: 100 },
      },
    )
    expect(response.ok()).toBeTruthy()
    return ((await response.json()) as { customers: StoreCustomer[] }).customers
  }

  async deleteCustomer(customerId: string): Promise<void> {
    const response = await this.request.delete(
      `${environment.backendBaseUrl}/admin/customers/${customerId}`,
      { headers: this.adminHeaders() },
    )
    expect(response.ok()).toBeTruthy()
  }

  async deleteCustomersByEmail(email: string): Promise<void> {
    const customers = await this.findCustomersByEmail(email)
    await Promise.all(
      customers.map((customer) => this.deleteCustomer(customer.id)),
    )
  }
}
