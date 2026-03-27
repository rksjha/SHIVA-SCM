const { Retailer } = require('../models');
const { generateRetailerId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (status) where.status = status;
    if (search) where = { ...where, [Op.or]: [{ company_name: { [Op.iLike]: `%${search}%` } }] };

    const { count, rows } = await Retailer.findAndCountAll({ where, offset, limit: parseInt(limit), order: [['createdAt', 'DESC']] });
    res.json({ retailers: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const retailer = await Retailer.findByPk(req.params.id);
    if (!retailer) return res.status(404).json({ message: 'Retailer not found' });
    res.json({ retailer });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const retailer_id = await generateRetailerId(Retailer);
    const retailer = await Retailer.create({ ...req.body, retailer_id });
    res.status(201).json({ message: 'Retailer created successfully', retailer });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const retailer = await Retailer.findByPk(req.params.id);
    if (!retailer) return res.status(404).json({ message: 'Retailer not found' });
    await retailer.update(req.body);
    res.json({ message: 'Retailer updated successfully', retailer });
  } catch (error) {
    next(error);
  }
};

const deleteRetailer = async (req, res, next) => {
  try {
    const retailer = await Retailer.findByPk(req.params.id);
    if (!retailer) return res.status(404).json({ message: 'Retailer not found' });
    await retailer.destroy();
    res.json({ message: 'Retailer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const retailer = await Retailer.findByPk(req.params.id);
    if (!retailer) return res.status(404).json({ message: 'Retailer not found' });
    await retailer.update({ verified: true, verified_at: new Date() });
    res.json({ message: 'Retailer verified successfully', retailer });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteRetailer,
  verify,
};
