const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true, len: [2, 100] },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 150 },
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { notEmpty: true },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  medical_history: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'patients',
  timestamps: true,
});

module.exports = Patient;
