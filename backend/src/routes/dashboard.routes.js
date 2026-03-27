const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/stats', authMiddleware, dashboardController.getStats);
router.get('/revenue-chart', authMiddleware, dashboardController.getRevenueChart);
router.get('/order-status', authMiddleware, dashboardController.getOrderStatus);
router.get('/top-products', authMiddleware, dashboardController.getTopProducts);
router.get('/top-clients', authMiddleware, dashboardController.getTopClients);
router.get('/supply-chain-flow', authMiddleware, dashboardController.getSupplyChainFlow);
router.get('/recent-activity', authMiddleware, dashboardController.getRecentActivity);

module.exports = router;
