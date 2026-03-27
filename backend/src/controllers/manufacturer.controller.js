const { Manufacturer, Product } = require('../models');
const { generateManufacturerId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, city, verified } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (status) where.status = status;
    if (verified) where.verified = verified === 'true';
    if (city) where.city = city;
    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { company_name: { [Op.iLike]: `%${search}%` } },
          { manufacturer_id: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Manufacturer.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      manufacturers: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findByPk(id, {
      include: [{ model: Product, as: 'Products' }],
    });

    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    res.json({ manufacturer });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const manufacturer_id = await generateManufacturerId(Manufacturer);

    const manufacturer = await Manufacturer.create({
      ...req.body,
      manufacturer_id,
    });

    res.status(201).json({
      message: 'Manufacturer created successfully',
      manufacturer,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    await manufacturer.update(req.body);

    res.json({
      message: 'Manufacturer updated successfully',
      manufacturer,
    });
  } catch (error) {
    next(error);
  }
};

const deleteManufacturer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    await manufacturer.destroy();

    res.json({ message: 'Manufacturer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    await manufacturer.update({
      verified: true,
      verified_at: new Date(),
    });

    res.json({
      message: 'Manufacturer verified successfully',
      manufacturer,
    });
  } catch (error) {
    next(error);
  }
};

const getManufacturerProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await Product.findAll({
      where: { manufacturer_id: id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findByPk(id);

    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }

    const productCount = await Product.count({
      where: { manufacturer_id: id },
    });

    res.json({
      stats: {
        productCount,
        verified: manufacturer.verified,
        rating: manufacturer.rating,
        status: manufacturer.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteManufacturer,
  verify,
  getManufacturerProducts,
  getStats,
};
