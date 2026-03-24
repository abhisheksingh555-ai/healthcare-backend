const sequelize = require('../config/database');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

// Associations
User.hasMany(Patient, { foreignKey: 'created_by', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Doctor, { foreignKey: 'created_by', as: 'doctors' });
Doctor.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Patient.belongsToMany(Doctor, {
  through: Mapping,
  foreignKey: 'patient_id',
  otherKey: 'doctor_id',
  as: 'assignedDoctors',
});
Doctor.belongsToMany(Patient, {
  through: Mapping,
  foreignKey: 'doctor_id',
  otherKey: 'patient_id',
  as: 'assignedPatients',
});

Mapping.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };
