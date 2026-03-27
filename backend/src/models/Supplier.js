const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    supplier_id: {
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
    supplier_type: {
      type: DataTypes.ENUM('primary', 'secondary', 'spot'),
      defaultValue: 'primary',
    },
    categories_supplied: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    manufacturers_associated: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    credit_limit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit_period_days: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
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

  return Supplier;
};
