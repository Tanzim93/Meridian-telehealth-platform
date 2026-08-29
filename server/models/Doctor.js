const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Human-friendly id used throughout the app and referenced by patients'
  // appointments/prescriptions/messages (e.g. "d1"), kept separate from Mongo's _id
  // so seed data and existing references stay stable and readable.
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  years: Number,
  rating: Number,
  reviews: Number,
  price: Number,
  bio: String,
  initials: String,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

const DOCTOR_SEED = [
  { id:'d1', name:'Dr. Amara Osei', specialty:'Family Medicine', years:12, rating:4.9, reviews:312, price:75, bio:'Dr. Osei focuses on whole-family primary care, from annual checkups to managing chronic conditions.', initials:'AO' },
  { id:'d2', name:'Dr. Rajiv Menon', specialty:'Cardiology', years:18, rating:4.8, reviews:198, price:120, bio:'Dr. Menon specializes in preventive cardiology and managing hypertension, arrhythmia, and cholesterol.', initials:'RM' },
  { id:'d3', name:'Dr. Sofia Lindqvist', specialty:'Dermatology', years:9, rating:4.9, reviews:267, price:95, bio:'Dr. Lindqvist treats acne, eczema, and skin concerns, with a focus on long-term skin health.', initials:'SL' },
  { id:'d4', name:'Dr. Michael Chen', specialty:'Pediatrics', years:7, rating:5.0, reviews:145, price:80, bio:'Dr. Chen cares for infants through teens, with a calm, kid-friendly approach to every visit.', initials:'MC' },
  { id:'d5', name:'Dr. Elena Vasquez', specialty:'Psychiatry', years:15, rating:4.7, reviews:203, price:140, bio:'Dr. Vasquez supports patients managing anxiety, depression, and medication management.', initials:'EV' },
  { id:'d6', name:'Dr. James Okafor', specialty:'Endocrinology', years:11, rating:4.8, reviews:176, price:110, bio:'Dr. Okafor manages diabetes, thyroid conditions, and metabolic health.', initials:'JO' },
];

// Populates the doctors collection on first run only — safe to call on every boot.
async function seedDoctors() {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(DOCTOR_SEED);
    console.log(`Seeded ${DOCTOR_SEED.length} doctors.`);
  }
}

module.exports = { Doctor, seedDoctors };
