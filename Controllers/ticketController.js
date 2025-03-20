const ticketService = require('../Services/ticketService');


function handleError(res, err, statusCode = 400) {
    res.status(statusCode).json({ error: err.message });
}

async function getTicket(req, res) {
    try {
        const ticket = await ticketService.getTicket(req.params.id);
        res.json(ticket);
    } catch (err) {
        handleError(res, err, 404);
    }
}

async function createTicket(req, res) {
    try {
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { ticketID, amount, description, status, type } = req.body;
        const username = req.user.username;
        const ticket = await ticketService.postTicket(ticketID, amount, description, status, username, type);
        res.status(201).json(ticket);
    } catch (err) {
        handleError(res, err);
    }
}

async function deleteTicket(req, res) {
    try {
        const deletedResult = await ticketService.deleteTicket(req.params.id);
        res.json(deletedResult);
    } catch (err) {
        handleError(res, err);
    }
}

async function updateTicket(req, res) {
    try {
        if (!req.user || req.user.role !== "Manager") {
            return res.status(403).json({ error: "Access denied. Only Managers can update ticket status." });
        }

        const { status } = req.body;
        const ticketID = req.params.id;
        const processedBy = req.user.username;

        if (!status) {
            return res.status(400).json({ error: "Status field is required for update." });
        }

        const updatedResult = await ticketService.updateTicket(ticketID, status, processedBy);
        res.json(updatedResult);
    } catch (err) {
        handleError(res, err);
    }
}

async function getTicketsByUsername(req, res) {
    try {
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const username = req.user.username;
        const tickets = await ticketService.getTicketsByUsername(username);
        res.json(tickets);
    } catch (err) {
        handleError(res, err, 404);
    }
}

async function getPendingTickets(req, res) {
    try {
        if (!req.user || req.user.role !== "Manager") {
            return res.status(403).json({ error: "Access denied. Only Managers can view pending tickets." });
        }
        const { status } = req.query;
        if (!status) {
            return res.status(400).json({ error: "status parameter is required" });
        }
        const tickets = await ticketService.getPendingTickets(status);
        res.json(tickets);
    } catch (err) {
        handleError(res, err, 404);
    }
}

async function getTypeTickets(req, res) {
    try {
        const { type } = req.query;
        if (!type) {
            return res.status(400).json({ error: "type parameter is required" });
        }
        const tickets = await ticketService.getTypeTickets(type);
        res.json(tickets);
    } catch (err) {
        handleError(res, err, 404);
    }
}

module.exports = {
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket,
    getTicketsByUsername,
    getPendingTickets,
    getTypeTickets
};
