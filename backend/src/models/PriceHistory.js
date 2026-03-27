const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const PriceHistory = sequelize.define('PriceHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id',
      },
    },
    effective_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    base_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    supplier_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    market_region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price_change_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recorded_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return PriceHistory;
};
