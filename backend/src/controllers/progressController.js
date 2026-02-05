const prisma = require('../models');
const { success, error, paginated } = require('../utils/response');

// 获取用户学习进度
exports.getProgress = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const userId = req.user.userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.userProgress.findMany({
        where,
        include: {
          vocabulary: {
            select: {
              id: true,
              word: true,
              definition: true,
            },
          },
        },
        skip,
        take,
        orderBy: { updated_at: 'desc' },
      }),
      prisma.userProgress.count({ where }),
    ]);

    return paginated(res, data, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};

// 获取词汇的学习状态
exports.getVocabularyProgress = async (req, res, next) => {
  try {
    const { vocabularyId } = req.params;
    const userId = req.user.userId;

    const progress = await prisma.userProgress.findFirst({
      where: {
        user_id: userId,
        vocabulary_id: parseInt(vocabularyId),
      },
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

    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        user_id: userId,
        vocabulary_id: parseInt(vocabulary_id),
      },
    });

    let progress;
    if (!existingProgress) {
      progress = await prisma.userProgress.create({
        data: {
          user_id: userId,
          vocabulary_id: parseInt(vocabulary_id),
          status,
          correct_count: correct_count || 0,
          wrong_count: wrong_count || 0,
          last_reviewed_at: new Date(),
          next_review_at: calculateNextReview(status),
        },
      });
    } else {
      progress = await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          status,
          correct_count: correct_count !== undefined ? correct_count : existingProgress.correct_count,
          wrong_count: wrong_count !== undefined ? wrong_count : existingProgress.wrong_count,
          last_reviewed_at: new Date(),
          next_review_at: calculateNextReview(status),
        },
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
    const progress = await prisma.userProgress.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return success(res, progress, 'Progress updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Progress not found', 404);
    }
    next(err);
  }
};

// 获取学习统计
exports.getStatistics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [total, mastered, reviewing, learning] = await Promise.all([
      prisma.userProgress.count({ where: { user_id: userId } }),
      prisma.userProgress.count({
        where: { user_id: userId, status: 'mastered' },
      }),
      prisma.userProgress.count({
        where: { user_id: userId, status: 'reviewing' },
      }),
      prisma.userProgress.count({
        where: { user_id: userId, status: 'learning' },
      }),
    ]);

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
