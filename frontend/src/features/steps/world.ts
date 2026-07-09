import { setWorldConstructor, World, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

setDefaultTimeout(30 * 1000);

export class CustomWorld extends World {
  browser: Browser | undefined;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  const isCI = process.env.CI === 'true';

  this.browser = await chromium.launch({ headless: isCI });
  const context = await this.browser.newContext();
  this.page = await context.newPage();
});

After(async function (this: CustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});