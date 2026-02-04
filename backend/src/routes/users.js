const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 用户个人信息路由（需要认证）
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// 用户管理路由（需要管理员权限）
router.get('/', authenticateToken, requireAdmin, userController.getList);
router.get('/:id', authenticateToken, requireAdmin, userController.getById);
router.put('/:id', authenticateToken, requireAdmin, userController.update);
router.delete('/:id', authenticateToken, requireAdmin, userController.delete);

module.exports = router;
