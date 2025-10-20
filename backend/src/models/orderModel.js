const db = require('../config/db');
const AuditLog = require('../models/auditLogModel')

const Order = {
  create: async (orderData, items, createdBy) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [orderResult] = await conn.query(
        'INSERT INTO orders (patient_id, prescriber_id, override_flag, override_reason) VALUES (?, ?, ?, ?)',
        [orderData.patient_id, orderData.prescriber_id, orderData.override_flag || false, orderData.override_reason || null]
      );
      const orderId = orderResult.insertId;

      for (const it of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, medication_id, dosage, frequency, duration, notes, allergy_risk_detected, allergy_severity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            it.medication_id,
            it.dosage || null,
            it.frequency || null,
            it.duration || null,
            it.notes || null,
            it.allergy_risk_detected ? 1 : 0,
            it.allergy_severity || 'None'
          ]
        );
      }

      // write generic audit log
      await AuditLog.insert({ user_id: createdBy, action_type: orderData.override_flag ? 'OVERRIDE_CREATE' : 'CREATE', entity_type: 'order', entity_id: orderId, description: orderData.override_reason || null });
      await conn.commit();
      return orderId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  update: async (orderId, orderData, items, updatedBy) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.query(
        'UPDATE orders SET prescriber_id=?, override_flag=?, override_reason=? WHERE order_id=?',
        [orderData.prescriber_id, orderData.override_flag || false, orderData.override_reason || null, orderId]
      );
      if (res.affectedRows === 0) {
        await conn.rollback();
        return 0;
      }

      await conn.query('DELETE FROM order_items WHERE order_id=?', [orderId]);
      for (const it of items) {
        await conn.query(
          `INSERT INTO order_items (order_id, medication_id, dosage, frequency, duration, notes, allergy_risk_detected, allergy_severity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            it.medication_id,
            it.dosage || null,
            it.frequency || null,
            it.duration || null,
            it.notes || null,
            it.allergy_risk_detected ? 1 : 0,
            it.allergy_severity || 'None'
          ]
        );
      }

      await AuditLog.insert({ user_id: updatedBy, action_type: 'UPDATE', entity_type: 'order', entity_id: orderId, description: orderData.override_reason || null });

      await conn.commit();
      return res.affectedRows;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  getById: async (orderId) => {
    const [orders] = await db.query(
      `SELECT o.*, p.name AS patient_name, u.full_name AS prescriber_name
       FROM orders o
       JOIN patients p ON o.patient_id = p.patient_id
       JOIN users u ON o.prescriber_id = u.user_id
       WHERE o.order_id = ?`, [orderId]
    );
    if (!orders[0]) return null;
    const [items] = await db.query(
      `SELECT oi.order_item_id, oi.medication_id, oi.dosage, oi.frequency, oi.duration, oi.notes,
              oi.allergy_risk_detected, oi.allergy_severity, m.medication_name
       FROM order_items oi
       JOIN medications m ON oi.medication_id = m.medication_id
       WHERE oi.order_id = ?`, [orderId]
    );
    return { ...orders[0], items };
  },

  listAll: async () => {
    const [rows] = await db.query(
      `SELECT o.*, p.name AS patient_name, u.full_name AS prescriber_name
       FROM orders o
       JOIN patients p ON o.patient_id = p.patient_id
       JOIN users u ON o.prescriber_id = u.user_id
       ORDER BY o.created_at DESC`
    );
    return rows;
  },

  delete: async (orderId) => {
    const [res] = await db.query('DELETE FROM orders WHERE order_id=?', [orderId]);
    return res.affectedRows;
  }
};

module.exports = Order;
