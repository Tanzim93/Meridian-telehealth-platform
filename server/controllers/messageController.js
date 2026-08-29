const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');

exports.list = async (req, res) => {
  const patient = await Patient.findById(req.patientId);
  res.json(patient.messages || {});
};

exports.send = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });

  const doctorId = req.params.doctorId;
  const doctor = await Doctor.findOne({ id: doctorId });
  const patient = await Patient.findById(req.patientId);

  if (!patient.messages) patient.messages = {};
  if (!patient.messages[doctorId]) patient.messages[doctorId] = [];
  patient.messages[doctorId].push({ from: 'me', text: text.trim(), time: 'Now' });
  patient.markModified('messages'); // Mixed-type fields need this so Mongoose saves the mutation
  await patient.save();

  // Simulated clinician auto-reply, written back a moment later.
  const patientId = req.patientId;
  setTimeout(async () => {
    try {
      const p2 = await Patient.findById(patientId);
      if (!p2) return;
      if (!p2.messages[doctorId]) p2.messages[doctorId] = [];
      p2.messages[doctorId].push({
        from: 'them',
        text: `Thanks for the update — ${doctor ? doctor.name.split(' ')[1] : 'your doctor'} will follow up shortly.`,
        time: 'Now',
      });
      p2.markModified('messages');
      await p2.save();
    } catch (e) { /* ignore — best-effort demo reply */ }
  }, 900);

  res.status(201).json(patient.messages[doctorId]);
};
