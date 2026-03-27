const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const shipmentController = require('../controllers/shipment.controller');

const router = express.Router();

router.get('/', authMiddleware, shipmentController.getAll);
router.post('/', managerMiddleware, shipmentController.create);
router.get('/:id', authMiddleware, shipmentController.getById);
router.put('/:id', managerMiddleware, shipmentController.update);
router.delete('/:id', managerMiddleware, shipmentController.deleteShipment);
router.patch('/:id/status', managerMiddleware, shipmentController.updateStatus);
router.post('/:id/tracking-events', managerMiddleware, shipmentController.addTrackingEvent);
router.get('/order/:orderId', authMiddleware, shipmentController.getByOrder);

module.exports = router;
