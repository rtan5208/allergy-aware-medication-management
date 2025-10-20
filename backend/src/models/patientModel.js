const db = require("../config/db");

const Patient = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM patients");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM patients WHERE patient_id = ?",
      [id]
    );
    return rows[0];
  },
  create: async (data) => {
    const { name, nric_passport, dob, age, gender, phone, email, notes } = data;
    const [result] = await db.query(
      "INSERT INTO patients (name, nric_passport, dob, age, gender, phone, email, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, nric_passport, dob, age, gender, phone, email, notes]
    );
    return result.insertId;
  },
  update: async (id, data) => {
    const { name, nric_passport, dob, age, gender, phone, email, notes } = data;
    const [result] = await db.query(
      "UPDATE patients SET name=?, nric_passport=?, dob=?, age=?, gender=?, phone=?, email=?, notes=? WHERE patient_id=?",
      [name, nric_passport, dob, age, gender, phone, email, notes, id]
    );
    return result.affectedRows; // Return number of rows updated
  },
  delete: async (id) => {
    await db.query("DELETE FROM patients WHERE patient_id=?", [id]);
  },
  checkReferences: async (id) => {
    const [rows] = await db.query(
      `
      SELECT 
        p.name AS patient_name,
        o.order_id,
        pa.patient_allergy_id
      FROM patients p
      LEFT JOIN orders o ON p.patient_id = o.patient_id
      LEFT JOIN patient_allergies pa ON p.patient_id = pa.patient_id
      WHERE p.patient_id = ?
      LIMIT 1
    `,
      [id]
    );
    return rows[0]; // returns undefined if not found
  },
};

module.exports = Patient;
