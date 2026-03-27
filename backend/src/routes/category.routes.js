const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.middleware');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

router.get('/', authMiddleware, categoryController.getAll);
router.post('/', managerMiddleware, categoryController.create);
router.get('/tree', authMiddleware, categoryController.getCategoryTree);
router.get('/:id', authMiddleware, categoryController.getById);
router.put('/:id', managerMiddleware, categoryController.update);
router.delete('/:id', managerMiddleware, categoryController.deleteCategory);

module.exports = router;
