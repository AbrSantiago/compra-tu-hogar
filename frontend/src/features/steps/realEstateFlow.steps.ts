// import { Given, When, Then } from '@cucumber/cucumber';
// import { expect } from '@playwright/test';
// import type { CustomWorld } from './world';

// let direccionCreada: string;

// Given('que el usuario está en la página de login', async function (this: CustomWorld) {
//   await this.page.goto('http://localhost:5173/login');
// });

// When('ingresa el usuario {string} y la contraseña {string}', async function (this: CustomWorld, email, password) {
//   await this.page.locator('input[name="email"]').fill(email);
//   await this.page.locator('input[name="password"]').fill(password);
// });

// When('hace clic en el botón de ingresar', async function (this: CustomWorld) {
//   await this.page.getByRole('button', { name: 'Iniciar Sesión' }).click();
// });

// Then('debería ver el panel de la inmobiliaria', async function (this: CustomWorld) {
//   await expect(this.page.locator('aside')).toContainText('Panel Inmobiliario', { timeout: 10000 });
// });

// When('navega a la sección de {string}', async function (this: CustomWorld, seccion) {
//   await this.page.locator('aside nav').getByText(seccion).click();
// });

// When('registra una nueva propiedad con dirección {string}, ubicación {string}, tipo {string} y características {string}',
//   async function (this: CustomWorld, address, location, type, characteristics) {
//     direccionCreada = address;

//     await this.page.locator('input[name="address"]').fill(address);
//     await this.page.locator('input[name="location"]').fill(location);

//     const tipoValor = type === 'Casa' ? 'house' : 'apartment';
//     await this.page.locator('form select').selectOption(tipoValor);

//     await this.page.locator('input[name="characteristics"]').fill(characteristics);

//     await this.page.getByRole('button', { name: 'Registrar' }).click();
//   });

// Then('la propiedad debería figurar en la lista de inmuebles', async function (this: CustomWorld) {
//   const celdaDireccion = this.page.locator('table').getByText(direccionCreada).first();
//   await expect(celdaDireccion).toBeVisible();
// });

// When('publica el inmueble recientemente creado con un precio de {string}', async function (this: CustomWorld, precio) {
//   const optionValue = await this.page.locator('form select option', { hasText: direccionCreada }).last().getAttribute('value');

//   if (optionValue) {
//     await this.page.locator('form select').selectOption(optionValue);
//   } else {
//     throw new Error(`No se encontró ninguna propiedad con la dirección: ${direccionCreada} en el menú desplegable.`);
//   }

//   await this.page.locator('input[name="price"]').fill(precio);

//   await this.page.getByRole('button', { name: 'Publicar' }).click();
// });

// Then('la publicación debería figurar en la lista con estado Activo', async function (this: CustomWorld) {
//   const badgeEstado = this.page.locator('table').getByText('Activo').first();
//   await expect(badgeEstado).toBeVisible();
// });
// When('hace clic en el botón para volver al home público', async function (this: CustomWorld) {
//   await this.page.locator('aside').getByRole('link', { name: /home|inicio|volver/i }).or(this.page.locator('aside button')).first().click();
// });

// Then('debería ver reflejada la publicación de {string} con el precio {string}', async function (this: CustomWorld, direccion, precioFormateado) {
//   await expect(this.page).toHaveURL('http://localhost:5173/');

//   const tarjetaPropiedad = this.page.locator('main').getByText(direccion).first();
//   await expect(tarjetaPropiedad).toBeVisible({ timeout: 5000 });

//   const textoPrecio = this.page.locator('main').getByText(precioFormateado).first();
//   await expect(textoPrecio).toBeVisible();
// });