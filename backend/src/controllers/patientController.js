const Patient = require("../models/patientModel");

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.getAll();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.patient_id);
    if (!patient || patient.length === 0)
      return res
        .status(404)
        .json({ error: `Patient ${req.params.patient_id} not found` });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const id = await Patient.create(req.body);
    res
      .status(201)
      .json({
        message: `Patient ${req.body.name} created successfully.`,
        patient_id: id,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const affectedRows = await Patient.update(req.params.patient_id, req.body);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `Patient ${req.params.patient_id} not found.` });
    }
    res.json({ message: `Patient ${req.body.name} updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  const patientId = req.params.patient_id;
  try {
    const refCheck = await Patient.checkReferences(patientId);
    const patientName = refCheck.patient_name;
    const reasons = [];

    if (!refCheck) {
      return res
        .status(404)
        .json({ error: `Patient ${patientName} not found.` });
    }

    if (refCheck.order_id) reasons.push("associated orders");
    if (refCheck.patient_allergy_id) reasons.push("associated allergies");

    if (reasons.length > 0) {
      const reasonMsg = reasons.join(" and ");
      return res.status(400).json({
        error: `Cannot delete patient: ${patientName} has ${reasonMsg}. Please remove these associations before deleting.`,
      });
    }

    await Patient.delete(patientId);
    res.json({ message: `Patient ${patientName} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
