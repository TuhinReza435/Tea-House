const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private/Student
const createComplaint = async (req, res) => {
  const { description, currentAuthority } = req.body;

  if (!description || !currentAuthority) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const complaint = await Complaint.create({
      student: req.user.id,
      description,
      currentAuthority,
      history: [
        {
          action: 'created',
          actionByAuthority: 'Student',
          comment: 'Initial complaint filed.',
        }
      ]
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in student's complaints
// @route   GET /api/complaints/me
// @access  Private/Student
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get authority's pending complaints
// @route   GET /api/complaints/authority
// @access  Private/Authority
const getAuthorityComplaints = async (req, res) => {
  try {
    // Only fetch complaints assigned to this specific authority type 
    // that are currently pending or accepted.
    const complaints = await Complaint.find({ 
      currentAuthority: req.user.authorityType,
      status: { $in: ['pending', 'accepted'] }
    }).populate('student', 'name roll department session').sort({ createdAt: 1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Authority
const updateComplaintStatus = async (req, res) => {
  const { status, comment } = req.body;
  const validStatuses = ['accepted', 'rejected', 'solved'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update status
    complaint.status = status;

    // Push log to history
    complaint.history.push({
      action: status,
      actionByAuthority: req.user.authorityType,
      comment: comment || `Marked as ${status}`,
      timestamp: new Date()
    });

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getMyComplaints, getAuthorityComplaints, updateComplaintStatus };
