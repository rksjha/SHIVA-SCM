const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Retailer = sequelize.define('Retailer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    retailer_id: {
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
    store_type: {
      type: DataTypes.ENUM('physical', 'online', 'both'),
      defaultValue: 'physical',
    },
    product_categories: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    wholesalers_associated: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    customer_base_size: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    monthly_volume_approx: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
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

  return Retailer;
};
