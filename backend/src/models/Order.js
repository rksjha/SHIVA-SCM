const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order_type: {
      type: DataTypes.ENUM('purchase', 'sales', 'transfer'),
      defaultValue: 'purchase',
    },
    status: {
      type: DataTypes.ENUM('draft', 'confirmed', 'processing', 'dispatched', 'in_transit', 'delivered', 'cancelled', 'returned'),
      defaultValue: 'draft',
    },
    buyer_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    seller_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expected_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivery_address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    shipping_charges: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'partial', 'completed', 'refunded'),
      defaultValue: 'pending',
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_terms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Order;
};
