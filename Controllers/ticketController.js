const ticketService = require('../Services/ticketService');


const ticketController = {
async getTicket(req, res){
      try{  
        const ticket = await ticketService.getTicket(req.params.id);
        res.json(ticket);
    } catch(err){
        res.status(404).json({ error: err.message });
    }
},
async createTicket(req, res){
        try{
            if (!req.user || !req.user.username) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const { ticketID, amount, description, status} = req.body;
            const username = req.user.username;
            const ticket = await ticketService.postTicket(ticketID, amount, description, status, username);
            res.status(201).json(ticket);
    }catch(err){
        res.status(400).json({error: err.message});
    }
},
async deleteTicket(req, res){
    try{
        const deletedResult = await ticketService.deleteTicket(req.params.id);
        res.json(deletedResult);
    }catch(err){
        res.stus(400).json({error: err.message})
    }
},
async updateTicket(req, res) {
    try {
        // Ensure the user is authenticated and has the Manager role
        if (!req.user || req.user.role !== "Manager") {
            return res.status(403).json({ error: "Access denied. Only Managers can update ticket status." });
        }

        const { status } = req.body;
        const ticketID = req.params.id;

        // Validate that status is provided
        if (!status) {
            return res.status(400).json({ error: "Status field is required for update." });
        }

        const updatedResult = await ticketService.updateTicket(ticketID, status);
        res.json(updatedResult);
    }catch(err){
        res.status(400).json({ error: err.message});
    }
},
async getTicketsByUsername(req, res) {
    try {
        if (!req.user || !req.user.username) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const username = req.user.username;
        const tickets = await ticketService.getTicketsByUsername(username);
        res.json(tickets);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

};
module.exports = ticketController;