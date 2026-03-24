const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── API Controllers ─────────────────────────────────────────────────────────

exports.apiRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    return res.status(201).json({ success: true, message: 'User registered successfully.', token, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.apiLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = generateToken(user);
    return res.json({ success: true, message: 'Login successful.', token, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Web (EJS) Controllers ────────────────────────────────────────────────────

exports.showRegister = (req, res) => res.render('auth/register', { title: 'Register', error: null, values: {} });
exports.showLogin = (req, res) => res.render('auth/login', { title: 'Login', error: null });

exports.webRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', { title: 'Register', error: errors.array()[0].msg, values: req.body });
  }
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.render('auth/register', { title: 'Register', error: 'Email already registered.', values: req.body });

    await User.create({ name, email, password });
    res.redirect('/auth/login?registered=1');
  } catch (err) {
    res.render('auth/register', { title: 'Register', error: err.message, values: req.body });
  }
};

exports.webLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.render('auth/login', { title: 'Login', error: errors.array()[0].msg });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
    }
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  } catch (err) {
    res.render('auth/login', { title: 'Login', error: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};
