import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { expect } from '@playwright/test';

setDefaultTimeout(20 * 1000);

let browser: Browser | undefined;
let page: Page;

Before(async () => {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async () => {
  if (browser) {
    await browser.close();
  }
});

Given('que el usuario está en la página de login', async () => {
  await page.goto('http://localhost:5173/login');
});

When('ingresa el usuario {string} y la contraseña {string}', async (email, password) => {
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
});

When('hace clic en el botón de ingresar', async () => {
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
});

Then('debería ver el home con su sesión iniciada', async () => {
  await expect(page).toHaveURL('http://localhost:5173/'); 

  const botonCerrarSesion = page.locator('header').getByText(/cerrar.*sesión/i);
  await expect(botonCerrarSesion).toBeVisible({ timeout: 10000 });

  const linkIniciarSesion = page.locator('header').getByText('Iniciar Sesión');
  const linkRegistrarme = page.locator('header').getByText('Registrarme');
  
  await expect(linkIniciarSesion).not.toBeVisible();
  await expect(linkRegistrarme).not.toBeVisible();
});