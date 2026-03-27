const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    manufacturer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Manufacturers',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    unit_of_measure: {
      type: DataTypes.STRING,
      defaultValue: 'unit',
    },
    base_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    gst_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 18,
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    min_order_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    lead_time_days: {
      type: DataTypes.INTEGER,
      defaultValue: 7,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reorder_level: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
    },
    weight_per_unit: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    quality_grade: {
      type: DataTypes.ENUM('A', 'B', 'C', 'Premium'),
      defaultValue: 'A',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  return Product;
};
