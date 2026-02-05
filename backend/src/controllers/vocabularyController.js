const prisma = require('../models');
const { success, error, paginated } = require('../utils/response');

// 获取词汇列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, word, category_id, difficulty_level } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { is_active: true };
    if (word) {
      where.word = { contains: word };
    }
    if (category_id) {
      where.category_id = parseInt(category_id);
    }
    if (difficulty_level) {
      where.difficulty_level = difficulty_level;
    }

    const [data, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    // 格式化数据
    const formattedData = data.map((v) => ({
      ...v,
      category_name: v.category?.name,
      Category: v.category, // 保持兼容性
    }));

    return paginated(res, formattedData, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};

// 获取单个词汇
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        sentences: {
          where: { is_active: true },
          select: {
            id: true,
            english_text: true,
            chinese_translation: true,
          },
        },
      },
    });

    if (!vocabulary) {
      return error(res, 'Vocabulary not found', 404);
    }

    return success(res, vocabulary);
  } catch (err) {
    next(err);
  }
};

// 创建词汇
exports.create = async (req, res, next) => {
  try {
    const { word, phonetic, definition, definition_zh, part_of_speech, difficulty_level, category_id } = req.body;

    const vocabulary = await prisma.vocabulary.create({
      data: {
        word,
        phonetic,
        definition,
        definition_zh,
        part_of_speech,
        difficulty_level,
        category_id: parseInt(category_id),
        created_by: req.user?.userId,
      },
    });

    return success(res, vocabulary, 'Vocabulary created', 201);
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'Vocabulary already exists in this category', 400);
    }
    next(err);
  }
};

// 更新词汇
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await prisma.vocabulary.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return success(res, vocabulary, 'Vocabulary updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Vocabulary not found', 404);
    }
    next(err);
  }
};

// 删除词汇
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await prisma.vocabulary.update({
      where: { id: parseInt(id) },
      data: { is_active: false },
    });

    return success(res, vocabulary, 'Vocabulary deleted');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Vocabulary not found', 404);
    }
    next(err);
  }
};

// 按分类获取词汇
exports.getByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      category_id: parseInt(categoryId),
      is_active: true,
    };

    const [data, total] = await Promise.all([
      prisma.vocabulary.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.vocabulary.count({ where }),
    ]);

    return paginated(res, data, total, parseInt(page), parseInt(limit));
  } catch (err) {
    next(err);
  }
};
