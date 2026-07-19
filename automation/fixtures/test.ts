import { test as base } from '@playwright/test'
import { MedusaStoreClient } from '../api/medusa-store.client'
import {
  createCartWithProduct,
  type PreparedCart,
} from '../factories/cart.factory'
import {
  createUniqueCustomer,
  type CustomerData,
} from '../factories/customer.factory'

interface NorthstarFixtures {
  storeApi: MedusaStoreClient
  preparedCart: PreparedCart
  registeredCustomer: CustomerData
  customerCleanup: {
    trackEmail(email: string): void
  }
}

export const test = base.extend<NorthstarFixtures>({
  storeApi: async ({ request }, use) => {
    await use(new MedusaStoreClient(request))
  },
  preparedCart: async ({ context, storeApi, baseURL }, use) => {
    const prepared = await createCartWithProduct(storeApi)
    const cookieUrl = baseURL ?? 'http://127.0.0.1:8000'

    await context.addCookies([
      {
        name: '_medusa_cart_id',
        value: prepared.cart.id,
        url: cookieUrl,
        httpOnly: true,
        sameSite: 'Strict',
      },
    ])

    await use(prepared)
  },
  registeredCustomer: async ({ storeApi }, use) => {
    const customer = createUniqueCustomer()
    const createdCustomer = await storeApi.provisionCustomer(customer)
    try {
      await use(customer)
    } finally {
      await storeApi.deleteCustomer(createdCustomer.id)
    }
  },
  customerCleanup: async ({ storeApi }, use) => {
    const emails = new Set<string>()
    await use({ trackEmail: (email) => emails.add(email) })

    for (const email of emails) {
      await storeApi.deleteCustomersByEmail(email)
    }
  },
})

export { expect } from '@playwright/test'
