const Ingredient = require("../models/activeIngredientModel");
const Allergy = require("../models/allergyModel");
const IngredientAllergy = require("../models/ingredientAllergyModel");

exports.listAllergies = async (req, res) => {
  try {
    const ingredientId = req.params.ingredient_id;
    const ing = await Ingredient.getById(ingredientId);
    if (!ing) return res.status(404).json({ error: "Ingredient not found." });

    const rows = await IngredientAllergy.listByIngredientId(ingredientId);
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "No allergies linked to this ingredient." });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.linkAllergy = async (req, res) => {
  try {
    const ingredientId = req.params.ingredient_id;
    const { allergy_id } = req.body;

    const ing = await Ingredient.getById(ingredientId);
    if (!ing) return res.status(404).json({ error: "Ingredient not found." });

    const al = await Allergy.getById(allergy_id);
    if (!al) return res.status(404).json({ error: "Allergy not found." });

    const already = await IngredientAllergy.exists(ingredientId, allergy_id);
    if (already) return res.status(400).json({ error: "Allergy already linked to ingredient." });

    const id = await IngredientAllergy.create(ingredientId, allergy_id);
    res.status(201).json({ ingredient_allergy_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlinkAllergy = async (req, res) => {
  try {
    const ingredientId = req.params.ingredient_id;
    const allergyId = req.params.allergy_id;

    const ing = await Ingredient.getById(ingredientId);
    if (!ing) return res.status(404).json({ error: "Ingredient not found." });

    const al = await Allergy.getById(allergyId);
    if (!al) return res.status(404).json({ error: "Allergy not found." });

    const affectedRows = await IngredientAllergy.remove(ingredientId, allergyId);
    if (affectedRows === 0) return res.status(404).json({ error: "Mapping not found." });

    res.json({ message: "Allergy unlinked from ingredient." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
