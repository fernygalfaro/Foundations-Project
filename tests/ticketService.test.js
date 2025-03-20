const ticketService = require("../Services/ticketService");
const ticketDAO = require("../DAO/ticketsDAO");

// Mock ticketDAO methods
jest.mock("../DAO/ticketsDAO");

describe('ticketService', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('getTicket', () => {
        it('should return a ticket when found', async () => {
            const mockTicket = { id: 1, description: 'Test Ticket' };
            ticketDAO.getTicket.mockResolvedValue(mockTicket);

            const result = await ticketService.getTicket(1);
            expect(result).toEqual(mockTicket);
            expect(ticketDAO.getTicket).toHaveBeenCalledWith(1);
        });

        it('should throw an error if ticket is not found', async () => {
            ticketDAO.getTicket.mockResolvedValue(null);

            await expect(ticketService.getTicket(999)).rejects.toThrow('Ticket not found');
        });
    });

    describe('postTicket', () => {
        it('should create a ticket when valid inputs are provided', async () => {
            const mockTicket = { ticketID: '42', amount: 100, description: 'Test Ticket', status: 'Pending', username: 'testUser', type: 'Refund' };
            ticketDAO.postTicket.mockResolvedValue(mockTicket);

            const result = await ticketService.postTicket(null, 100, 'Test Ticket', '', 'testUser', 'Refund');
            expect(result).toEqual(mockTicket);
            expect(ticketDAO.postTicket).toHaveBeenCalledWith(expect.objectContaining({
                ticketID: expect.stringMatching(/^\d+$/), 
                amount: 100,
                description: 'Test Ticket',
                status: 'Pending',
                username: 'testUser',
                type: 'Refund'
            }));
        });

        it('should throw an error when missing information', async () => {
            await expect(ticketService.postTicket(null, null, '', '', '', '')).rejects.toThrow('Missing information for ticket submission');
        });

        it('should throw an error when missing description', async () => {
            await expect(ticketService.postTicket(null, 100, '', '', 'testUser', 'Refund')).rejects.toThrow('Missing description for ticket submission');
        });

        it('should throw an error when missing amount', async () => {
            await expect(ticketService.postTicket(null, null, 'Test Ticket', '', 'testUser', 'Refund')).rejects.toThrow('Missing amount for ticket submission');
        });

        it('should throw an error when missing reimbursement type', async () => {
            await expect(ticketService.postTicket(null, 100, 'Test Ticket', '', 'testUser', '')).rejects.toThrow('Missing reimbursement type');
        });
    });

    describe('deleteTicket', () => {
        it('should delete a ticket when valid ticketID is provided', async () => {
            ticketDAO.deleteTicket.mockResolvedValue(true);

            const result = await ticketService.deleteTicket(1);
            expect(result).toBe(true);
            expect(ticketDAO.deleteTicket).toHaveBeenCalledWith(1);
        });
    });

    describe('updateTicket', () => {
        it('should update ticket status when valid inputs are provided', async () => {
            const mockResult = { ticketID: '42', status: 'Approved' };
            ticketDAO.updateTicket.mockResolvedValue(mockResult);

            const result = await ticketService.updateTicket('42', 'Approved', 'admin');
            expect(result).toEqual(mockResult);
            expect(ticketDAO.updateTicket).toHaveBeenCalledWith('42', 'Approved', 'admin');
        });

        it('should throw an error when invalid status is provided', async () => {
            await expect(ticketService.updateTicket('42', 'InvalidStatus', 'admin')).rejects.toThrow('Error: Status must be set to Approved or Denied');
        });
    });

    describe('getTicketsByUsername', () => {
        it('should return tickets for the username', async () => {
            const mockTickets = [{ id: 1, description: 'Test Ticket' }];
            ticketDAO.getTicketsByUsername.mockResolvedValue(mockTickets);

            const result = await ticketService.getTicketsByUsername('testUser');
            expect(result).toEqual(mockTickets);
            expect(ticketDAO.getTicketsByUsername).toHaveBeenCalledWith('testUser');
        });

        it('should throw an error when no tickets are found', async () => {
            ticketDAO.getTicketsByUsername.mockResolvedValue([]);

            await expect(ticketService.getTicketsByUsername('testUser')).rejects.toThrow('No tickets found for this username');
        });
    });

    describe('getPendingTickets', () => {
        it('should return pending tickets when status is provided', async () => {
            const mockTickets = [{ id: 1, description: 'Pending Ticket' }];
            ticketDAO.getPendingTickets.mockResolvedValue(mockTickets);

            const result = await ticketService.getPendingTickets('Pending');
            expect(result).toEqual(mockTickets);
            expect(ticketDAO.getPendingTickets).toHaveBeenCalledWith('Pending');
        });

        it('should throw an error when no status is provided', async () => {
            await expect(ticketService.getPendingTickets()).rejects.toThrow('Status is required');
        });
    });

    describe('getTypeTickets', () => {
        it('should return tickets based on type', async () => {
            const mockTickets = [{ id: 1, description: 'Type Ticket' }];
            ticketDAO.getTypeTickets.mockResolvedValue(mockTickets);

            const result = await ticketService.getTypeTickets('Refund');
            expect(result).toEqual(mockTickets);
            expect(ticketDAO.getTypeTickets).toHaveBeenCalledWith('Refund');
        });

        it('should throw an error when no type is provided', async () => {
            await expect(ticketService.getTypeTickets()).rejects.toThrow('Type is required');
        });
    });
});
