const { UserProgress, Vocabulary } = require('../models');
const { Op } = require('sequelize');
const { success, error, paginated } = require('../utils/response');

// 获取用户学习进度
exports.getProgress = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const userId = req.user.userId;
    const offset = (page - 1) * limit;

    const where = { user_id: userId };
    if (status) where.status = status;

    const { count, rows } = await UserProgress.findAndCountAll({
      where,
      include: [{ model: Vocabulary, attributes: ['id', 'word', 'definition'] }],
      offset,
      limit: parseInt(limit),
      order: [['updated_at', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

// 获取词汇的学习状态
exports.getVocabularyProgress = async (req, res, next) => {
  try {
    const { vocabularyId } = req.params;
    const userId = req.user.userId;

    const progress = await UserProgress.findOne({
      where: { user_id: userId, vocabulary_id: vocabularyId },
    });

    if (!progress) {
      return success(res, null, 'No progress record');
    }

    return success(res, progress);
  } catch (err) {
    next(err);
  }
};

// 标记词汇为已掌握/需复习
exports.markWord = async (req, res, next) => {
  try {
    const { vocabulary_id, status, correct_count, wrong_count } = req.body;
    const userId = req.user.userId;

    let progress = await UserProgress.findOne({
      where: { user_id: userId, vocabulary_id },
    });

    if (!progress) {
      progress = await UserProgress.create({
        user_id: userId,
        vocabulary_id,
        status,
        correct_count: correct_count || 0,
        wrong_count: wrong_count || 0,
      });
    } else {
      await progress.update({
        status,
        correct_count: correct_count !== undefined ? correct_count : progress.correct_count,
        wrong_count: wrong_count !== undefined ? wrong_count : progress.wrong_count,
        last_reviewed_at: new Date(),
        next_review_at: calculateNextReview(status),
      });
    }

    return success(res, progress, 'Progress updated');
  } catch (err) {
    next(err);
  }
};

// 更新学习进度
exports.updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const progress = await UserProgress.findByPk(id);

    if (!progress) {
      return error(res, 'Progress not found', 404);
    }

    await progress.update(req.body);
    return success(res, progress, 'Progress updated');
  } catch (err) {
    next(err);
  }
};

// 获取学习统计
exports.getStatistics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const total = await UserProgress.count({ where: { user_id: userId } });
    const mastered = await UserProgress.count({
      where: { user_id: userId, status: 'mastered' },
    });
    const reviewing = await UserProgress.count({
      where: { user_id: userId, status: 'reviewing' },
    });
    const learning = await UserProgress.count({
      where: { user_id: userId, status: 'learning' },
    });

    const stats = {
      total,
      mastered,
      reviewing,
      learning,
      masteredPercentage: total > 0 ? ((mastered / total) * 100).toFixed(2) : 0,
    };

    return success(res, stats);
  } catch (err) {
    next(err);
  }
};

// 计算下次复习时间
function calculateNextReview(status) {
  const now = new Date();
  if (status === 'mastered') {
    // 7 天后复习
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (status === 'reviewing') {
    // 3 天后复习
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  } else {
    // 1 天后复习
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}
