const { Supplier } = require('../models');
const { generateSupplierId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (status) where.status = status;
    if (search) where = { ...where, [Op.or]: [{ company_name: { [Op.iLike]: `%${search}%` } }] };

    const { count, rows } = await Supplier.findAndCountAll({ where, offset, limit: parseInt(limit), order: [['createdAt', 'DESC']] });
    res.json({ suppliers: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ supplier });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const supplier_id = await generateSupplierId(Supplier);
    const supplier = await Supplier.create({ ...req.body, supplier_id });
    res.status(201).json({ message: 'Supplier created successfully', supplier });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.update(req.body);
    res.json({ message: 'Supplier updated successfully', supplier });
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.update({ verified: true, verified_at: new Date() });
    res.json({ message: 'Supplier verified successfully', supplier });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteSupplier,
  verify,
};
