const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 公开路由
router.get('/', categoryController.getList);
router.get('/:id', categoryController.getById);

// 需要认证和管理员权限的路由
router.post('/', authenticateToken, requireAdmin, categoryController.create);
router.put('/:id', authenticateToken, requireAdmin, categoryController.update);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.delete);

module.exports = router;
