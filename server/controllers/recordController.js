const { Patient } = require('../models/Patient');

exports.get = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  res.json(patient.record);
};

exports.addItem = async (req, res) => {
  const { field } = req.params; // 'allergies' | 'medications' | 'documents'
  const { value } = req.body;
  if (!['allergies', 'medications', 'documents'].includes(field)) return res.status(400).json({ error: 'Invalid field' });

  const patient = await Patient.findById(req.patientId);
  if (field === 'documents') patient.record.documents.push({ name: value });
  else patient.record[field].push(value);
  await patient.save();
  res.json(patient.record);
};

exports.removeItem = async (req, res) => {
  const { field, index } = req.params;
  if (!['allergies', 'medications'].includes(field)) return res.status(400).json({ error: 'Invalid field' });

  const patient = await Patient.findById(req.patientId);
  patient.record[field].splice(Number(index), 1);
  await patient.save();
  res.json(patient.record);
};
