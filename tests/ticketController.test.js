const ticketController = require('../Controllers/ticketController');
const ticketService = require('../Services/ticketService');


jest.mock('../Services/ticketService');

describe('ticketController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { params: {}, body: {}, user: {}, query: {} }; 
        res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    });
    

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTicket', () => {
        it('should return a ticket by ID', async () => {
            const mockTicket = { id: '123', name: 'Test Ticket' };
            ticketService.getTicket.mockResolvedValue(mockTicket);

            req.params.id = '123';

            await ticketController.getTicket(req, res);

            expect(res.json).toHaveBeenCalledWith(mockTicket);
        });

        it('should handle errors gracefully', async () => {
            ticketService.getTicket.mockRejectedValue(new Error('Not found'));

            req.params.id = '123';

            await ticketController.getTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
        });
    });

    describe('createTicket', () => {
        it('should create a new ticket', async () => {
            const mockTicket = { id: '123', status: 'open' };
            ticketService.postTicket.mockResolvedValue(mockTicket);

            req.user.username = 'testUser';
            req.body = { ticketID: '123', amount: 50, description: 'Test ticket', status: 'open', type: 'bug' };

            await ticketController.createTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTicket);
        });

        it('should handle missing user authentication', async () => {
            req.user = null;
            req.body = { ticketID: '123', amount: 50, description: 'Test ticket', status: 'open', type: 'bug' };

            await ticketController.createTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
        });

        it('should handle errors gracefully', async () => {
            ticketService.postTicket.mockRejectedValue(new Error('Invalid data'));

            req.user.username = 'testUser';
            req.body = { ticketID: '123', amount: 50, description: 'Test ticket', status: 'open', type: 'bug' };

            await ticketController.createTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
        });
    });

    describe('deleteTicket', () => {
        it('should delete a ticket', async () => {
            const mockDeleteResult = { message: 'Deleted successfully' };
            ticketService.deleteTicket.mockResolvedValue(mockDeleteResult);

            req.params.id = '123';

            await ticketController.deleteTicket(req, res);

            expect(res.json).toHaveBeenCalledWith(mockDeleteResult);
        });

        it('should handle errors gracefully', async () => {
            ticketService.deleteTicket.mockRejectedValue(new Error('Ticket not found'));

            req.params.id = '123';

            await ticketController.deleteTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Ticket not found' });
        });
    });

    describe('updateTicket', () => {
        it('should update a ticket status if user is a manager', async () => {
            const mockUpdateResult = { id: '123', status: 'closed' };
            ticketService.updateTicket.mockResolvedValue(mockUpdateResult);

            req.user = { username: 'testUser', role: 'Manager' };
            req.body = { status: 'closed' };
            req.params.id = '123';

            await ticketController.updateTicket(req, res);

            expect(res.json).toHaveBeenCalledWith(mockUpdateResult);
        });

        it('should deny non-managers from updating tickets', async () => {
            req.user = { username: 'testUser', role: 'User' };
            req.body = { status: 'closed' };
            req.params.id = '123';

            await ticketController.updateTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Only Managers can update ticket status.' });
        });

        it('should handle errors gracefully', async () => {
            ticketService.updateTicket.mockRejectedValue(new Error('Update failed'));

            req.user = { username: 'testUser', role: 'Manager' };
            req.body = { status: 'closed' };
            req.params.id = '123';

            await ticketController.updateTicket(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
        });
    });

    describe('getTicketsByUsername', () => {
        it('should return tickets for a user', async () => {
            const mockTickets = [{ id: '123', status: 'open' }];
            ticketService.getTicketsByUsername.mockResolvedValue(mockTickets);

            req.user.username = 'testUser';

            await ticketController.getTicketsByUsername(req, res);

            expect(res.json).toHaveBeenCalledWith(mockTickets);
        });

        it('should handle errors gracefully', async () => {
            ticketService.getTicketsByUsername.mockRejectedValue(new Error('No tickets found'));

            req.user.username = 'testUser';

            await ticketController.getTicketsByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'No tickets found' });
        });
    });

    describe('getPendingTickets', () => {
        it('should return pending tickets based on status', async () => {
            const mockTickets = [{ id: '123', status: 'pending' }];
            ticketService.getPendingTickets.mockResolvedValue(mockTickets);

            req.query.status = 'pending';

            await ticketController.getPendingTickets(req, res);

            expect(res.json).toHaveBeenCalledWith(mockTickets);
        });

        it('should handle missing status parameter', async () => {
            req.query.status = undefined;

            await ticketController.getPendingTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'status parameter is required' });
        });

        it('should handle errors gracefully', async () => {
            ticketService.getPendingTickets.mockRejectedValue(new Error('Failed to fetch tickets'));

            req.query.status = 'pending';

            await ticketController.getPendingTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch tickets' });
        });
    });

    describe('getTypeTickets', () => {
        it('should return tickets based on type', async () => {
            const mockTickets = [{ id: '123', type: 'bug' }];
            ticketService.getTypeTickets.mockResolvedValue(mockTickets);

            req.query.type = 'bug';

            await ticketController.getTypeTickets(req, res);

            expect(res.json).toHaveBeenCalledWith(mockTickets);
        });

        it('should handle missing type parameter', async () => {
            req.query.type = undefined;

            await ticketController.getTypeTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'type parameter is required' });
        });

        it('should handle errors gracefully', async () => {
            ticketService.getTypeTickets.mockRejectedValue(new Error('Failed to fetch tickets'));

            req.query.type = 'bug';

            await ticketController.getTypeTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch tickets' });
        });
    });
});
