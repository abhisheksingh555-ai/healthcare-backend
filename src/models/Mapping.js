const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mapping = sequelize.define('Mapping', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'patients', key: 'id' },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'doctors', key: 'id' },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'patient_doctor_mappings',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['patient_id', 'doctor_id'] },
  ],
});

module.exports = Mapping;
