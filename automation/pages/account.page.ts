import { expect, test, type Page } from '@playwright/test'
import type { CustomerData } from '../factories/customer.factory'

export class AccountPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await test.step('Open the customer account page', async () => {
      await this.page.goto('/dk/account')
    })
  }

  async login(email: string, password: string): Promise<void> {
    await test.step('Sign in with customer credentials', async () => {
      await this.page
        .getByTestId('login-page')
        .getByTestId('email-input')
        .fill(email)
      await this.page
        .getByTestId('login-page')
        .getByTestId('password-input')
        .fill(password)
      await this.page.getByTestId('sign-in-button').click()
    })
  }

  async openRegistration(): Promise<void> {
    await test.step('Open new-customer registration', async () => {
      await this.page
        .getByTestId('login-page')
        .getByTestId('register-button')
        .click()
      await expect(this.page.getByTestId('register-page')).toBeVisible()
    })
  }

  async register(customer: CustomerData): Promise<void> {
    await test.step('Register a unique synthetic customer', async () => {
      const form = this.page.getByTestId('register-page')
      await form.getByTestId('first-name-input').fill(customer.firstName)
      await form.getByTestId('last-name-input').fill(customer.lastName)
      await form.getByTestId('email-input').fill(customer.email)
      await form.getByTestId('phone-input').fill('+4512345678')
      await form.getByTestId('password-input').fill(customer.password)
      await form.getByTestId('register-button').click()
    })
  }

  async logout(): Promise<void> {
    await test.step('Log out of the customer account', async () => {
      await this.page
        .getByTestId('account-nav')
        .getByTestId('logout-button')
        .click()
      await expect(this.page.getByTestId('login-page')).toBeVisible()
    })
  }
}
