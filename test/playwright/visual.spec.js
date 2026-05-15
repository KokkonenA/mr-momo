"use strict";

import { test, expect } from "@playwright/test";

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const orange = new Coordinate(196, 645);
const tv = new Coordinate(400, 299);
const cake = new Coordinate(474, 474);
const teaMug = new Coordinate(625, 368);
const cdPlayer = new Coordinate(811, 285);
const envelope = new Coordinate(898, 360);
const portrait = new Coordinate(948, 130);
const foodBowl = new Coordinate(1105, 474);
const condom = new Coordinate(1152, 648);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle("Mr. Momo is Dead");
});

test("has favicon", async ({ page }) => {
  const favicon = page.locator("link[rel*=\"icon\"]");
  await expect(favicon).toHaveAttribute("href", "favicon.png");
});

test("shows start screen", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  await expect(page).toHaveScreenshot("start-screen.png");
});

test("shows main scene after clicking play", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights orange when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, orange.x, orange.y);
  await expect(page).toHaveScreenshot("main-scene-orange-highlighted.png");
});

test("shows orange closeup after clicking orange", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickOrange(page);
  await expect(page).toHaveScreenshot("orange-closeup.png");
});

test("shows main scene after clicking back arrow in orange closeup", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickOrange(page);
  clickBackButton(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights tv when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, tv.x, tv.y);
  await expect(page).toHaveScreenshot("main-scene-tv-highlighted.png");
});

test("shows video player after clicking tv", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickTv(page);
  await expect(page).toHaveScreenshot("video-player.png");
});

test("shows main scene after clicking outside video player", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickTv(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights cake when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, cake.x, cake.y);
  await expect(page).toHaveScreenshot("main-scene-cake-highlighted.png");
});

test("shows birthday drawing after clicking cake", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickCake(page);
  await expect(page).toHaveScreenshot("birthday-drawing.png");
});

test("shows main scene after clicking outside birthday drawing", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickCake(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights tea mug when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, teaMug.x, teaMug.y);
  await expect(page).toHaveScreenshot("main-scene-tea-mug-highlighted.png");
});

// test("shows tea video after clicking tea mug", async ({ page }) => {
//   await page.waitForFunction(() => document.querySelector("canvas"));
//   clickStartButton(page);
//   clickTeaMug(page);
//   await expect(page).toHaveScreenshot("tea-video.png");
// });

test("shows main scene after clicking outside tea video", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickTeaMug(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights cd player when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, cdPlayer.x, cdPlayer.y);
  await expect(page).toHaveScreenshot("main-scene-cd-player-highlighted.png");
});

// test("shows piano video after clicking cd player", async ({ page }) => {
//   await page.waitForFunction(() => document.querySelector("canvas"));
//   await clickStartButton(page);
//   await clickCdPlayer(page);
//   await expect(page).toHaveScreenshot("piano-video.png");
// });

test("shows main scene after clicking outside piano video", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickCdPlayer(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights envelope when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, envelope.x, envelope.y);
  await expect(page).toHaveScreenshot("main-scene-envelope-highlighted.png");
});

test("shows letter after clicking envelope", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  await expect(page).toHaveScreenshot("letter.png");
});

test("shows English translation of letter after clicking translation button once", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickTranslateButton(page);
  await expect(page).toHaveScreenshot("letter-english.png");
});

test("shows Korean translation of letter after clicking translation button twice", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickTranslateButton(page);
  clickTranslateButton(page);
  await expect(page).toHaveScreenshot("letter-korean.png");
});

test("shows the original letter after clicking translation button three times", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickTranslateButton(page);
  clickTranslateButton(page);
  clickTranslateButton(page);
  await expect(page).toHaveScreenshot("letter.png");
});

