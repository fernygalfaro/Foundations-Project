const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

// Define user-related routes
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/password', userController.updateUserPassword),
module.exports = router;