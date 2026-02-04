const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// 公开路由
router.post('/register', authController.register);
router.post('/login', authController.login);

// 需要认证的路由
router.post('/refresh', authenticateToken, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
