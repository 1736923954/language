const prisma = require('../models');
const { success, error, paginated } = require('../utils/response');

// 获取句子列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, vocabulary_id, difficulty_level } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { is_active: true };
    if (vocabulary_id) {
      where.vocabulary_id = parseInt(vocabulary_id);
    }
    if (difficulty_level) {
      where.difficulty_level = difficulty_level;
    }

    const [data, total] = await Promise.all([
      prisma.sentence.findMany({
        where,
        include: {
          vocabulary: {
            select: {
              id: true,
              word: true,
            },
          },
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.sentence.count({ where }),
    ]);

    return paginated(res, data, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};

// 获取单个句子
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await prisma.sentence.findUnique({
      where: { id: parseInt(id) },
      include: {
        vocabulary: {
          select: {
            id: true,
            word: true,
          },
        },
      },
    });

    if (!sentence) {
      return error(res, 'Sentence not found', 404);
    }

    return success(res, sentence);
  } catch (err) {
    next(err);
  }
};

// 创建句子
exports.create = async (req, res, next) => {
  try {
    const { vocabulary_id, english_text, chinese_translation, usage_context, difficulty_level } = req.body;

    // 使用事务：创建句子并更新词汇的例句数量
    const result = await prisma.$transaction(async (tx) => {
      const sentence = await tx.sentence.create({
        data: {
          vocabulary_id: parseInt(vocabulary_id),
          english_text,
          chinese_translation,
          usage_context,
          difficulty_level,
          created_by: req.user?.userId,
        },
      });

      // 更新词汇的例句数量
      await tx.vocabulary.update({
        where: { id: parseInt(vocabulary_id) },
        data: {
          example_count: {
            increment: 1,
          },
        },
      });

      return sentence;
    });

    return success(res, result, 'Sentence created', 201);
  } catch (err) {
    next(err);
  }
};

// 更新句子
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await prisma.sentence.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return success(res, sentence, 'Sentence updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Sentence not found', 404);
    }
    next(err);
  }
};

// 删除句子
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 使用事务：软删除句子并更新词汇的例句数量
    const result = await prisma.$transaction(async (tx) => {
      const sentence = await tx.sentence.findUnique({
        where: { id: parseInt(id) },
      });

      if (!sentence) {
        throw new Error('Sentence not found');
      }

      // 软删除
      await tx.sentence.update({
        where: { id: parseInt(id) },
        data: { is_active: false },
      });

      // 更新词汇的例句数量
      await tx.vocabulary.update({
        where: { id: sentence.vocabulary_id },
        data: {
          example_count: {
            decrement: 1,
          },
        },
      });

      return sentence;
    });

    return success(res, null, 'Sentence deleted');
  } catch (err) {
    if (err.message === 'Sentence not found' || err.code === 'P2025') {
      return error(res, 'Sentence not found', 404);
    }
    next(err);
  }
};

// 按词汇获取句子
exports.getByVocabulary = async (req, res, next) => {
  try {
    const { vocabularyId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      vocabulary_id: parseInt(vocabularyId),
      is_active: true,
    };

    const [data, total] = await Promise.all([
      prisma.sentence.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.sentence.count({ where }),
    ]);

    return paginated(res, data, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};
