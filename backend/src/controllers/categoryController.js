const { Category } = require('../models');
const { success, error } = require('../utils/response');

// 获取所有分类
exports.getList = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['sort_order', 'ASC']],
    });
    return success(res, categories);
  } catch (err) {
    next(err);
  }
};

// 获取单个分类
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return error(res, 'Category not found', 404);
    }

    return success(res, category);
  } catch (err) {
    next(err);
  }
};

// 创建分类
exports.create = async (req, res, next) => {
  try {
    const { name, description, icon_url, sort_order } = req.body;

    const category = await Category.create({
      name,
      description,
      icon_url,
      sort_order: sort_order || 0,
    });

    return success(res, category, 'Category created', 201);
  } catch (err) {
    next(err);
  }
};

// 更新分类
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return error(res, 'Category not found', 404);
    }

    await category.update(req.body);
    return success(res, category, 'Category updated');
  } catch (err) {
    next(err);
  }
};

// 删除分类
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return error(res, 'Category not found', 404);
    }

    await category.destroy();
    return success(res, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
};
