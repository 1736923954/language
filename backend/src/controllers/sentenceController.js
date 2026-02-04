const { Sentence, Vocabulary } = require('../models');
const { Op } = require('sequelize');
const { success, error, paginated } = require('../utils/response');

// 获取句子列表
exports.getList = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, vocabulary_id, difficulty_level } = req.query;
    const offset = (page - 1) * limit;

    const where = { is_active: true };
    if (vocabulary_id) where.vocabulary_id = vocabulary_id;
    if (difficulty_level) where.difficulty_level = difficulty_level;

    const { count, rows } = await Sentence.findAndCountAll({
      where,
      include: [{ model: Vocabulary, attributes: ['id', 'word'] }],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};

// 获取单个句子
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await Sentence.findByPk(id, {
      include: [{ model: Vocabulary, attributes: ['id', 'word'] }],
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

    const sentence = await Sentence.create({
      vocabulary_id,
      english_text,
      chinese_translation,
      usage_context,
      difficulty_level,
      created_by: req.user?.userId,
    });

    // 更新词汇的例句数量
    await Vocabulary.increment('example_count', {
      where: { id: vocabulary_id },
    });

    return success(res, sentence, 'Sentence created', 201);
  } catch (err) {
    next(err);
  }
};

// 更新句子
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await Sentence.findByPk(id);

    if (!sentence) {
      return error(res, 'Sentence not found', 404);
    }

    await sentence.update(req.body);
    return success(res, sentence, 'Sentence updated');
  } catch (err) {
    next(err);
  }
};

// 删除句子
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentence = await Sentence.findByPk(id);

    if (!sentence) {
      return error(res, 'Sentence not found', 404);
    }

    await sentence.update({ is_active: false });

    // 更新词汇的例句数量
    await Vocabulary.decrement('example_count', {
      where: { id: sentence.vocabulary_id },
    });

    return success(res, null, 'Sentence deleted');
  } catch (err) {
    next(err);
  }
};

// 按词汇获取句子
exports.getByVocabulary = async (req, res, next) => {
  try {
    const { vocabularyId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Sentence.findAndCountAll({
      where: { vocabulary_id: vocabularyId, is_active: true },
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });

    return paginated(res, rows, count, page, limit);
  } catch (err) {
    next(err);
  }
};
