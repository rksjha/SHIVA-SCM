const { Product, Category, Manufacturer, PriceHistory } = require('../models');
const { generateProductId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category_id, manufacturer_id } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (category_id) where.category_id = category_id;
    if (manufacturer_id) where.manufacturer_id = manufacturer_id;
    if (search) where = { ...where, [Op.or]: [{ product_name: { [Op.iLike]: `%${search}%` } }] };

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: Category },
        { model: Manufacturer },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ products: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Manufacturer }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const product_id = await generateProductId(Product);
    const product = await Product.create({ ...req.body, product_id });
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        stock_quantity: { [Op.lte]: sequelize.where(sequelize.col('reorder_level'), Op.eq, sequelize.col('reorder_level')) }
      },
      include: [{ model: Category }, { model: Manufacturer }],
    });
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

const getPriceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await PriceHistory.findAll({
      where: { product_id: id },
      order: [['effective_date', 'DESC']],
    });
    res.json({ priceHistory: history });
  } catch (error) {
    next(error);
  }
};

const updatePrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { base_price, mrp, reason } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await PriceHistory.create({
      product_id: id,
      base_price,
      mrp,
      price_change_reason: reason,
      recorded_by: req.user?.id,
    });

    await product.update({ base_price, mrp });
    res.json({ message: 'Price updated successfully', product });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const products = await Product.findAll({
      where: { category_id },
      include: [{ model: Category }, { model: Manufacturer }],
    });
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteProduct,
  getLowStockProducts,
  getPriceHistory,
  updatePrice,
  getByCategory,
};
