const Medication = require("../models/medicationModel");

exports.getAllMedications = async (req, res) => {
  try {
    const meds = await Medication.getAll();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMedicationById = async (req, res) => {
  try {
    const med = await Medication.getById(req.params.medication_id);
    if (!med) return res.status(404).json({ error: "Medication not found" });
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMedication = async (req, res) => {
  try {
    const id = await Medication.create(req.body);
    res.status(201).json({ medication_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const affectedRows = await Medication.update(req.params.medication_id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: `Medication ${req.params.medication_id} not found.` });
    }
    res.json({ message: "Medication updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const med = await Medication.getById(req.params.medication_id);
    if (!med) return res.status(404).json({ error: "Medication not found." });

    const refCheck = await Medication.checkReferences(req.params.medication_id);
    const reasons = [];
    if (refCheck.oiCount > 0) reasons.push("associated order items");
    if (refCheck.miCount > 0) reasons.push("associated medication ingredients");

    if (reasons.length > 0) {
      const reasonMsg = reasons.join(" and ");
      return res.status(400).json({
        error: `Cannot delete medication: ${med.medication_name} has ${reasonMsg}. Please remove these associations before deleting.`,
      });
    }

    await Medication.delete(req.params.medication_id);
    res.json({ message: `Medication ${med.medication_name} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};