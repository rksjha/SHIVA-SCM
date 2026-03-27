const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.get('/', authMiddleware, orderController.getAll);
router.post('/', managerMiddleware, orderController.create);
router.get('/:id', authMiddleware, orderController.getById);
router.put('/:id', managerMiddleware, orderController.update);
router.delete('/:id', managerMiddleware, orderController.deleteOrder);
router.patch('/:id/status', managerMiddleware, orderController.updateStatus);
router.get('/:id/items', authMiddleware, orderController.getOrderItems);
router.post('/:id/items', managerMiddleware, orderController.addOrderItem);
router.delete('/:id/items/:itemId', managerMiddleware, orderController.removeOrderItem);
router.get('/entity/list', authMiddleware, orderController.getByEntity);

module.exports = router;
