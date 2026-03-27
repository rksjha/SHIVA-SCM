const { Category } = require('../models');
const { generateCategoryCode } = require('../utils/idGenerator');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Category.findAndCountAll({
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });
    res.json({ categories: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const category_code = await generateCategoryCode(Category);
    const category = await Category.create({ ...req.body, category_code });
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getCategoryTree = async (req, res, next) => {
  try {
    const buildTree = (categories, parentId = null) => {
      return categories
        .filter(c => c.parent_id === parentId)
        .map(c => ({
          ...c.toJSON(),
          children: buildTree(categories, c.id),
        }));
    };

    const allCategories = await Category.findAll();
    const tree = buildTree(allCategories);
    res.json({ categoryTree: tree });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteCategory,
  getCategoryTree,
};
