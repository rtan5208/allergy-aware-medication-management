const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.user_id);
    if (!user || user.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role, full_name, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await User.create({ username, password: hashedPassword, role, full_name, email });
    res.status(201).json({ user_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const affectedRows = await User.update(req.params.user_id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: `User ${req.params.user_id} not found.` });
    }
    res.json({ message: `User ${req.body.full_name || req.body.username} updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    await User.deactivate(req.params.user_id);
    res.json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.user_id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};