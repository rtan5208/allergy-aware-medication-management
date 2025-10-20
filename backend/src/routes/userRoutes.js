const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/:user_id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);
router.put('/:user_id', auth, userController.updateUser);

// Soft delete (deactivate)
router.patch('/:user_id/deactivate', auth, userController.deactivateUser);

// Hard delete (permanent)
router.delete('/:user_id', auth, userController.deleteUser);

module.exports = router;