const db = require("../config/db");

const MedicationIngredient = {
  getByMedicationId: async (medicationId) => {
    const [rows] = await db.query(
      `SELECT 
         mi.medication_id,
         mi.ingredient_id,
         ai.ingredient_name,
         ai.description
       FROM medication_ingredients mi
       JOIN active_ingredients ai ON mi.ingredient_id = ai.ingredient_id
       WHERE mi.medication_id = ?`,
      [medicationId]
    );
    return rows;
  },

  exists: async (medicationId, ingredientId) => {
    const [[row]] = await db.query(
      "SELECT COUNT(*) AS count FROM medication_ingredients WHERE medication_id=? AND ingredient_id=?",
      [medicationId, ingredientId]
    );
    return row.count > 0;
  },

  create: async (medicationId, ingredientId) => {
    const [result] = await db.query(
      "INSERT INTO medication_ingredients (medication_id, ingredient_id) VALUES (?, ?)",
      [medicationId, ingredientId]
    );
    return result.insertId;
  },

  remove: async (medicationId, ingredientId) => {
    const [result] = await db.query(
      "DELETE FROM medication_ingredients WHERE medication_id=? AND ingredient_id=?",
      [medicationId, ingredientId]
    );
    return result.affectedRows;
  },
};

module.exports = MedicationIngredient;