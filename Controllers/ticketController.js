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

};
module.exports = ticketController;