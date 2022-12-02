const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  dateLogin: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: 'unblocked' },
});
module.exports = User;
