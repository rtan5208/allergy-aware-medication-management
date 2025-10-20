const db = require('../config/db');

const User = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows[0];
  },
  getByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
  create: async (data) => {
    const { username, password, role, full_name, email } = data;
    const [result] = await db.query(
      'INSERT INTO users (username, password, role, full_name, email) VALUES (?, ?, ?, ?, ?)',
      [username, password, role, full_name, email]
    );
    return result.insertId;
  },
  update: async (id, data) => {
    const { username, role, full_name, email, is_active } = data;
    const [result] = await db.query(
      'UPDATE users SET username=?, role=?, full_name=?, email=?, is_active=? WHERE user_id=?',
      [username, role, full_name, email, is_active, id]
    );
    return result.affectedRows; // Return number of rows updated
  },
  deactivate: async (id) => {
    await db.query('UPDATE users SET is_active=FALSE WHERE user_id=?', [id]);
  },
  
  delete: async (id) => {
    await db.query('DELETE FROM users WHERE user_id=?', [id]);
  }
};

module.exports = User;