const sequelize = require('../config/database');
const UserModel = require('./User');
const CategoryModel = require('./Category');
const ManufacturerModel = require('./Manufacturer');
const SupplierModel = require('./Supplier');
const WholesalerModel = require('./Wholesaler');
const RetailerModel = require('./Retailer');
const ClientModel = require('./Client');
const ProductModel = require('./Product');
const OrderModel = require('./Order');
const OrderItemModel = require('./OrderItem');
const ShipmentModel = require('./Shipment');
const PriceHistoryModel = require('./PriceHistory');

// Initialize models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Manufacturer = ManufacturerModel(sequelize);
const Supplier = SupplierModel(sequelize);
const Wholesaler = WholesalerModel(sequelize);
const Retailer = RetailerModel(sequelize);
const Client = ClientModel(sequelize);
const Product = ProductModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Shipment = ShipmentModel(sequelize);
const PriceHistory = PriceHistoryModel(sequelize);

// Define associations
// Categories (self-referential for hierarchy)
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

// Products
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Manufacturer.hasMany(Product, { foreignKey: 'manufacturer_id', onDelete: 'RESTRICT' });
Product.belongsTo(Manufacturer, { foreignKey: 'manufacturer_id' });

// Orders
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Shipments
Order.hasMany(Shipment, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Shipment.belongsTo(Order, { foreignKey: 'order_id' });

// Price History
Product.hasMany(PriceHistory, { foreignKey: 'product_id', onDelete: 'CASCADE' });
PriceHistory.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(PriceHistory, { foreignKey: 'recorded_by' });
PriceHistory.belongsTo(User, { foreignKey: 'recorded_by' });

module.exports = {
  sequelize,
  User,
  Category,
  Manufacturer,
  Supplier,
  Wholesaler,
  Retailer,
  Client,
  Product,
  Order,
  OrderItem,
  Shipment,
  PriceHistory,
};
