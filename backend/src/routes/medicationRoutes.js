const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const auth = require('../middleware/auth');

router.get('/', auth, medicationController.getAllMedications);
router.get('/:medication_id', auth, medicationController.getMedicationById);
router.post('/', auth, medicationController.createMedication);
router.put('/:medication_id', auth, medicationController.updateMedication);
router.delete('/:medication_id', auth, medicationController.deleteMedication);

module.exports = router;