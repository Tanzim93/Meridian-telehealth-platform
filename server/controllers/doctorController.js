const { Doctor } = require('../models/Doctor');

exports.list = async (req, res) => {
  const doctors = await Doctor.find().select('-_id -__v');
  res.json(doctors);
};

exports.getOne = async (req, res) => {
  const doc = await Doctor.findOne({ id: req.params.id }).select('-_id -__v');
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
};
