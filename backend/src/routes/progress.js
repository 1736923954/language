const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

// 所有进度相关路由都需要认证
router.get('/', authenticateToken, progressController.getProgress);
router.get('/vocabulary/:vocabularyId', authenticateToken, progressController.getVocabularyProgress);
router.post('/mark', authenticateToken, progressController.markWord);
router.put('/:id', authenticateToken, progressController.updateProgress);
router.get('/statistics', authenticateToken, progressController.getStatistics);

module.exports = router;
