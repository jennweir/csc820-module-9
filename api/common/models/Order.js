const { DataTypes } = require('sequelize');

const OrderModel = {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.STRING, allowNull: false, unique: true },
  customerEmail: { type: DataTypes.STRING, allowNull: false },
  items: { type: DataTypes.JSON, allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
};

module.exports = (sequelize) => sequelize.define('order', OrderModel);