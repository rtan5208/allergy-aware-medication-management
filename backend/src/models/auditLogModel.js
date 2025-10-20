const db = require('../config/db');

const AuditLog = {
  insert: async ({ user_id = null, action_type, entity_type, entity_id = null, description = null, metadata = null }) => {
    try {
      const [result] = await db.query(
        'INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
        [user_id, action_type, entity_type, entity_id, description]
      );
      return result.insertId;
    } catch (err) {
      // If metadata column doesn't exist, retry without it
      if (err && err.code === 'ER_BAD_FIELD_ERROR') {
        const [result] = await db.query(
          'INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
          [user_id, action_type, entity_type, entity_id, description]
        );
        return result.insertId;
      }
      throw err;
    }
  },

  listByEntity: async (entity_type, entity_id, limit = 100) => {
    const [rows] = await db.query(
      'SELECT * FROM audit_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC LIMIT ?',
      [entity_type, entity_id, limit]
    );
    return rows;
  },

  // optional generic query helper
  query: async (sql, params) => {
    const [rows] = await db.query(sql, params || []);
    return rows;
  }
};

module.exports = AuditLog;
