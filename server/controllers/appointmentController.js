const { Patient } = require('../models/Patient');

exports.list = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  res.json(patient.appointments);
};

exports.create = async (req, res) => {
  const { doctorId, day, date, time } = req.body;
  const patient = await Patient.findById(req.patientId);
  const appt = { id: 'a' + Date.now(), doctorId, day, date, time, type: 'Video visit', status: 'confirmed' };
  patient.appointments.unshift(appt);
  await patient.save();
  res.status(201).json(appt);
};

exports.remove = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  patient.appointments = patient.appointments.filter(a => a.id !== req.params.id);
  await patient.save();
  res.json({ ok: true });
};
