const { Patient } = require('../models/Patient');

exports.update = async (req, res) => {
  const { name, email, phone } = req.body;
  const patient = await Patient.findById(req.patientId);
  if (name) patient.name = name;
  if (email) patient.email = email;
  if (phone) patient.phone = phone;
  await patient.save();
  res.json(patient.toJSON());
};
