const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const retailerController = require('../controllers/retailer.controller');

const router = express.Router();

router.get('/', authMiddleware, retailerController.getAll);
router.post('/', managerMiddleware, retailerController.create);
router.get('/:id', authMiddleware, retailerController.getById);
router.put('/:id', managerMiddleware, retailerController.update);
router.delete('/:id', managerMiddleware, retailerController.deleteRetailer);
router.patch('/:id/verify', managerMiddleware, retailerController.verify);

module.exports = router;
