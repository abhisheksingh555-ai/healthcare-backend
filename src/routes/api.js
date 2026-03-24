const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const patientCtrl = require('../controllers/patientController');
const doctorCtrl = require('../controllers/doctorController');
const mappingCtrl = require('../controllers/mappingController');
const { authenticateAPI } = require('../middleware/auth');
const { registerRules, loginRules, patientRules, doctorRules, mappingRules } = require('../middleware/validators');

// Auth
router.post('/auth/register', registerRules, authCtrl.apiRegister);
router.post('/auth/login', loginRules, authCtrl.apiLogin);

// Patients (protected)
router.post('/patients', authenticateAPI, patientRules, patientCtrl.apiCreate);
router.get('/patients', authenticateAPI, patientCtrl.apiGetAll);
router.get('/patients/:id', authenticateAPI, patientCtrl.apiGetOne);
router.put('/patients/:id', authenticateAPI, patientRules, patientCtrl.apiUpdate);
router.delete('/patients/:id', authenticateAPI, patientCtrl.apiDelete);

// Doctors (protected)
router.post('/doctors', authenticateAPI, doctorRules, doctorCtrl.apiCreate);
router.get('/doctors', authenticateAPI, doctorCtrl.apiGetAll);
router.get('/doctors/:id', authenticateAPI, doctorCtrl.apiGetOne);
router.put('/doctors/:id', authenticateAPI, doctorRules, doctorCtrl.apiUpdate);
router.delete('/doctors/:id', authenticateAPI, doctorCtrl.apiDelete);

// Mappings (protected)
router.post('/mappings', authenticateAPI, mappingRules, mappingCtrl.apiCreate);
router.get('/mappings', authenticateAPI, mappingCtrl.apiGetAll);
router.get('/mappings/:patient_id', authenticateAPI, mappingCtrl.apiGetByPatient);
router.delete('/mappings/:id', authenticateAPI, mappingCtrl.apiDelete);

module.exports = router;
