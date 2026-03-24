const { validationResult } = require('express-validator');
const { Mapping, Patient, Doctor } = require('../models');

// ─── API Controllers ─────────────────────────────────────────────────────────

exports.apiCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { patient_id, doctor_id, notes } = req.body;
    const patient = await Patient.findOne({ where: { id: patient_id, created_by: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    const existing = await Mapping.findOne({ where: { patient_id, doctor_id } });
    if (existing) return res.status(409).json({ success: false, message: 'Mapping already exists.' });
    const mapping = await Mapping.create({ patient_id, doctor_id, notes });
    res.status(201).json({ success: true, message: 'Doctor assigned to patient.', mapping });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetAll = async (req, res) => {
  try {
    const mappings = await Mapping.findAll({
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name', 'age', 'gender'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization'] },
      ],
    });
    res.json({ success: true, count: mappings.length, mappings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetByPatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.patient_id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    const mappings = await Mapping.findAll({
      where: { patient_id: req.params.patient_id },
      include: [{ model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization', 'contact', 'email'] }],
    });
    res.json({ success: true, patient: { id: patient.id, name: patient.name }, count: mappings.length, mappings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiDelete = async (req, res) => {
  try {
    const mapping = await Mapping.findByPk(req.params.id);
    if (!mapping) return res.status(404).json({ success: false, message: 'Mapping not found.' });
    await mapping.destroy();
    res.json({ success: true, message: 'Mapping removed.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Web (EJS) Controllers ────────────────────────────────────────────────────

exports.webIndex = async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, as: 'patient' },
      { model: Doctor, as: 'doctor' },
    ],
  });
  const patients = await Patient.findAll({ where: { created_by: req.user.id } });
  const doctors = await Doctor.findAll();
  res.render('mappings/index', { title: 'Patient-Doctor Mappings', mappings, patients, doctors, success: req.query.success, error: null });
};

exports.webCreate = async (req, res) => {
  try {
    const { patient_id, doctor_id, notes } = req.body;
    const existing = await Mapping.findOne({ where: { patient_id, doctor_id } });
    if (existing) {
      const mappings = await Mapping.findAll({ include: [{ model: Patient, as: 'patient' }, { model: Doctor, as: 'doctor' }] });
      const patients = await Patient.findAll({ where: { created_by: req.user.id } });
      const doctors = await Doctor.findAll();
      return res.render('mappings/index', { title: 'Mappings', mappings, patients, doctors, error: 'This mapping already exists.', success: null });
    }
    await Mapping.create({ patient_id, doctor_id, notes });
    res.redirect('/mappings?success=Doctor assigned to patient');
  } catch (err) {
    res.redirect('/mappings?error=' + encodeURIComponent(err.message));
  }
};

exports.webDelete = async (req, res) => {
  const mapping = await Mapping.findByPk(req.params.id);
  if (mapping) await mapping.destroy();
  res.redirect('/mappings?success=Mapping removed');
};
