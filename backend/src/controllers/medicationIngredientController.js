const Medication = require("../models/medicationModel");
const Ingredient = require("../models/activeIngredientModel");
const MedicationIngredient = require("../models/medicationIngredientModel");

exports.listIngredients = async (req, res) => {
  try {
    const medId = req.params.medication_id;
    const med = await Medication.getById(medId);
    if (!med) return res.status(404).json({ error: "Medication not found." });

    const ingredients = await MedicationIngredient.getByMedicationId(medId);
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addIngredient = async (req, res) => {
  try {
    const medId = req.params.medication_id;
    const { ingredient_id } = req.body;

    const med = await Medication.getById(medId);
    if (!med) return res.status(404).json({ error: "Medication not found." });

    const ing = await Ingredient.getById(ingredient_id);
    if (!ing) return res.status(404).json({ error: "Ingredient not found." });

    const already = await MedicationIngredient.exists(medId, ingredient_id);
    if (already) return res.status(400).json({ error: "Ingredient already associated with medication." });

    const id = await MedicationIngredient.create(medId, ingredient_id);
    res.status(201).json({ medication_ingredient_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeIngredient = async (req, res) => {
  try {
    const medId = req.params.medication_id;
    const ingredientId = req.params.ingredient_id;

    const med = await Medication.getById(medId);
    if (!med) return res.status(404).json({ error: "Medication not found." });

    const ing = await Ingredient.getById(ingredientId);
    if (!ing) return res.status(404).json({ error: "Ingredient not found." });

    const affectedRows = await MedicationIngredient.remove(medId, ingredientId);
    if (affectedRows === 0) return res.status(404).json({ error: "Mapping not found." });

    res.json({ message: "Ingredient removed from medication." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};