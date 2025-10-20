const Allergy = require("../models/allergyModel");

exports.getAllAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.getAll();
    res.json(allergies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllergyById = async (req, res) => {
  try {
    const allergy = await Allergy.getById(req.params.allergy_id);
    if (!allergy || allergy.length === 0) return res.status(404).json({ error: "Allergy not found" });
    res.json(allergy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAllergy = async (req, res) => {
  try {
    const id = await Allergy.create(req.body);
    res.status(201).json({ allergy_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAllergy = async (req, res) => {
  try {
    const affectedRows = await Allergy.update(req.params.allergy_id, req.body);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `Allergy ${req.params.allergy_id} not found.` });
    }
    res.json({ message: `Allergy updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.getById(req.params.allergy_id);
    if (!allergy) {
      return res.status(404).json({ error: "Allergy not found." });
    }

    const refCheck = await Allergy.checkReferences(req.params.allergy_id);
    const reasons = [];
    if (refCheck.paCount > 0) reasons.push("associated patients");
    if (refCheck.iamCount > 0) reasons.push("associated ingredients");

    if (reasons.length > 0) {
      const reasonMsg = reasons.join(" and ");
      return res.status(400).json({
        error: `Cannot delete allergy: ${allergy.allergy_name} has ${reasonMsg}. Please remove these associations before deleting.`,
      });
    }


    await Allergy.delete(req.params.allergy_id);
    res.json({
      message: `Allergy ${allergy.allergy_name} deleted successfully.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
