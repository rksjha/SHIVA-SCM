const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const manufacturerController = require('../controllers/manufacturer.controller');

const router = express.Router();

router.get('/', authMiddleware, manufacturerController.getAll);
router.post('/', managerMiddleware, manufacturerController.create);
router.get('/:id', authMiddleware, manufacturerController.getById);
router.put('/:id', managerMiddleware, manufacturerController.update);
router.delete('/:id', managerMiddleware, manufacturerController.deleteManufacturer);
router.patch('/:id/verify', managerMiddleware, manufacturerController.verify);
router.get('/:id/products', authMiddleware, manufacturerController.getManufacturerProducts);
router.get('/:id/stats', authMiddleware, manufacturerController.getStats);

module.exports = router;
