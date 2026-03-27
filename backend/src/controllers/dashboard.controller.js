const { User, Manufacturer, Supplier, Wholesaler, Retailer, Client, Product, Order, Shipment, Category } = require('../models');
const { Op } = require('sequelize');

const getStats = async (req, res, next) => {
  try {
    const manufacturerCount = await Manufacturer.count();
    const supplierCount = await Supplier.count();
    const wholesalerCount = await Wholesaler.count();
    const retailerCount = await Retailer.count();
    const clientCount = await Client.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();

    const thisMonth = new Date();
    thisMonth.setDate(1);

    const thisMonthOrders = await Order.count({
      where: {
        createdAt: { [Op.gte]: thisMonth },
      },
    });

    const pendingOrders = await Order.count({
      where: { status: 'pending' },
    });

    const lowStockCount = await Product.count({
      where: {
        [Op.where]:
          `"stock_quantity" <= "reorder_level"`
      },
    });

    const totalRevenue = await Order.sum('total_amount') || 0;

    res.json({
      stats: {
        manufacturerCount,
        supplierCount,
        wholesalerCount,
        retailerCount,
        clientCount,
        productCount,
        orderCount,
        thisMonthOrders,
        pendingOrders,
        lowStockCount,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRevenueChart = async (req, res, next) => {
  try {
    const lastYear = new Date();
    lastYear.setMonth(lastYear.getMonth() - 11);

    const data = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(lastYear);
      month.setMonth(month.getMonth() + i);
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const revenue = await Order.sum('total_amount', {
        where: {
          createdAt: { [Op.between]: [monthStart, monthEnd] },
        },
      }) || 0;

      const monthName = month.toLocaleString('default', { month: 'short', year: '2-digit' });
      data.push({ month: monthName, revenue: parseFloat(revenue) });
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getOrderStatus = async (req, res, next) => {
  try {
    const statuses = ['draft', 'confirmed', 'processing', 'dispatched', 'in_transit', 'delivered', 'cancelled', 'returned'];
    const data = [];

    for (const status of statuses) {
      const count = await Order.count({ where: { status } });
      data.push({ status, count });
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await Product.findAll({
      attributes: { include: [[require('sequelize').fn('COUNT', require('sequelize').col('OrderItems.id')), 'order_count']] },
      include: [{
        model: require('../models').OrderItem,
        as: 'OrderItems',
        attributes: [],
      }],
      group: ['Product.id'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('OrderItems.id')), 'DESC']],
      limit: 10,
    });

    res.json({ products: topProducts });
  } catch (error) {
    next(error);
  }
};

const getTopClients = async (req, res, next) => {
  try {
    const topClients = await Client.findAll({
      attributes: { include: [[require('sequelize').fn('SUM', require('sequelize').col('Orders.total_amount')), 'total_spent']] },
      include: [{
        model: require('../models').Order,
        as: 'Orders',
        attributes: [],
      }],
      group: ['Client.id'],
      order: [[require('sequelize').fn('SUM', require('sequelize').col('Orders.total_amount')), 'DESC']],
      limit: 10,
    });

    res.json({ clients: topClients });
  } catch (error) {
    next(error);
  }
};

const getSupplyChainFlow = async (req, res, next) => {
  try {
    const data = [
      { stage: 'Manufacturers', count: await Manufacturer.count(), color: '#00b4a0' },
      { stage: 'Suppliers', count: await Supplier.count(), color: '#007d70' },
      { stage: 'Wholesalers', count: await Wholesaler.count(), color: '#f59e0b' },
      { stage: 'Retailers', count: await Retailer.count(), color: '#10b981' },
      { stage: 'Clients', count: await Client.count(), color: '#ef4444' },
    ];

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const shipments = await Shipment.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const activity = [...orders, ...shipments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    res.json({ activity });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getRevenueChart,
  getOrderStatus,
  getTopProducts,
  getTopClients,
  getSupplyChainFlow,
  getRecentActivity,
};
