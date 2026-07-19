import { expect, test, type Page } from '@playwright/test'

export interface ShippingAddressData {
  firstName: string
  lastName: string
  address: string
  postalCode: string
  city: string
  countryCode: string
  email: string
  phone: string
}

export const danishShippingAddress: ShippingAddressData = {
  firstName: 'Northstar',
  lastName: 'Customer',
  address: '1 Test Street',
  postalCode: '1000',
  city: 'Copenhagen',
  countryCode: 'dk',
  email: `checkout-${Date.now()}@example.test`,
  phone: '+4512345678',
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await test.step('Open checkout at the shipping-address step', async () => {
      await this.page.goto('/dk/checkout?step=address')
      await expect(
        this.page.getByRole('heading', { name: 'Shipping Address' }),
      ).toBeVisible()
    })
  }

  async fillShippingAddress(address: ShippingAddressData): Promise<void> {
    await test.step('Enter the shipping and contact information', async () => {
      await this.page
        .getByTestId('shipping-first-name-input')
        .fill(address.firstName)
      await this.page
        .getByTestId('shipping-last-name-input')
        .fill(address.lastName)
      await this.page
        .getByTestId('shipping-address-input')
        .fill(address.address)
      await this.page
        .getByTestId('shipping-postal-code-input')
        .fill(address.postalCode)
      await this.page.getByTestId('shipping-city-input').fill(address.city)
      await this.page
        .getByTestId('shipping-country-select')
        .selectOption(address.countryCode)
      await this.page.getByTestId('shipping-email-input').fill(address.email)
      await this.page.getByTestId('shipping-phone-input').fill(address.phone)
    })
  }

  async continueToDelivery(): Promise<void> {
    await test.step('Continue to delivery selection', async () => {
      await this.page.getByTestId('submit-address-button').click()
      await expect(this.page).toHaveURL(/step=delivery/)
    })
  }

  async selectDelivery(name = 'Standard Shipping'): Promise<void> {
    await test.step(`Select ${name}`, async () => {
      const option = this.page
        .getByTestId('delivery-option-radio')
        .filter({ hasText: name })
      await expect(option).toHaveCount(1)
      await option.click()
      await expect(
        this.page.getByTestId('submit-delivery-option-button'),
      ).toBeEnabled()
      await this.page.getByTestId('submit-delivery-option-button').click()
      await expect(this.page).toHaveURL(/step=payment/)
    })
  }

  async selectManualPayment(): Promise<void> {
    await test.step('Choose Manual Payment and continue to review', async () => {
      await this.page.getByText('Manual Payment', { exact: true }).click()
      await expect(this.page.getByTestId('submit-payment-button')).toBeEnabled()
      await this.page.getByTestId('submit-payment-button').click()
      await expect(this.page).toHaveURL(/step=review/)
    })
  }

  async placeOrder(): Promise<void> {
    await test.step('Place the order and verify confirmation', async () => {
      await this.page.getByTestId('submit-order-button').click()
      await expect(this.page).toHaveURL(/\/order\/order_.*\/confirmed/)
      await expect(
        this.page.getByTestId('order-complete-container'),
      ).toBeVisible()
    })
  }
}
