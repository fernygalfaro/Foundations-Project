const express = require('express');
const userController = require('../Controllers/ticketController');

const router = express.Router();


router.get('/:id', userController.getTicket);

module.exports = router;