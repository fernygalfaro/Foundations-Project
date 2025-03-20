const userController = require('../Controllers/userController');
const userService = require('../Services/userService');
const jwt = require('jsonwebtoken');

jest.mock('../Services/userService');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let res, req;

    beforeEach(() => {
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    test('getUser - should return user data', async () => {
        req = { params: { id: '123' } };
        userService.getUser.mockResolvedValue({ id: '123', username: 'testuser' });
        await userController.getUser(req, res);
        expect(res.json).toHaveBeenCalledWith({ id: '123', username: 'testuser' });
    });

    test('getUser - should handle errors', async () => {
        req = { params: { id: '123' } };
        userService.getUser.mockRejectedValue(new Error('User not found'));
        await userController.getUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('login - should return token on valid credentials', async () => {
        req = { body: { username: 'testuser', password: 'password' } };
        userService.validateLogin.mockResolvedValue({ username: 'testuser', role: 'User' });
        jwt.sign.mockReturnValue('mockToken');
        await userController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Success login", token: 'mockToken' });
    });

    test('login - should return 401 on invalid credentials', async () => {
        req = { body: { username: 'testuser', password: 'wrongpassword' } };
        userService.validateLogin.mockResolvedValue(null);
        await userController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials for login" });
    });

    test('createUser - should return 201 on success', async () => {
        req = { body: { username: 'newuser', password: 'password' } };
        userService.createUser.mockResolvedValue({ id: '456' });
        await userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: `Created User ${JSON.stringify(req.body)}` });
    });

    test('deleteUser - should return success response', async () => {
        req = { params: { id: '123' } };
        userService.deleteUser.mockResolvedValue({ success: true });
        await userController.deleteUser(req, res);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('updateUserPassword - should return success response', async () => {
        req = { params: { id: '123' }, body: { password: 'newpassword' } };
        userService.updateUserPassword.mockResolvedValue({ success: true });
        await userController.updateUserPassword(req, res);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    test('updateUserRole - should return error if not a manager', async () => {
        req = { user: { role: 'User' }, params: { id: '123' }, body: { role: 'Admin' } };
        await userController.updateUserRole(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Access denied. Only Managers can update user role." });
    });
});
