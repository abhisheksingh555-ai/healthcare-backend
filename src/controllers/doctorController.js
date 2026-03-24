const { validationResult } = require('express-validator');
const { Doctor, Patient, User } = require('../models');

// ─── API Controllers ─────────────────────────────────────────────────────────

exports.apiCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const existing = await Doctor.findOne({ where: { email: req.body.email } });
    if (existing) return res.status(409).json({ success: false, message: 'Doctor email already registered.' });
    const doctor = await Doctor.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ success: true, message: 'Doctor created.', doctor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetAll = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({ include: [{ model: User, as: 'creator', attributes: ['id', 'name'] }] });
    res.json({ success: true, count: doctors.length, doctors });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiGetOne = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, { include: [{ model: Patient, as: 'assignedPatients', attributes: ['id', 'name', 'age', 'gender'] }] });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found.' });
    res.json({ success: true, doctor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiUpdate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const doctor = await Doctor.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found or unauthorized.' });
    await doctor.update(req.body);
    res.json({ success: true, message: 'Doctor updated.', doctor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiDelete = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found or unauthorized.' });
    await doctor.destroy();
    res.json({ success: true, message: 'Doctor deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Web (EJS) Controllers ────────────────────────────────────────────────────

exports.webIndex = async (req, res) => {
  const doctors = await Doctor.findAll();
  res.render('doctors/index', { title: 'Doctors', doctors, success: req.query.success });
};

exports.webShow = async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id, { include: [{ model: Patient, as: 'assignedPatients' }] });
  if (!doctor) return res.redirect('/doctors');
  res.render('doctors/show', { title: doctor.name, doctor });
};

exports.webCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('doctors/form', { title: 'Add Doctor', doctor: null, error: errors.array()[0].msg, values: req.body });
  try {
    await Doctor.create({ ...req.body, created_by: req.user.id });
    res.redirect('/doctors?success=Doctor added successfully');
  } catch (err) {
    res.render('doctors/form', { title: 'Add Doctor', doctor: null, error: err.message, values: req.body });
  }
};

exports.webUpdate = async (req, res) => {
  const errors = validationResult(req);
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.redirect('/doctors');
  if (!errors.isEmpty()) return res.render('doctors/form', { title: 'Edit Doctor', doctor, error: errors.array()[0].msg, values: req.body });
  try {
    await doctor.update(req.body);
    res.redirect(`/doctors/${doctor.id}?success=Updated`);
  } catch (err) {
    res.render('doctors/form', { title: 'Edit Doctor', doctor, error: err.message, values: req.body });
  }
};

exports.webDelete = async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (doctor) await doctor.destroy();
  res.redirect('/doctors?success=Doctor deleted');
};

exports.webForm = async (req, res) => {
  const doctor = req.params.id ? await Doctor.findByPk(req.params.id) : null;
  res.render('doctors/form', { title: doctor ? 'Edit Doctor' : 'Add Doctor', doctor, error: null, values: doctor || {} });
};
