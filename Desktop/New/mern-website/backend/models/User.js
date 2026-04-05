const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  

  role: { type: String, enum: ['student', 'authority'], default: 'student' },

  department: { 
    type: String, 
    enum: ['CSE', 'EEE', 'ICT', 'ACCE', 'MATH'] 
  },
  session: { type: String },
  roll: { type: String },

  authorityType: { 
    type: String, 
    enum: [
      'Department', 
      'Hall provost', 
      'Transport office', 
      'Chatro upodesta', 
      'Proctor', 
      'Pro VC', 
      'VC'
    ] 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