test("shows main scene after clicking outside letter", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("shows main scene after clicking outside english letter", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickTranslateButton(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("shows main scene after clicking outside korean letter", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickEnvelope(page);
  clickTranslateButton(page);
  clickTranslateButton(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights portrait when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, portrait.x, portrait.y);
  await expect(page).toHaveScreenshot("main-scene-portrait-highlighted.png");
});

test("shows portrait closeup after clicking portrait", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickPortrait(page);
  await expect(page).toHaveScreenshot("portrait-closeup.png");
});

test("shows main scene after clicking back arrow in portrait closeup", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickPortrait(page);
  clickBackButton(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("highlights food bowl when mouse moves on top it", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  moveMouse(page, foodBowl.x, foodBowl.y);
  await expect(page).toHaveScreenshot("main-scene-food-bowl-highlighted.png");
});

test("shows dog bowl closeup after clicking dog bowl", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickFoodBowl(page);
  await expect(page).toHaveScreenshot("dog-bowl-closeup.png");
});

test("shows main scene after clicking back arrow in dog bowl closeup", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickFoodBowl(page);
  clickBackButton(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

 test("highlights condom when mouse moves on top it", async ({ page }) => {
   await page.waitForFunction(() => document.querySelector("canvas"));
   clickStartButton(page);
   moveMouse(page, condom.x, condom.y);
   page.waitForTimeout(1000);
   await expect(page).toHaveScreenshot("main-scene-condom-highlighted.png");
});

// test("shows condom video after clicking condom", async ({ page }) => {
//   await page.waitForFunction(() => document.querySelector("canvas"));
//   clickStartButton(page);
//   clickCondom(page);
//   await expect(page).toHaveScreenshot("condom-video.png");
// });

test("shows main scene after clicking outside condom video", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickCondom(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

test("shows info after clicking question mark", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickQuestionMark(page);
  await expect(page).toHaveScreenshot("info.png");
});

test("opens Heya's web page after clicking Heya Kwon", async ({ page, context }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));

  const popupPromise = page.waitForEvent('popup');

  clickStartButton(page);
  clickQuestionMark(page);
  clickCanvas(page, 502, 512);

  const popup = await popupPromise;
  await popup.waitForLoadState('load');
  await expect(popup).toHaveURL("https://heya.world/");
})

test("opens the GitHub repository page after clicking Antti Kokkonen", async ({ page, context }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  
  const popupPromise = page.waitForEvent('popup');

  clickStartButton(page);
  clickQuestionMark(page);
  clickCanvas(page, 513, 531);

  const popup = await popupPromise;
  await popup.waitForLoadState('load');
  await expect(popup).toHaveURL("https://github.com/KokkonenA/mr-momo");
})

test("shows main scene after clicking outside info", async ({ page }) => {
  await page.waitForFunction(() => document.querySelector("canvas"));
  clickStartButton(page);
  clickQuestionMark(page);
  clickOutsidePopup(page);
  await expect(page).toHaveScreenshot("main-scene.png");
});

async function moveMouse(page, x, y) {
  await page.locator("#defaultCanvas0").hover({ position: { x, y } });
}

async function clickCanvas(page, x, y) {
  await page.locator("#defaultCanvas0").click({position: { x, y } });
}

async function clickStartButton(page) {
  clickCanvas(page, 634, 474);
}

async function clickOrange(page) {
  clickCanvas(page, orange.x, orange.y);
}

async function clickTv(page) {
  clickCanvas(page, tv.x, tv.y);
}

async function clickCake(page) {
  clickCanvas(page, cake.x, cake.y);
}

async function clickTeaMug(page) {
  clickCanvas(page, teaMug.x, teaMug.y);
}

async function clickCdPlayer(page) {
  clickCanvas(page, cdPlayer.x, cdPlayer.y);
}

async function clickEnvelope(page) {
  clickCanvas(page, envelope.x, envelope.y);
}

async function clickPortrait(page) {
  clickCanvas(page, portrait.x, portrait.y);
}

async function clickFoodBowl(page) {
  clickCanvas(page, foodBowl.x, foodBowl.y);
}

async function clickCondom(page) {
  clickCanvas(page, condom.x, condom.y);
}

async function clickOutsidePopup(page) {
  clickCanvas(page, 61, 343);
}

async function clickBackButton(page) {
  clickCanvas(page, 78, 76);
}

async function clickTranslateButton(page) {
  clickCanvas(page, 1072, 193);
}

async function clickQuestionMark(page) {
  clickCanvas(page, 1243, 37);
}
