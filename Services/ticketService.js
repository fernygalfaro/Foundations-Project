const ticketDAO = require("../DAO/ticketsDAO");

async function getTicket(id) {
    const ticket = await ticketDAO.getTicket(id);
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
}

async function postTicket(ticketID, amount, description, status, username, type) {
    if (!description && !amount) {
        throw new Error("Missing information for ticket submission");
    } else if (!description) {
        throw new Error("Missing description for ticket submission");
    } else if (!amount) {
        throw new Error("Missing amount for ticket submission");
    } else if (!type) {
        throw new Error("Missing reimbursement type");
    }
    let num = Math.floor(Math.random() * 100);
    ticketID = num.toString();
    status = "Pending";
    return await ticketDAO.postTicket({ ticketID, amount, description, status, username, type });
}

async function deleteTicket(ticketID) {
    return await ticketDAO.deleteTicket(ticketID);
}

async function updateTicket(ticketID, status, processedBy) {
    if (!(status === "Approved" || status === "Declined")) {
        throw new Error("Error: Status must be set to Approved or Denied");
    }
    return await ticketDAO.updateTicket(ticketID, status, processedBy);
}

async function getTicketsByUsername(username) {
    const tickets = await ticketDAO.getTicketsByUsername(username);
    if (!tickets || tickets.length === 0) {
        throw new Error("No tickets found for this username");
    }
    return tickets;
}

async function getPendingTickets(status) {
    if (!status) {
        throw new Error("Status is required");
    }
    return await ticketDAO.getPendingTickets(status);
}

async function getTypeTickets(type) {
    if (!type) {
        throw new Error("Type is required");
    }
    return await ticketDAO.getTypeTickets(type);
}

module.exports = {
    getTicket,
    postTicket,
    deleteTicket,
    updateTicket,
    getTicketsByUsername,
    getPendingTickets,
    getTypeTickets
};
