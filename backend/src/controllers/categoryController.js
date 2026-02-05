const prisma = require('../models');
const { success, error } = require('../utils/response');

// 获取所有分类
exports.getList = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sort_order: 'asc' },
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
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

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

    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon_url,
        sort_order: sort_order || 0,
      },
    });

    return success(res, category, 'Category created', 201);
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'Category name already exists', 400);
    }
    next(err);
  }
};

// 更新分类
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return success(res, category, 'Category updated');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Category not found', 404);
    }
    next(err);
  }
};

// 删除分类
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return success(res, null, 'Category deleted');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Category not found', 404);
    }
    if (err.code === 'P2003') {
      return error(res, 'Cannot delete category with associated vocabularies', 400);
    }
    next(err);
  }
};
