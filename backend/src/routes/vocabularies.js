const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 公开路由
router.get('/', vocabularyController.getList);
router.get('/:id', vocabularyController.getById);
router.get('/category/:categoryId', vocabularyController.getByCategory);

// 需要认证和管理员权限的路由
router.post('/', authenticateToken, requireAdmin, vocabularyController.create);
router.put('/:id', authenticateToken, requireAdmin, vocabularyController.update);
router.delete('/:id', authenticateToken, requireAdmin, vocabularyController.delete);

module.exports = router;
