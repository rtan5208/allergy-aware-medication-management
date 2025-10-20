const db = require("../config/db");

const Ingredient = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM active_ingredients");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM active_ingredients WHERE ingredient_id = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { ingredient_name, description } = data;
    const [result] = await db.query(
      "INSERT INTO active_ingredients (ingredient_name, description) VALUES (?, ?)",
      [ingredient_name, description]
    );
    return result.insertId;
  },
  update: async (id, data) => {
    const { ingredient_name, description } = data;
    const [result] = await db.query(
      "UPDATE active_ingredients SET ingredient_name=?, description=? WHERE ingredient_id=?",
      [ingredient_name, description, id]
    );
    return result.affectedRows;
  },
  checkReferences: async (id) => {
    const [[miCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM medication_ingredients WHERE ingredient_id=?",
      [id]
    );
    const [[iamCount]] = await db.query(
      "SELECT COUNT(*) AS count FROM ingredient_allergy_map WHERE ingredient_id=?",
      [id]
    );
    return { miCount: miCount.count, iamCount: iamCount.count };
  },
  delete: async (id) => {
    await db.query("DELETE FROM active_ingredients WHERE ingredient_id=?", [id]);
  },
};

module.exports = Ingredient;