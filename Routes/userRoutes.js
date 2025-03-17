const express = require('express');
const userController = require('../Controllers/userController');
const {validatePostUser } = require('../Controllers/userController');
const router = express.Router();

// Define user-related routes
//router.get('/username/:username', userController.getUserByUsername);
// get user by ID
router.get('/:id', userController.getUser);
//add user to database
router.post('/register', validatePostUser, userController.createUser);
//delete user by ID
router.delete('/:id', userController.deleteUser);

router.put('/:id/updatePassword', userController.updateUserPassword);
//login user 
router.post('/login', userController.login);
module.exports = router;