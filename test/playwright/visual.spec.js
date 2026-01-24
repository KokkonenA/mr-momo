import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/src/index.html');

  await expect(page).toHaveTitle('Mr. Momo is Dead');
});

// test('get started link', async ({ page }) => {
//   await page.goto('http://127.0.0.1:5500/src/index.html');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
