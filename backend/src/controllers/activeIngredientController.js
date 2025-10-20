const Ingredient = require("../models/activeIngredientModel");

exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.getAll();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.getById(req.params.ingredient_id);
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    res.json(ingredient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createIngredient = async (req, res) => {
  try {
    const id = await Ingredient.create(req.body);
    res.status(201).json({ ingredient_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIngredient = async (req, res) => {
  try {
    const affectedRows = await Ingredient.update(req.params.ingredient_id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: `Ingredient ${req.params.ingredient_id} not found.` });
    }
    res.json({ message: "Ingredient updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.getById(req.params.ingredient_id);
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found." });

    const refCheck = await Ingredient.checkReferences(req.params.ingredient_id);
    const reasons = [];
    if (refCheck.miCount > 0) reasons.push("associated medication ingredients");
    if (refCheck.iamCount > 0) reasons.push("associated allergy ingredients");

    if (reasons.length > 0) {
      const reasonMsg = reasons.join(" and ");
      return res.status(400).json({
        error: `Cannot delete ingredient: ${ingredient.ingredient_name} has ${reasonMsg}. Please remove these associations before deleting.`,
      });
    }

    await Ingredient.delete(req.params.ingredient_id);
    res.json({ message: `Ingredient ${ingredient.ingredient_name} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};