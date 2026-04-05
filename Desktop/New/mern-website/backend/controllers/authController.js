const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate a token that lasts 30 days
const generateToken = (id, role, authorityType) => {
  return jwt.sign(
    { id, role, authorityType: authorityType || null },
    process.env.JWT_SECRET || 'your_super_secret_key',
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  const { name, email, password, role, department, session, roll, authorityType } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt password silently
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the DB record — only include optional fields if they have real values
    // (prevents empty-string "" from failing the Mongoose enum validator)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(department    && { department }),
      ...(session       && { session }),
      ...(roll          && { roll }),
      ...(authorityType && { authorityType }),
    });

    if (user) {
      res.status(201).json({
        _id: user.id, name: user.name, email: user.email, role: user.role,
        authorityType: user.authorityType, department: user.department,
        session: user.session, roll: user.roll,
        token: generateToken(user.id, user.role, user.authorityType),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find User
    const user = await User.findOne({ email });

    // Validate Password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id, name: user.name, email: user.email, role: user.role,
        authorityType: user.authorityType, department: user.department,
        session: user.session, roll: user.roll,
        token: generateToken(user.id, user.role, user.authorityType),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile };
