const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Signup a new user
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    // 2. Check if username is taken
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }
    // 3. Create and save user (password is hashed in the model)
    const user = new User({ username, password });
    await user.save();
    // 4. Create JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    // 5. Respond with token and user info
    res.status(201).json({ success: true, token, user: { username: user.username, id: user._id } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    // 2. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    // 3. Check password
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    // 4. Create JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    // 5. Respond with token and user info
    res.json({ success: true, token, user: { username: user.username, id: user._id } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 

