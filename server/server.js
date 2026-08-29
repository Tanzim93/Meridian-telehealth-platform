const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const path = require('path');

const { PORT } = require('./config/env');
const { connectDB } = require('./config/db');
const { seedDoctors } = require('./models/Doctor');
const { authRequired } = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const recordRoutes = require('./routes/recordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/api/auth', authRoutes);
app.get('/api/me', authRequired, authController.me);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/record', recordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profile', profileRoutes);

async function start() {
  await connectDB();
  await seedDoctors();
  app.listen(PORT, () => {
    console.log(`Meridian API + frontend running at http://localhost:${PORT}`);
  });
}

start();