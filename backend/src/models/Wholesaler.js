const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Wholesaler = sequelize.define('Wholesaler', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    wholesaler_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'India',
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    warehouse_locations: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    storage_capacity: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    product_categories: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    suppliers_associated: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    min_order_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    credit_limit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    payment_terms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
    documents: {
      type: DataTypes.JSON,
      defaultValue: [],
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

  return Wholesaler;
};
