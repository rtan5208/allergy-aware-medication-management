const db = require("../config/db");

const Allergy = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM allergies");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM allergies WHERE allergy_id = ?",
      [id]
    );
    return rows[0];
  },
  create: async (data) => {
    const { allergy_name, description } = data;
    const [result] = await db.query(
      "INSERT INTO allergies (allergy_name, description) VALUES (?, ?)",
      [allergy_name, description]
    );
    return result.insertId;
  },
  update: async (id, data) => {
    const { allergy_name, description } = data;
    const [result] = await db.query(
      "UPDATE allergies SET allergy_name=?, description=? WHERE allergy_id=?",
      [allergy_name, description, id]
    );
    return result.affectedRows;
  },
  checkReferences: async (id) => {
    const [[paCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM patient_allergies WHERE allergy_id=?",
      [id]
    );
    const [[iamCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM ingredient_allergy_map WHERE allergy_id=?",
      [id]
    );
    return { paCount: paCount.count, iamCount: iamCount.count };
  },
  delete: async (id) => {
    await db.query("DELETE FROM allergies WHERE allergy_id=?", [id]);
  },
};

module.exports = Allergy;
