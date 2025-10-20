const db = require('../config/db');
const Order = require('../models/orderModel');
const Patient = require('../models/patientModel');

const SEVERITY_COLOR = {
  Mild: 'yellow',
  Moderate: 'orange',
  Severe: 'red'
};

async function detectIngredientAllergyConflicts(patientId, medicationIds) {
  if (!medicationIds || medicationIds.length === 0) return [];
  const placeholders = medicationIds.map(() => '?').join(', ');
  const sql = `
    SELECT DISTINCT mi.medication_id, ai.ingredient_id, ai.ingredient_name, al.allergy_id, al.allergy_name, pa.severity
    FROM medication_ingredients mi
    JOIN active_ingredients ai ON mi.ingredient_id = ai.ingredient_id
    JOIN ingredient_allergy_map iam ON ai.ingredient_id = iam.ingredient_id
    JOIN allergies al ON iam.allergy_id = al.allergy_id
    JOIN patient_allergies pa ON pa.allergy_id = al.allergy_id AND pa.patient_id = ?
    WHERE mi.medication_id IN (${placeholders})
  `;
  const params = [patientId, ...medicationIds];
  const [rows] = await db.query(sql, params);
  return rows;
}

exports.createOrder = async (req, res) => {
  try {
    const { patient_id, prescriber_id, items, override_flag, override_reason } = req.body;
    if (!patient_id || !prescriber_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'patient_id, prescriber_id and items[] are required.' });
    }

    const patient = await Patient.getById(patient_id);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    // detect conflicts per medication and mark items
    const medicationIds = items.map(i => i.medication_id);
    const conflicts = await detectIngredientAllergyConflicts(patient_id, medicationIds);

    // Build a map of medication_id -> highest severity using returned medication_id
    const severityRank = { None: 0, Mild: 1, Moderate: 2, Severe: 3 };
    const medSeverity = {}; // medication_id -> { severity, allergy_names[] }
    for (const c of conflicts) {
      const mid = c.medication_id;
      if (!mid) continue;
      const prev = medSeverity[mid];
      const sev = c.severity || 'Mild';
      if (!prev || severityRank[sev] > severityRank[prev.severity]) {
        medSeverity[mid] = { severity: sev, allergy_names: [c.allergy_name] };
      } else if (prev && !prev.allergy_names.includes(c.allergy_name)) {
        prev.allergy_names.push(c.allergy_name);
      }
    }

    // If any conflicts and no override, return summary
    if (conflicts.length > 0 && !override_flag) {
      const summary = Object.entries(medSeverity).map(([medId, info]) => ({
        medication_id: medId,
        severity: info.severity,
        severity_color: SEVERITY_COLOR[info.severity] || 'red',
        allergies: info.allergy_names
      }));
      return res.status(400).json({ warning: 'Allergy conflict detected. Set override_flag with reason to proceed.', conflicts: summary });
    }

    // annotate items with allergy flags before storage
    const annotatedItems = items.map(it => {
      const info = medSeverity[it.medication_id];
      return {
        ...it,
        allergy_risk_detected: !!info,
        allergy_severity: info ? info.severity : 'None'
      };
    });

    const createdBy = req.user ? req.user.user_id : prescriber_id;
  const orderId = await Order.create({ patient_id, prescriber_id, override_flag: !!override_flag, override_reason: override_reason || null }, annotatedItems, createdBy);

    return res.status(201).json({ order_id: orderId, override_applied: !!override_flag });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.getById(req.params.order_id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const rows = await Order.listAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const { prescriber_id, items, override_flag, override_reason } = req.body;
  const medicationIds = items ? items.map(i => i.medication_id) : [];

    const order = await Order.getById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const conflicts = await detectIngredientAllergyConflicts(order.patient_id, medicationIds);
    const medSeverity = {};
    const severityRank = { None: 0, Mild: 1, Moderate: 2, Severe: 3 };
    for (const c of conflicts) {
      const mid = c.medication_id;
      if (!mid) continue;
      const prev = medSeverity[mid];
      const sev = c.severity || 'Mild';
      if (!prev || severityRank[sev] > severityRank[prev.severity]) {
        medSeverity[mid] = { severity: sev, allergy_names: [c.allergy_name] };
      } else if (prev && !prev.allergy_names.includes(c.allergy_name)) {
        prev.allergy_names.push(c.allergy_name);
      }
    }

    if (conflicts.length > 0 && !override_flag) {
      const summary = Object.entries(medSeverity).map(([medId, info]) => ({
        medication_id: medId,
        severity: info.severity,
        severity_color: SEVERITY_COLOR[info.severity] || 'red',
        allergies: info.allergy_names
      }));
      return res.status(400).json({ warning: 'Allergy conflict detected on update. Set override_flag with reason to proceed.', conflicts: summary });
    }

    const annotatedItems = (items || []).map(it => {
      const info = medSeverity[it.medication_id];
      return {
        ...it,
        allergy_risk_detected: !!info,
        allergy_severity: info ? info.severity : 'None'
      };
    });

    const updatedBy = req.user ? req.user.user_id : prescriber_id;
    const affected = await Order.update(orderId, { prescriber_id, override_flag: !!override_flag, override_reason: override_reason || null }, annotatedItems || [], updatedBy);
    if (affected === 0) return res.status(404).json({ error: 'Order not found or no changes applied.' });
    res.json({ message: 'Order updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const affected = await Order.delete(req.params.order_id);
    if (affected === 0) return res.status(404).json({ error: 'Order not found.' });
    res.json({ message: 'Order deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
