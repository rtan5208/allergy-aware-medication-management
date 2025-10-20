const db = require("../config/db");

const IngredientAllergy = {
  listByIngredientId: async (ingredientId) => {
    const [rows] = await db.query(
      `SELECT iam.ingredient_id, 
      iam.allergy_id, a.allergy_name, a.description
       FROM ingredient_allergy_map iam
       JOIN allergies a ON iam.allergy_id = a.allergy_id
       WHERE iam.ingredient_id = ?`,
      [ingredientId]
    );
    return rows;
  },

  exists: async (ingredientId, allergyId) => {
    const [[row]] = await db.query(
      "SELECT COUNT(*) AS count FROM ingredient_allergy_map WHERE ingredient_id=? AND allergy_id=?",
      [ingredientId, allergyId]
    );
    return row.count > 0;
  },

  create: async (ingredientId, allergyId) => {
    const [result] = await db.query(
      "INSERT INTO ingredient_allergy_map (ingredient_id, allergy_id) VALUES (?, ?)",
      [ingredientId, allergyId]
    );
    return result.insertId;
  },

  remove: async (ingredientId, allergyId) => {
    const [result] = await db.query(
      "DELETE FROM ingredient_allergy_map WHERE ingredient_id=? AND allergy_id=?",
      [ingredientId, allergyId]
    );
    return result.affectedRows;
  },
};

module.exports = IngredientAllergy;