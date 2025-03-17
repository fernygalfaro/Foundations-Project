const ticketDAO = require("../DAO/ticketsDAO");

const ticketService = {
    async getTicket(id) {
        const ticket = await ticketDAO.getTicket(id);
        if(!ticket) throw new Error("Ticket not found");
        return ticket;
    },
    async postTicket(ticketID, amount, description, status, username){
        if(!description && !amount){
            throw new Error("Missing information for ticket submission")
        }
        else if(!description){
            throw new Error("Missing description for ticket submission");
        }
        else if(!amount){
            throw new Error("Missing amount for ticket submission")
        }
        let num = Math.floor(Math.random() * 100);
        ticketID = num.toString();
        status = "Pending";
        return await ticketDAO.postTicket({ticketID, amount, description, status, username});
    },
    async deleteTicket(ticketID){
        return await ticketDAO.deleteTicket(ticketID);
    },
    async updateTicket(ticketID, status){
        if(!status == "Approved" || !status =="Declined"){
            throw new Error("Error: Status must be set to Approved or Denied"); 
        }
        return await ticketDAO.updateTicket(ticketID, status);
    },
    async getTicketsByUsername(username) {
        const tickets = await ticketDAO.getTicketsByUsername(username);
        if (!tickets || tickets.length === 0) {
            throw new Error("No tickets found for this username");
        }
        return tickets;
    }
    
}
module.exports = ticketService;