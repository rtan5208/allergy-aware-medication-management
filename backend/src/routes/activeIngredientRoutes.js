const express = require('express');
const router = express.Router();
const activeIngredientController = require('../controllers/activeIngredientController');
const ingredientAllergyController = require('../controllers/ingredientAllergyController');
const auth = require('../middleware/auth');

router.get('/', auth, activeIngredientController.getAllIngredients);
router.get('/:ingredient_id', auth, activeIngredientController.getIngredientById);
router.post('/', auth, activeIngredientController.createIngredient);
router.put('/:ingredient_id', auth, activeIngredientController.updateIngredient);
router.delete('/:ingredient_id', auth, activeIngredientController.deleteIngredient);


// Mounted under /api/ingredients 
router.get('/:ingredient_id/allergies', auth, ingredientAllergyController.listAllergies);
router.post('/:ingredient_id/allergies', auth, ingredientAllergyController.linkAllergy);
router.delete('/:ingredient_id/allergies/:allergy_id', auth, ingredientAllergyController.unlinkAllergy);

module.exports = router;