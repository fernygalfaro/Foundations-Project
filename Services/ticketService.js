const ticketDAO = require("../DAO/ticketsDAO");

const ticketService = {
    async getTicket(id) {
        const ticket = await ticketDAO.getTicket(id);
        if(!ticket) throw new Error("Ticket not found");
        return ticket;
    }
}
module.exports = ticketService;