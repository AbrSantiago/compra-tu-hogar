// import { When, Then } from '@cucumber/cucumber';
// import { expect } from '@playwright/test';
// import type { CustomWorld } from './world';

// When('edita la propiedad con dirección {string} cambiando el tipo a {string} y dirección a {string}', 
// async function (this: CustomWorld, oldAddress, newType, newAddress) {
//   const row = this.page.locator('table').locator('tr').filter({ hasText: oldAddress }).first();
//   await row.getByTitle('Editar').click();
  
//   await this.page.locator('input[name="address"]').fill(newAddress);
//   const tipoValor = newType === 'Departamento' ? 'apartment' : 'house';
//   await this.page.locator('select').selectOption(tipoValor);
  
//   await this.page.getByRole('button', { name: 'Guardar cambios' }).click();
// });

// Then('la propiedad debería mostrar la dirección {string} y tipo {string} en la tabla', 
// async function (this: CustomWorld, address, type) {
//   const row = this.page.locator('table').locator('tr').filter({ hasText: address }).first();
//   await expect(row).toBeVisible();
//   await expect(row).toContainText(type);
// });

// When('edita la publicación de la propiedad {string} cambiando el precio a {string} y estado a {string}', 
// async function (this: CustomWorld, address, price, statusLabel) {
//   const row = this.page.locator('table').locator('tr').filter({ hasText: address }).first();
//   await row.getByTitle('Editar').click();
  
//   await this.page.locator('input[name="price"]').fill(price);
  
//   const statusMap: Record<string, string> = { 
//     'Pausado': 'paused', 'Activo': 'active', 'Reservado': 'reserved', 'Vendido': 'sold' 
//   };
//   await this.page.locator('select').selectOption(statusMap[statusLabel]);
  
//   await this.page.getByRole('button', { name: 'Guardar cambios' }).click();
// });

// Then('la publicación debería reflejar el precio {string} y estado {string} en la propiedad {string}', 
// async function (this: CustomWorld, price, status, address) {
//   const row = this.page.locator('table').locator('tr').filter({ hasText: address }).first();
  
//   await expect(row).toContainText(price);
//   await expect(row).toContainText(status);
// });

// When('hace clic en el botón de eliminar la publicación de {string}', async function (this: CustomWorld, address: string) {
//   const row = this.page.locator('table').locator('tr').filter({ hasText: address }).first();
//   await row.getByTitle('Eliminar').click();
// });

// When('confirma la eliminación', async function (this: CustomWorld) {
//   const modalContainer = this.page.locator('div.fixed.inset-0.z-50');
//   await expect(modalContainer).toBeVisible();
//   await modalContainer.getByRole('button', { name: 'Confirmar' }).click();
//   await expect(modalContainer).not.toBeVisible();
// });

// Then('la publicación de {string} no debería figurar en la lista', async function (this: CustomWorld, address) {
//   const row = this.page.locator('table tr').filter({ hasText: address });
//   await expect(row).toHaveCount(0);
// });

// Then('debería ver el panel de administración', async function (this: CustomWorld) {
//   await expect(this.page.locator('aside')).toContainText('Panel de Administración');
// });