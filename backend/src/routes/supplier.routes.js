const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const supplierController = require('../controllers/supplier.controller');

const router = express.Router();

router.get('/', authMiddleware, supplierController.getAll);
router.post('/', managerMiddleware, supplierController.create);
router.get('/:id', authMiddleware, supplierController.getById);
router.put('/:id', managerMiddleware, supplierController.update);
router.delete('/:id', managerMiddleware, supplierController.deleteSupplier);
router.patch('/:id/verify', managerMiddleware, supplierController.verify);

module.exports = router;
