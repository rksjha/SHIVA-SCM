const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const clientController = require('../controllers/client.controller');

const router = express.Router();

router.get('/', authMiddleware, clientController.getAll);
router.post('/', managerMiddleware, clientController.create);
router.get('/:id', authMiddleware, clientController.getById);
router.put('/:id', managerMiddleware, clientController.update);
router.delete('/:id', managerMiddleware, clientController.deleteClient);
router.patch('/:id/verify', managerMiddleware, clientController.verify);
router.get('/:id/orders', authMiddleware, clientController.getOrderHistory);
router.patch('/:id/loyalty-tier', managerMiddleware, clientController.upgradeLoyaltyTier);

module.exports = router;
