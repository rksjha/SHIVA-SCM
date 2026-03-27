const { Client, Order } = require('../models');
const { generateClientId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (status) where.status = status;
    if (search) where = { ...where, [Op.or]: [{ company_name: { [Op.iLike]: `%${search}%` } }] };

    const { count, rows } = await Client.findAndCountAll({ where, offset, limit: parseInt(limit), order: [['createdAt', 'DESC']] });
    res.json({ clients: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ client });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const client_id = await generateClientId(Client);
    const client = await Client.create({ ...req.body, client_id });
    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.update(req.body);
    res.json({ message: 'Client updated successfully', client });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.update({ verified: true, verified_at: new Date() });
    res.json({ message: 'Client verified successfully', client });
  } catch (error) {
    next(error);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await Order.findAll({
      where: { buyer_id: id },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

const upgradeLoyaltyTier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { loyalty_tier } = req.body;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    await client.update({ loyalty_tier });
    res.json({ message: 'Loyalty tier updated', client });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteClient,
  verify,
  getOrderHistory,
  upgradeLoyaltyTier,
};
