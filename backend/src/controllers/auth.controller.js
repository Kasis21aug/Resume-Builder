const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { supabase } = require('../config/db');

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill in all fields.' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        is_premium: false,
      })
      .select('id, name, email, is_premium')
      .single();

    if (error) throw error;

    const token = createToken(user.id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.is_premium,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Please enter email and password.' });

  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password, is_premium')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user)
      return res.status(400).json({ message: 'No account found with this email.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password.' });

    const token = createToken(user.id);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.is_premium,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────
// PUT /api/auth/upgrade  (simulate premium)
// ─────────────────────────────────────────
const upgrade = async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_premium: true })
      .eq('id', req.userId);

    if (error) throw error;
    res.json({ message: 'Upgraded to premium!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, upgrade };
