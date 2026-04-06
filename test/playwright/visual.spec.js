import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle('Mr. Momo is Dead');
});

test('shows start screen', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await expect(page).toHaveScreenshot('start-screen.png');
});

test('shows main scene after clicking play', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights orange when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(196, 635);
  await expect(page).toHaveScreenshot('main-scene-orange-highlighted.png');
});

test('shows orange closeup after clicking orange', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 196,
      y: 635
    }
  });
  await expect(page).toHaveScreenshot('orange-closeup.png');
});

test('shows main scene after clicking back arrow in orange closeup', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 196,
      y: 635
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 84,
      y: 81
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights tv when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(400, 299);
  await expect(page).toHaveScreenshot('main-scene-tv-highlighted.png');
});

test('shows video player after clicking tv', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 400,
      y: 299
    }
  });
  await expect(page).toHaveScreenshot('video-player.png');
});

test('shows main scene after clicking outside video player', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 400,
      y: 299
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights cake when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(474, 474);
  await expect(page).toHaveScreenshot('main-scene-cake-highlighted.png');
});

test('shows birthday drawing after clicking cake', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 474,
      y: 448
    }
  });
  await expect(page).toHaveScreenshot('birthday-drawing.png');
});

test('shows main scene after clicking outside birthday drawing', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 474,
      y: 448
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights tea mug when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(625, 368);
  await expect(page).toHaveScreenshot('main-scene-tea-mug-highlighted.png');
});

test('shows tea video after clicking tea mug', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 625,
      y: 368
    }
  });
  await page.evaluate(() => {
    const source = document.querySelector(`source[src*="assets/videos/tea_time.mp4"]`);
    const video = source?.parentElement;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
  await expect(page).toHaveScreenshot('tea-video.png');
});

test('shows main scene after clicking outside tea video', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 625,
      y: 368
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights cd player when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(811, 285);
  await expect(page).toHaveScreenshot('main-scene-cd-player-highlighted.png');
});

test('shows piano video after clicking cd player', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 811,
      y: 285
    }
  });
  await page.evaluate(() => {
    const source = document.querySelector(`source[src*="assets/videos/olenyksin.mp4"]`);
    const video = source?.parentElement;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
  await expect(page).toHaveScreenshot('piano-video.png');
});

test('shows main scene after clicking outside piano video', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 811,
      y: 285
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights envelope when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(898, 360);
  await expect(page).toHaveScreenshot('main-scene-envelope-highlighted.png');
});

test('shows letter after clicking envelope', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 898,
      y: 360
    }
  });
  await expect(page).toHaveScreenshot('letter.png');
});

test('shows translated letter after clicking letter', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 898,
      y: 360
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 614,
      y: 369
    }
  });
  await expect(page).toHaveScreenshot('letter-translated.png');
});

test('shows original letter after clicking translated letter', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 898,
      y: 360
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 614,
      y: 369
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 614,
      y: 369
    }
  });
  await expect(page).toHaveScreenshot('letter.png');
});

test('shows main scene after clicking outside letter', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 898,
      y: 360
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('shows main scene after clicking outside translated letter', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 898,
      y: 360
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 614,
      y: 369
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights portrait when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(948, 130);
  await expect(page).toHaveScreenshot('main-scene-portrait-highlighted.png');
});

test('shows portrait closeup after clicking portrait', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 948,
      y: 130
    }
  });
  await expect(page).toHaveScreenshot('portrait-closeup.png');
});

test('shows main scene after clicking back arrow in portrait closeup', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 948,
      y: 130
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 84,
      y: 81
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights food bowl when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(1105, 474);
  await expect(page).toHaveScreenshot('main-scene-food-bowl-highlighted.png');
});

test('shows dog bowl closeup after clicking dog bowl', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 1105,
      y: 474
    }
  });
  await expect(page).toHaveScreenshot('dog-bowl-closeup.png');
});

test('shows main scene after clicking back arrow in dog bowl closeup', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 1105,
      y: 474
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 84,
      y: 81
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});

test('highlights condom when mouse moves on top it', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.mouse.move(1170, 648);
  await expect(page).toHaveScreenshot('main-scene-cd-player-highlighted.png');
});

test('shows condom video after clicking condom', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 1170,
      y: 648
    }
  });
  await page.evaluate(() => {
    const source = document.querySelector(`source[src*="assets/videos/condom.mp4"]`);
    const video = source?.parentElement;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
  await expect(page).toHaveScreenshot('condom-video.png');
});

test('shows main scene after clicking outside condom video', async ({ page }) => {
  await page.waitForFunction(() => document.querySelector('canvas'));
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 634,
      y: 516
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 1170,
      y: 648
    }
  });
  await page.locator('#defaultCanvas0').click({
    position: {
      x: 61,
      y: 343
    }
  });
  await expect(page).toHaveScreenshot('main-scene.png');
});
