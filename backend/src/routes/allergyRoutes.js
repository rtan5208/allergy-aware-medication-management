const express = require('express');
const router = express.Router();
const allergyController = require('../controllers/allergyController');
const auth = require('../middleware/auth');

router.get('/', auth, allergyController.getAllAllergies);
router.get('/:allergy_id', auth, allergyController.getAllergyById);
router.post('/', auth, allergyController.createAllergy);
router.put('/:allergy_id', auth, allergyController.updateAllergy);
router.delete('/:allergy_id', auth, allergyController.deleteAllergy);

module.exports = router;