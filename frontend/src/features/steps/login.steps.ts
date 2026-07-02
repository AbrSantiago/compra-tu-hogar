import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import type { CustomWorld } from './world';

setDefaultTimeout(30 * 1000);

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

Given('que el usuario está en la página de login', async function (this: CustomWorld) {
  await this.page.goto('http://localhost:5173/login');
});

When('ingresa el usuario {string} y la contraseña {string}', async function (this: CustomWorld, email, password) {
  await this.page.locator('input[name="email"]').fill(email);
  await this.page.locator('input[name="password"]').fill(password);
});

When('hace clic en el botón de ingresar', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Iniciar Sesión' }).click();
});

Then('debería ver el home con su sesión iniciada', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL('http://localhost:5173/'); 

  const botonCerrarSesion = this.page.locator('header').getByText(/cerrar.*sesión/i);
  await expect(botonCerrarSesion).toBeVisible({ timeout: 10000 });

  const linkIniciarSesion = this.page.locator('header').getByText('Iniciar Sesión');
  const linkRegistrarme = this.page.locator('header').getByText('Registrarme');
  
  await expect(linkIniciarSesion).not.toBeVisible();
  await expect(linkRegistrarme).not.toBeVisible();
});