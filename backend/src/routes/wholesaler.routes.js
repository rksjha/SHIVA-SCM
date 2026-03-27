const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const wholesalerController = require('../controllers/wholesaler.controller');

const router = express.Router();

router.get('/', authMiddleware, wholesalerController.getAll);
router.post('/', managerMiddleware, wholesalerController.create);
router.get('/:id', authMiddleware, wholesalerController.getById);
router.put('/:id', managerMiddleware, wholesalerController.update);
router.delete('/:id', managerMiddleware, wholesalerController.deleteWholesaler);
router.patch('/:id/verify', managerMiddleware, wholesalerController.verify);

module.exports = router;
