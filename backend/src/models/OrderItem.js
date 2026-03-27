const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    discount_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    tax_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 18,
    },
    tax_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    line_total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
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

  return OrderItem;
};
