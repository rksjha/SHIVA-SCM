const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Shipment = sequelize.define('Shipment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    carrier_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driver_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    dispatch_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimated_arrival: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_arrival: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    origin_address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    destination_address: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'failed'),
      defaultValue: 'pending',
    },
    weight_kg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    volume_cbm: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    shipping_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    documents: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    tracking_events: {
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

  return Shipment;
};
