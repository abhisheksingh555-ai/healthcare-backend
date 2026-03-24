const { validationResult } = require('express-validator');
const { Patient, Doctor, User } = require('../models');

// ─── API Controllers ─────────────────────────────────────────────────────────

exports.apiCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const patient = await Patient.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ success: true, message: 'Patient created.', patient });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetAll = async (req, res) => {
  try {
    const patients = await Patient.findAll({ where: { created_by: req.user.id }, include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }] });
    res.json({ success: true, count: patients.length, patients });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetOne = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id }, include: [{ model: Doctor, as: 'assignedDoctors', attributes: ['id', 'name', 'specialization', 'contact'] }] });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    res.json({ success: true, patient });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiUpdate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    await patient.update(req.body);
    res.json({ success: true, message: 'Patient updated.', patient });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiDelete = async (req, res) => {
  try {
    const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    await patient.destroy();
    res.json({ success: true, message: 'Patient deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Web (EJS) Controllers ────────────────────────────────────────────────────

exports.webIndex = async (req, res) => {
  const patients = await Patient.findAll({ where: { created_by: req.user.id } });
  res.render('patients/index', { title: 'Patients', patients, success: req.query.success });
};

exports.webShow = async (req, res) => {
  const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id }, include: [{ model: Doctor, as: 'assignedDoctors' }] });
  if (!patient) return res.redirect('/patients');
  res.render('patients/show', { title: patient.name, patient });
};

exports.webCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('patients/form', { title: 'Add Patient', patient: null, error: errors.array()[0].msg, values: req.body });
  try {
    await Patient.create({ ...req.body, created_by: req.user.id });
    res.redirect('/patients?success=Patient added successfully');
  } catch (err) {
    res.render('patients/form', { title: 'Add Patient', patient: null, error: err.message, values: req.body });
  }
};

exports.webUpdate = async (req, res) => {
  const errors = validationResult(req);
  const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id } });
  if (!patient) return res.redirect('/patients');
  if (!errors.isEmpty()) return res.render('patients/form', { title: 'Edit Patient', patient, error: errors.array()[0].msg, values: req.body });
  try {
    await patient.update(req.body);
    res.redirect(`/patients/${patient.id}?success=Updated`);
  } catch (err) {
    res.render('patients/form', { title: 'Edit Patient', patient, error: err.message, values: req.body });
  }
};

exports.webDelete = async (req, res) => {
  const patient = await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id } });
  if (patient) await patient.destroy();
  res.redirect('/patients?success=Patient deleted');
};

exports.webForm = async (req, res) => {
  const patient = req.params.id ? await Patient.findOne({ where: { id: req.params.id, created_by: req.user.id } }) : null;
  res.render('patients/form', { title: patient ? 'Edit Patient' : 'Add Patient', patient, error: null, values: patient || {} });
};
