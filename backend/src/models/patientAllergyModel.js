const db = require("../config/db");

const PatientAllergy = {

  getByPatientId: async (patientId) => {
    const [rows] = await db.query(
      `SELECT pa.patient_allergy_id, pa.severity, pa.notes, a.allergy_id, a.allergy_name, a.description
       FROM patient_allergies pa
       JOIN allergies a ON pa.allergy_id = a.allergy_id
       WHERE pa.patient_id = ?`,
      [patientId]
    );
    return rows;
  },
  create: async (patientId, data) => {
    const { allergy_id, severity, notes } = data;
    const [result] = await db.query(
      `INSERT INTO patient_allergies (patient_id, allergy_id, severity, notes) VALUES (?, ?, ?, ?)`,
      [patientId, allergy_id, severity, notes]
    );
    return result.insertId;
  },
  update: async (patientAllergyId, data) => {
    const { severity, notes } = data;
    const [result] = await db.query(
      `UPDATE patient_allergies SET severity=?, notes=? WHERE patient_allergy_id=?`,
      [severity, notes, patientAllergyId]
    );
    return result.affectedRows;
  },
  delete: async (patientAllergyId) => {
    const [result] = await db.query(
      `DELETE FROM patient_allergies WHERE patient_allergy_id=?`,
      [patientAllergyId]
    );
    return result.affectedRows;
  },
  // Reference check (for update/delete)
  getById: async (patientAllergyId) => {
    const [rows] = await db.query(
      `SELECT * FROM patient_allergies WHERE patient_allergy_id=?`,
      [patientAllergyId]
    );
    return rows[0];
  },
};

module.exports = PatientAllergy;
