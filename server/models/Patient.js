const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  id: String,
  doctorId: String,
  date: String,
  day: String,
  time: String,
  type: { type: String, default: 'Video visit' },
  status: { type: String, default: 'confirmed' },
}, { _id: false });

const prescriptionSchema = new Schema({
  id: String,
  name: String,
  doctor: String,
  instructions: String,
  status: String,
  refillsLeft: Number,
}, { _id: false });

const invoiceSchema = new Schema({
  id: String,
  desc: String,
  date: String,
  amount: Number,
  status: String,
}, { _id: false });

const documentSchema = new Schema({ name: String }, { _id: false });

const recordSchema = new Schema({
  allergies: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  conditions: { type: [String], default: [] },
  bloodType: { type: String, default: 'O+' },
  documents: { type: [documentSchema], default: [] },
}, { _id: false });

const patientSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: 'Not provided' },
  passwordHash: { type: String, required: true },

  appointments: { type: [appointmentSchema], default: [] },
  prescriptions: { type: [prescriptionSchema], default: [] },
  invoices: { type: [invoiceSchema], default: [] },
  record: { type: recordSchema, default: () => ({}) },

  // Keyed by doctor id -> array of { from, text, time }. Shape is dynamic
  // (one key per doctor thread) so Mixed is simpler here than a strict schema.
  messages: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Never send the password hash back in API responses.
patientSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.passwordHash; return ret; },
});

const Patient = mongoose.model('Patient', patientSchema);

// Starting data for every newly created patient — mirrors the original
// prototype's seeded demo content so a fresh signup still has something to look at.
function defaultPatientData() {
  return {
    appointments: [
      { id:'a1', doctorId:'d1', date:'Aug 6', day:'Tomorrow', time:'10:00 AM', type:'Video visit', status:'confirmed' },
    ],
    prescriptions: [
      { id:'p1', name:'Lisinopril 10mg', doctor:'Dr. Rajiv Menon', instructions:'1 tablet daily, with water', status:'Active', refillsLeft:2 },
      { id:'p2', name:'Amoxicillin 500mg', doctor:'Dr. Amara Osei', instructions:'1 capsule 3x daily for 7 days', status:'Completed', refillsLeft:0 },
    ],
    invoices: [
      { id:'i1', desc:'Consultation — Dr. Amara Osei', date:'Jul 22, 2026', amount:75, status:'Paid' },
      { id:'i2', desc:'Consultation — Dr. Rajiv Menon', date:'Aug 1, 2026', amount:120, status:'Unpaid' },
    ],
    record: {
      allergies: ['Penicillin'],
      medications: ['Lisinopril 10mg — daily'],
      conditions: ['Hypertension (controlled)'],
      bloodType: 'O+',
      documents: [{ name:'Insurance card — front.jpg' }, { name:'Lab results — June 2026.pdf' }],
    },
    messages: {
      d1: [
        { from:'them', text:"Hi — just checking in after your visit. How's the new dosage working?", time:'9:12 AM' },
        { from:'me', text:'Feeling better, thanks! Not as tired in the mornings anymore.', time:'9:20 AM' },
        { from:'them', text:"Great to hear. Let's keep it steady and revisit at your next appointment.", time:'9:22 AM' },
      ],
      d2: [
        { from:'them', text:'Your latest bloodwork looks good — cholesterol is trending down.', time:'Yesterday' },
      ],
    },
  };
}

module.exports = { Patient, defaultPatientData };
