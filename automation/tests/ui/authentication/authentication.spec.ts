import { expect, test } from '../../../fixtures/test'
import { createUniqueCustomer } from '../../../factories/customer.factory'
import { AccountPage } from '../../../pages/account.page'

test('existing customer can log in and log out', async ({
  page,
  registeredCustomer,
}) => {
  const account = new AccountPage(page)
  await account.goto()
  await account.login(registeredCustomer.email, registeredCustomer.password)

  await expect(page.getByTestId('account-page')).toBeVisible()
  await expect(page.getByTestId('account-nav')).toBeVisible()

  await account.logout()
})

test('invalid credentials show useful feedback', async ({ page }) => {
  const account = new AccountPage(page)
  await account.goto()
  await account.login('missing-customer@example.test', 'Not-The-Password-1!')

  await expect(page.getByTestId('login-error-message')).toBeVisible()
})

test('new customer can register using unique data', async ({
  page,
  customerCleanup,
}) => {
  const account = new AccountPage(page)
  const customer = createUniqueCustomer()
  customerCleanup.trackEmail(customer.email)
  await account.goto()
  await account.openRegistration()
  await account.register(customer)

  await expect(page.getByTestId('account-page')).toBeVisible()
  await expect(page.getByTestId('account-nav')).toBeVisible()
})

test('required registration fields and email format are validated', async ({
  page,
}) => {
  const account = new AccountPage(page)
  await account.goto()
  await account.openRegistration()

  const form = page.getByTestId('register-page')
  await form.getByTestId('register-button').click()
  await expect(form.getByTestId('first-name-input')).toBeFocused()

  await form.getByTestId('first-name-input').fill('Northstar')
  await form.getByTestId('last-name-input').fill('Customer')
  await form.getByTestId('email-input').fill('invalid-email')
  await form.getByTestId('password-input').fill('Valid-Test-Password-1!')
  await form.getByTestId('register-button').click()
  await expect(form.getByTestId('email-input')).toBeFocused()
  await expect(form).toBeVisible()
})
