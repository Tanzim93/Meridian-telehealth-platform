const { Patient } = require('../models/Patient');

exports.list = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  res.json(patient.invoices);
};

exports.pay = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  const inv = patient.invoices.find(i => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: 'Invoice not found' });
  inv.status = 'Paid';
  await patient.save();
  res.json(inv);
};
