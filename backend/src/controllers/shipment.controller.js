const { Shipment, Order } = require('../models');
const { generateShipmentId } = require('../utils/idGenerator');

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    let where = {};
    if (status) where.status = status;

    const { count, rows } = await Shipment.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: Order }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ shipments: rows, pagination: { total: count, page: parseInt(page), limit: parseInt(limit) } });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [{ model: Order }],
    });
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    res.json({ shipment });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const shipment_id = await generateShipmentId(Shipment);
    const shipment = await Shipment.create({ ...req.body, shipment_id });
    res.status(201).json({ message: 'Shipment created successfully', shipment });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    await shipment.update(req.body);
    res.json({ message: 'Shipment updated successfully', shipment });
  } catch (error) {
    next(error);
  }
};

const deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
    await shipment.destroy();
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const trackingEvents = shipment.tracking_events || [];
    trackingEvents.push({
      status,
      timestamp: new Date(),
      notes: `Status updated to ${status}`,
    });

    await shipment.update({ status, tracking_events: trackingEvents });
    res.json({ message: 'Shipment status updated', shipment });
  } catch (error) {
    next(error);
  }
};

const addTrackingEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const shipment = await Shipment.findByPk(id);
    if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

    const trackingEvents = shipment.tracking_events || [];
    trackingEvents.push({
      status,
      timestamp: new Date(),
      notes,
    });

    await shipment.update({ tracking_events: trackingEvents });
    res.json({ message: 'Tracking event added', shipment });
  } catch (error) {
    next(error);
  }
};

const getByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const shipments = await Shipment.findAll({
      where: { order_id: orderId },
      include: [{ model: Order }],
    });
    res.json({ shipments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteShipment,
  updateStatus,
  addTrackingEvent,
  getByOrder,
};
