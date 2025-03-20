jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');


const {
    getTicket,
    getTicketsByUsername,
    getPendingTickets,
    getTypeTickets,
    postTicket,
    deleteTicket,
    updateTicket
} = require('../DAO/ticketsDAO');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

jest.mock('@aws-sdk/lib-dynamodb', () => ({
    DynamoDBDocumentClient: {
        from: jest.fn().mockReturnValue({
            send: jest.fn()
        })
    },
    GetCommand: jest.fn(),
    PutCommand: jest.fn(),
    DeleteCommand: jest.fn(),
    UpdateCommand: jest.fn(),
    ScanCommand: jest.fn()
}));

describe('ticketsDAO', () => {
    let mockSend;

    beforeEach(() => {
        mockSend = DynamoDBDocumentClient.from().send;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getTicket should return ticket data', async () => {
        const mockTicket = { ticketID: "2", username: "Revature", amount: 100, status: "Approved", description: "correct test" };
        mockSend.mockResolvedValueOnce({ Item: mockTicket });

        const result = await getTicket("2");

        expect(result).toEqual(mockTicket);
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    test('getTicketsByUsername should return a list of tickets', async () => {
        const mockTickets = [
            { ticketID: "1", username: "Revature", amount: 100, status: "Approved", description: "test 1" },
            { ticketID: "2", username: "Revature", amount: 200, status: "Pending", description: "test 2" }
        ];
        mockSend.mockResolvedValueOnce({ Items: mockTickets });

        const result = await getTicketsByUsername("Revature");

        expect(result).toEqual(mockTickets);
        expect(mockSend).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    test('getPendingTickets should return an empty array if no tickets found', async () => {
        mockSend.mockResolvedValueOnce({ Items: [] });

        const result = await getPendingTickets("Pending");

        expect(result).toEqual([]);
        expect(mockSend).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    test('getTypeTickets should return tickets of specific type', async () => {
        const mockTickets = [
            { ticketID: "1", type: "Bug", amount: 100, status: "Approved", description: "Bug ticket" }
        ];
        mockSend.mockResolvedValueOnce({ Items: mockTickets });

        const result = await getTypeTickets("Bug");

        expect(result).toEqual(mockTickets);
        expect(mockSend).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    test('postTicket should add a new ticket', async () => {
        const mockTicket = { ticketID: "3", username: "Revature", amount: 100, status: "Pending", description: "New ticket" };
        mockSend.mockResolvedValueOnce({});

        const result = await postTicket(mockTicket);

        expect(result).toEqual({ message: "Ticket added" });
        expect(mockSend).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    test('deleteTicket should delete a ticket', async () => {
        mockSend.mockResolvedValueOnce({});

        const result = await deleteTicket("3");

        expect(result).toEqual({ message: "Ticket was deleted" });
        expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    test('updateTicket should update a ticket status', async () => {
        const mockUpdatedTicket = { message: "Ticket updated", updatedAttributes: { status: "Approved" } };
        mockSend.mockResolvedValueOnce({ Attributes: { status: "Approved" } });

        const result = await updateTicket("2", "Approved", "Admin");

        expect(result).toEqual(mockUpdatedTicket);
        expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });
});
