const { Patient } = require('../models/Patient');

exports.list = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  res.json(patient.prescriptions);
};

exports.refill = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  const rx = patient.prescriptions.find(p => p.id === req.params.id);
  if (!rx) return res.status(404).json({ error: 'Prescription not found' });
  if (rx.refillsLeft < 1) return res.status(400).json({ error: 'No refills left' });
  rx.refillsLeft -= 1;
  await patient.save();
  res.json(rx);
};
