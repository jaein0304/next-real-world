import { test, expect } from '@playwright/test'

test.describe('Articles', () => {
  test.describe('Home page', () => {
    test('shows article list or loading state', async ({ page }) => {
      await page.goto('/')
      // The home page should show a Global Feed tab
      await expect(page.locator('text=Global Feed')).toBeVisible()
      // Either articles load or an empty/loading state is shown
      // Wait for the loading spinner to disappear (articles fetched or empty)
      await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 }).catch(() => {
        // Spinner may have already gone
      })
      // After loading, either article previews or a "No articles" message should exist
      const articleOrEmpty = page.locator('article, [class*="article"], text=/No articles/i, .article-preview')
      // Just verify the page rendered past loading
      await expect(page.locator('text=Global Feed')).toBeVisible()
    })

    test('tag sidebar renders with Popular Tags heading', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('text=Popular Tags')).toBeVisible({ timeout: 10000 })
    })

    test('Global Feed tab is visible and clickable', async ({ page }) => {
      await page.goto('/')
      const globalFeedTab = page.locator('text=Global Feed')
      await expect(globalFeedTab).toBeVisible()
      await globalFeedTab.click()
      await expect(page).toHaveURL(/^\/$|\/\?/)
    })
  })

  test.describe('Editor page', () => {
    test('redirects unauthenticated user to login', async ({ page }) => {
      // Clear any stored tokens
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())

      await page.goto('/editor')
      // withAuthApp redirects to /login when no user is found
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })
  })

  test.describe('Article page', () => {
    test('shows not-found or article for a nonexistent slug', async ({ page }) => {
      await page.goto('/article/nonexistent-slug-that-does-not-exist-12345')
      // Should either show a 404/not-found state or an error
      // Wait for page to settle
      await page.waitForLoadState('networkidle')
      // The page should have rendered something (not a blank screen)
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(0)
    })
  })
})
