const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const userDAO = require("../DAO/userDAO");  
const logger = require("../logger");

jest.mock("@aws-sdk/lib-dynamodb", () => {
    const originalModule = jest.requireActual("@aws-sdk/lib-dynamodb");
    return {
        ...originalModule,
        DynamoDBDocumentClient: {
            from: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        },
    };
});

describe('userDAO', () => {
    let documentClient;

    beforeEach(() => {
        documentClient = DynamoDBDocumentClient.from();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getUser should return a user when found', async () => {
        const userID = '123';
        const mockResponse = { Item: { userID, username: 'testuser' } };
        documentClient.send.mockResolvedValue(mockResponse);

        const result = await userDAO.getUser(userID);

        expect(result).toEqual(mockResponse.Item);
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
    

    test('getUserByUsername should return a user when found', async () => {
        const username = 'testuser';
        const mockResponse = { Items: [{ username, userID: '123' }] };
        documentClient.send.mockResolvedValue(mockResponse);

        const result = await userDAO.getUserByUsername(username);

        expect(result).toEqual(mockResponse.Items[0]);
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    test('getUserByUsername should return null if username not found', async () => {
        const username = 'testuser';
        documentClient.send.mockResolvedValue({ Items: [] });

        const result = await userDAO.getUserByUsername(username);

        expect(result).toBeNull();
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(ScanCommand));
    });

    test('putUser should return data on success', async () => {
        const user = { userID: '123', username: 'testuser' };
        const mockResponse = {};
        documentClient.send.mockResolvedValue(mockResponse);

        const result = await userDAO.putUser(user);

        expect(result).toEqual(mockResponse);
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    test('putUser should return null on error', async () => {
        const user = { userID: '123', username: 'testuser' };
        documentClient.send.mockRejectedValue(new Error('Put failed'));

        const result = await userDAO.putUser(user);

        expect(result).toBeNull();
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    test('deleteUser should return a message on success', async () => {
        const userID = '123';
        documentClient.send.mockResolvedValue({});

        const result = await userDAO.deleteUser(userID);

        expect(result).toEqual({ message: 'User deleted' });
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    test('deleteUser should return null on error', async () => {
        const userID = '123';
        documentClient.send.mockRejectedValue(new Error('Delete failed'));

        const result = await userDAO.deleteUser(userID);

        expect(result).toBeNull();
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
    });

    test('updateUserPassword should return updated attributes on success', async () => {
        const userID = '123';
        const password = 'newpassword';
        const mockResponse = { Attributes: { password: 'newpassword' } };
        documentClient.send.mockResolvedValue(mockResponse);

        const result = await userDAO.updateUserPassword(userID, password);

        expect(result).toEqual({ message: 'Password updated', updatedAttributes: mockResponse.Attributes });
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    test('updateUserPassword should return null on error', async () => {
        const userID = '123';
        const password = 'newpassword';
        documentClient.send.mockRejectedValue(new Error('Update failed'));

        const result = await userDAO.updateUserPassword(userID, password);

        expect(result).toBeNull();
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    test('changeUserRole should return updated attributes on success', async () => {
        const userID = '123';
        const role = 'admin';
        const mockResponse = { Attributes: { role: 'admin' } };
        documentClient.send.mockResolvedValue(mockResponse);

        const result = await userDAO.changeUserRole(userID, role);

        expect(result).toEqual({ message: 'User role updated', updatedAttributes: mockResponse.Attributes });
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });

    test('changeUserRole should return null on error', async () => {
        const userID = '123';
        const role = 'admin';
        documentClient.send.mockRejectedValue(new Error('Update failed'));

        const result = await userDAO.changeUserRole(userID, role);

        expect(result).toBeNull();
        expect(documentClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
    });
});
