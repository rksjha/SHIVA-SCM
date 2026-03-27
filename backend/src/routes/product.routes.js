const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const productController = require('../controllers/product.controller');

const router = express.Router();

router.get('/', authMiddleware, productController.getAll);
router.post('/', managerMiddleware, productController.create);
router.get('/low-stock', authMiddleware, productController.getLowStockProducts);
router.get('/:id', authMiddleware, productController.getById);
router.put('/:id', managerMiddleware, productController.update);
router.delete('/:id', managerMiddleware, productController.deleteProduct);
router.get('/:id/price-history', authMiddleware, productController.getPriceHistory);
router.patch('/:id/price', managerMiddleware, productController.updatePrice);
router.get('/category/:category_id', authMiddleware, productController.getByCategory);

module.exports = router;
