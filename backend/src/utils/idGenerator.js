const { sequelize } = require('../models');

const currentYear = new Date().getFullYear();

async function generateId(prefix, model) {
  const count = await model.count();
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}-${currentYear}-${sequence}`;
}

async function generateManufacturerId(model) {
  return generateId('MFG', model);
}

async function generateSupplierId(model) {
  return generateId('SUP', model);
}

async function generateWholesalerId(model) {
  return generateId('WSL', model);
}

async function generateRetailerId(model) {
  return generateId('RTL', model);
}

async function generateClientId(model) {
  return generateId('CLT', model);
}

async function generateProductId(model) {
  return generateId('PRD', model);
}

async function generateCategoryCode(model) {
  return generateId('CAT', model);
}

async function generateOrderId(model) {
  return generateId('ORD', model);
}

async function generateShipmentId(model) {
  return generateId('SHP', model);
}

module.exports = {
  generateManufacturerId,
  generateSupplierId,
  generateWholesalerId,
  generateRetailerId,
  generateClientId,
  generateProductId,
  generateCategoryCode,
  generateOrderId,
  generateShipmentId,
};
