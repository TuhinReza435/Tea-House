const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Who made the complaint? Reference to User Model
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Complaint content
  description: { type: String, required: true },
  
  // Current status
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'solved'], 
    default: 'pending' 
  },

  // Authority currently reviewing it
  currentAuthority: { 
    type: String, 
    enum: [
      'Department', 'Hall provost', 'Transport office', 
      'Chatro upodesta', 'Proctor', 'Pro VC', 'VC'
    ],
    required: true
  },

  // Critical for the 2-day automatic forwarding
  lastForwardedAt: { type: Date, default: Date.now },

  // Tracking the complaint trail
  history: [
    {
      action: { type: String, enum: ['created', 'forwarded', 'accepted', 'rejected', 'solved'] },
      actionByAuthority: { type: String },
      comment: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
