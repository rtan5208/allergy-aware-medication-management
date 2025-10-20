const express = require('express');
const router = express.Router();
const patientAllergyController = require('../controllers/patientAllergyController');
const auth = require('../middleware/auth');

router.get('/:patient_id', auth, patientAllergyController.listPatientAllergies);
router.post('/:patient_id', auth, patientAllergyController.addPatientAllergy);
router.put('/:patient_allergy_id', auth, patientAllergyController.updatePatientAllergy);
router.delete('/:patient_allergy_id', auth, patientAllergyController.deletePatientAllergy);

module.exports = router;