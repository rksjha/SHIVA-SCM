const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/change-password', authMiddleware, authController.changePassword);
router.get('/users', adminMiddleware, authController.getUsers);
router.put('/users/:id', adminMiddleware, authController.updateUser);
router.patch('/users/:id/toggle-status', adminMiddleware, authController.toggleUserStatus);

module.exports = router;
