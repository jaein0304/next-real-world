import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads with conduit branding', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/conduit/i)
    await expect(page.getByRole('heading', { name: 'conduit' })).toBeVisible()
  })

  test('homepage shows Global Feed tab', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Global Feed')).toBeVisible()
  })

  test('navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign in')
    await expect(page).toHaveURL(/\/login/)
  })

  test('navigates to register page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign up')
    await expect(page).toHaveURL(/\/register/)
  })
})
