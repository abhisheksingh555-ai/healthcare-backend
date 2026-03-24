const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const patientCtrl = require('../controllers/patientController');
const doctorCtrl = require('../controllers/doctorController');
const mappingCtrl = require('../controllers/mappingController');
const { authenticateWeb } = require('../middleware/auth');
const { registerRules, loginRules, patientRules, doctorRules } = require('../middleware/validators');
const { Patient, Doctor, Mapping } = require('../models');

// Home
router.get('/', (req, res) => res.redirect('/auth/login'));

// Dashboard
router.get('/dashboard', authenticateWeb, async (req, res) => {
  const [patients, doctors, mappings] = await Promise.all([
    Patient.findAll({ where: { created_by: req.user.id } }),
    Doctor.findAll(),
    Mapping.findAll(),
  ]);
  res.render('dashboard', {
    title: 'Dashboard',
    stats: { patients: patients.length, doctors: doctors.length, mappings: mappings.length },
  });
});

// Auth
router.get('/auth/login', authCtrl.showLogin);
router.post('/auth/login', loginRules, authCtrl.webLogin);
router.get('/auth/register', authCtrl.showRegister);
router.post('/auth/register', registerRules, authCtrl.webRegister);
router.get('/auth/logout', authCtrl.logout);

// Patients
router.get('/patients', authenticateWeb, patientCtrl.webIndex);
router.get('/patients/new', authenticateWeb, patientCtrl.webForm);
router.post('/patients', authenticateWeb, patientRules, patientCtrl.webCreate);
router.get('/patients/:id', authenticateWeb, patientCtrl.webShow);
router.get('/patients/:id/edit', authenticateWeb, patientCtrl.webForm);
router.post('/patients/:id', authenticateWeb, patientRules, patientCtrl.webUpdate);
router.post('/patients/:id/delete', authenticateWeb, patientCtrl.webDelete);

// Doctors
router.get('/doctors', authenticateWeb, doctorCtrl.webIndex);
router.get('/doctors/new', authenticateWeb, doctorCtrl.webForm);
router.post('/doctors', authenticateWeb, doctorRules, doctorCtrl.webCreate);
router.get('/doctors/:id', authenticateWeb, doctorCtrl.webShow);
router.get('/doctors/:id/edit', authenticateWeb, doctorCtrl.webForm);
router.post('/doctors/:id', authenticateWeb, doctorRules, doctorCtrl.webUpdate);
router.post('/doctors/:id/delete', authenticateWeb, doctorCtrl.webDelete);

// Mappings
router.get('/mappings', authenticateWeb, mappingCtrl.webIndex);
router.post('/mappings', authenticateWeb, mappingCtrl.webCreate);
router.post('/mappings/:id/delete', authenticateWeb, mappingCtrl.webDelete);

module.exports = router;
