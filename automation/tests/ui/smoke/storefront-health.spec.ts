import { expect, test } from '@playwright/test'

test('@smoke storefront loads and exposes customer navigation', async ({
  page,
}) => {
  await page.goto('/dk')

  await expect(page).toHaveTitle(/Medusa Next\.js Starter Template/)
  await expect(
    page.getByRole('heading', { name: 'Ecommerce Starter Template' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Account' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Cart (0)' })).toBeVisible()
})
