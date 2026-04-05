require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const runEscalationJob = require('./jobs/escalationJob');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

app.get('/', (req, res) => {
  res.send('MERN Backend API is running...');
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully.');

    runEscalationJob();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Vercel-এর জন্য মাস্ট
module.exports = app;