const { body } = require('express-validator');

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.patientRules = [
  body('name').trim().notEmpty().withMessage('Patient name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('contact').trim().notEmpty().withMessage('Contact number is required'),
];

exports.doctorRules = [
  body('name').trim().notEmpty().withMessage('Doctor name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('experience_years').optional().isInt({ min: 0, max: 60 }).withMessage('Experience must be between 0 and 60 years'),
];

exports.mappingRules = [
  body('patient_id').isInt({ min: 1 }).withMessage('Valid patient ID is required'),
  body('doctor_id').isInt({ min: 1 }).withMessage('Valid doctor ID is required'),
];
