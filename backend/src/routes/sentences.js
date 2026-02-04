const express = require('express');
const router = express.Router();
const sentenceController = require('../controllers/sentenceController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// 公开路由
router.get('/', sentenceController.getList);
router.get('/:id', sentenceController.getById);
router.get('/vocabulary/:vocabularyId', sentenceController.getByVocabulary);

// 需要认证和管理员权限的路由
router.post('/', authenticateToken, requireAdmin, sentenceController.create);
router.put('/:id', authenticateToken, requireAdmin, sentenceController.update);
router.delete('/:id', authenticateToken, requireAdmin, sentenceController.delete);

module.exports = router;
