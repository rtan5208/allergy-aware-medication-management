const PatientAllergy = require("../models/patientAllergyModel");

exports.listPatientAllergies = async (req, res) => {
  try {
    const allergies = await PatientAllergy.getByPatientId(req.params.patient_id);
    if (!allergies || allergies.length === 0)
      return res
        .status(404)
        .json({ error: `No allergies found for patient ${req.params.patient_id}` });
    res.json(allergies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPatientAllergy = async (req, res) => {
  try {
    const id = await PatientAllergy.create(req.params.patient_id, req.body);
    res.status(201).json({ patient_allergy_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatientAllergy = async (req, res) => {
  try {
    // Reference check
    const existing = await PatientAllergy.getById(req.params.patient_allergy_id);
    if (!existing || existing.length === 0) {
      return res
        .status(404)
        .json({ error: "Patient allergy record not found." });
    }
    const affectedRows = await PatientAllergy.update(
      req.params.patient_allergy_id,
      req.body
    );
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Update failed. Record not found." });
    }
    res.json({ message: "Patient allergy updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePatientAllergy = async (req, res) => {
  try {
    // Reference check
    const existing = await PatientAllergy.getById(req.params.patient_allergy_id);
    if (!existing || existing.length === 0) {
      return res
        .status(404)
        .json({ error: "Patient allergy record not found." });
    }
    const affectedRows = await PatientAllergy.delete(req.params.patient_allergy_id);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Delete failed. Record not found." });
    }
    res.json({ message: "Patient allergy removed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
