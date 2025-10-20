const db = require("../config/db");

const Medication = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM medications");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM medications WHERE medication_id = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { medication_name, manufacturer, type } = data;
    const [result] = await db.query(
      "INSERT INTO medications (medication_name, manufacturer, type) VALUES (?, ?, ?)",
      [medication_name, manufacturer, type]
    );
    return result.insertId;
  },
  update: async (id, data) => {
    const { medication_name, manufacturer, type } = data;
    const [result] = await db.query(
      "UPDATE medications SET medication_name=?, manufacturer=?, type=? WHERE medication_id=?",
      [medication_name, manufacturer, type, id]
    );
    return result.affectedRows;
  },
  // Reference check before delete
  checkReferences: async (id) => {
    const [[oiCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM order_items WHERE medication_id=?",
      [id]
    );
    const [[miCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM medication_ingredients WHERE medication_id=?",
      [id]
    );
    return { oiCount: oiCount.count, miCount: miCount.count };
  },
  delete: async (id) => {
    await db.query("DELETE FROM medications WHERE medication_id=?", [id]);
  },
};

module.exports = Medication;