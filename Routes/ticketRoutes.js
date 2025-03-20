const express = require('express');
const ticketController = require('../Controllers/ticketController');
const authMiddleware = require(`../Middleware/authMiddlewear`);
const authorizeRole = require('../Middleware/authMiddlewear');
const router = express.Router();

// retrive all tickets by username 
router.get('/allTickets', authMiddleware, ticketController.getTicketsByUsername);
//retrieve tickets by ticketsID
//router.get('/:id', ticketController.getTicket);
// adds a ticket to a database
router.post('/', authMiddleware,  ticketController.createTicket);
//delete a ticket from the database 
router.delete('/delete/:id', ticketController.deleteTicket);
//update a ticket by its ID 
router.put('/update/:id', authMiddleware, ticketController.updateTicket);
//retrieve all pending tickets
router.get("/status", authMiddleware, ticketController.getPendingTickets);
//retrieve all tickets by type
router.get("/type", authMiddleware, ticketController.getTypeTickets);
module.exports = router;