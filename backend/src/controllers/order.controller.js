const { Order, OrderItem, Product, Shipment } = require('../models');
const { generateOrderId, generateShipmentId } = require('../utils/idGenerator');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: OrderItem, include: [{ model: Product }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ orders: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [{ model: Product }] }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const order_id = await generateOrderId(Order);
    const order = await Order.create({ ...req.body, order_id });
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.update(req.body);
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status });

    // Auto-create shipment on order confirmation
    if (status === 'confirmed') {
      const shipment_id = await generateShipmentId(Shipment);
      await Shipment.create({
        order_id: id,
        shipment_id,
        status: 'pending',
      });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

const getOrderItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await OrderItem.findAll({
      where: { order_id: id },
      include: [{ model: Product }],
    });
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const addOrderItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product_id, quantity, unit_price, discount_percent } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const tax_percent = product.gst_rate || 18;
    const discountAmount = (unit_price * quantity * discount_percent) / 100;
    const subtotal = unit_price * quantity - discountAmount;
    const tax_amount = (subtotal * tax_percent) / 100;
    const line_total = subtotal + tax_amount;

    const item = await OrderItem.create({
      order_id: id,
      product_id,
      quantity,
      unit_price,
      discount_percent,
      tax_percent,
      tax_amount,
      line_total,
    });

    res.status(201).json({ message: 'Item added to order', item });
  } catch (error) {
    next(error);
  }
};

const removeOrderItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const item = await OrderItem.findOne({ where: { id: itemId, order_id: id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item removed from order' });
  } catch (error) {
    next(error);
  }
};

const getByEntity = async (req, res, next) => {
  try {
    const { entity_type, entity_id } = req.query;
    const where = entity_type === 'buyer' ? { buyer_id: entity_id } : { seller_id: entity_id };
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, include: [{ model: Product }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteOrder,
  updateStatus,
  getOrderItems,
  addOrderItem,
  removeOrderItem,
  getByEntity,
};
