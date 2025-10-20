const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');

router.get('/', auth, patientController.getAllPatients);
router.get('/:patient_id', auth, patientController.getPatientById);
router.post('/', auth, patientController.createPatient);
router.put('/:patient_id', auth, patientController.updatePatient);
router.delete('/:patient_id', auth, patientController.deletePatient);

module.exports = router;