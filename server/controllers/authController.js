const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Patient, defaultPatientData } = require('../models/Patient');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function sign(patient) {
  return jwt.sign({ patientId: patient._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });

    const existing = await Patient.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An account with that email already exists.' });

    const patient = await Patient.create({
      name, email, phone: phone || 'Not provided',
      passwordHash: bcrypt.hashSync(password, 8),
      ...defaultPatientData(),
    });

    res.json({ token: sign(patient), patient: patient.toJSON() });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed: ' + e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    let patient = await Patient.findOne({ email: email.toLowerCase() });

    // Demo convenience: auto-provision an account the first time a new email logs in.
    if (!patient) {
      patient = await Patient.create({
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email, phone: 'Not provided',
        passwordHash: bcrypt.hashSync(password, 8),
        ...defaultPatientData(),
      });
    } else if (!bcrypt.compareSync(password, patient.passwordHash)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    res.json({ token: sign(patient), patient: patient.toJSON() });
  } catch (e) {
    res.status(500).json({ error: 'Login failed: ' + e.message });
  }
};

exports.me = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  if (!patient) return res.status(404).json({ error: 'Not found' });
  res.json(patient.toJSON());
};
