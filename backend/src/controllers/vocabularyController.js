const { Vocabulary, Category, Sentence } = require('../models');
const { Op } = require('sequelize');
const { success, error, paginated } = require('../utils/response');

// 获取词汇列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, word, category_id, difficulty_level } = req.query;
    const offset = (page - 1) * limit;

    const where = { is_active: true };
    if (word) where.word = { [Op.like]: `%${word}%` };
    if (category_id) where.category_id = category_id;
    if (difficulty_level) where.difficulty_level = difficulty_level;

    const { count, rows } = await Vocabulary.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    const data = rows.map(v => ({
      ...v.dataValues,
      category_name: v.Category?.name,
    }));

    return paginated(res, data, count, page, limit);
  } catch (err) {
    next(err);
  }
};

// 获取单个词汇
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await Vocabulary.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Sentence, attributes: ['id', 'english_text', 'chinese_translation'] },
      ],
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

    const vocabulary = await Vocabulary.create({
      word,
      phonetic,
      definition,
      definition_zh,
      part_of_speech,
      difficulty_level,
      category_id,
      created_by: req.user?.userId,
    });

    return success(res, vocabulary, 'Vocabulary created', 201);
  } catch (err) {
    next(err);
  }
};

// 更新词汇
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await Vocabulary.findByPk(id);

    if (!vocabulary) {
      return error(res, 'Vocabulary not found', 404);
    }

    await vocabulary.update(req.body);
    return success(res, vocabulary, 'Vocabulary updated');
  } catch (err) {
    next(err);
  }
};

// 删除词汇
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vocabulary = await Vocabulary.findByPk(id);

    if (!vocabulary) {
      return error(res, 'Vocabulary not found', 404);
    }

    await vocabulary.update({ is_active: false });
    return success(res, null, 'Vocabulary deleted');
  } catch (err) {
    next(err);
  }
};

// 按分类获取词汇
exports.getByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Vocabulary.findAndCountAll({
      where: { category_id: categoryId, is_active: true },
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};
