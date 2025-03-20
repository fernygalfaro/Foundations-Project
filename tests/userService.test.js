const userDao = require("../DAO/userDAO");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const userService = require("../Services/userService");

jest.mock("../DAO/userDAO");
jest.mock("bcrypt"); // Mock bcrypt

describe("userService", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    describe("getUser", () => {
        it("should return a user when found", async () => {
            const mockUser = { userID: "1", username: "testuser", password: "password" };
            userDao.getUser.mockResolvedValue(mockUser);

            const user = await userService.getUser("1");
            expect(user).toEqual(mockUser);
        });

        it("should throw an error when user not found", async () => {
            userDao.getUser.mockResolvedValue(null);

            await expect(userService.getUser("1")).rejects.toThrow("User not found");
        });
    });

    describe("validateLogin", () => {
        it("should return a user when valid credentials are provided", async () => {
            const mockUser = { username: "testuser", password: "$2b$10$hashedpassword" };
            userDao.getUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Properly mock bcrypt.compare

            const user = await userService.validateLogin("testuser", "password");
            expect(user).toEqual(mockUser);
        });

        it("should return null when invalid credentials are provided", async () => {
            const mockUser = { username: "testuser", password: "$2b$10$hashedpassword" };
            userDao.getUserByUsername.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // Properly mock bcrypt.compare

            const result = await userService.validateLogin("testuser", "wrongpassword");
            expect(result).toBeNull();
        });
    });

    describe("createUser", () => {
        it("should return an error if user validation fails", async () => {
            const invalidUser = { username: "", password: "password" };
            const result = await userService.createUser(invalidUser);
            expect(result).toEqual({ error: "Invalid user login" });
        });

        it("should return an error if the username already exists", async () => {
            const existingUser = { username: "testuser", password: "password" };
            userDao.getUserByUsername.mockResolvedValue(existingUser);

            const result = await userService.createUser({ username: "testuser", password: "password" });
            expect(result).toEqual({ error: "Username already exists" });
        });

        it("should create a new user successfully", async () => {
            const newUser = { username: "newuser", password: "password" };
            userDao.getUserByUsername.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedPassword"); // Properly mock bcrypt.hash
            userDao.putUser.mockResolvedValue({ ...newUser, userID: uuid.v4(), role: "Employee" });

            const result = await userService.createUser(newUser);
            expect(result).toHaveProperty("userID");
            expect(result).toHaveProperty("role", "Employee");
        });
    });

    describe("deleteUser", () => {
        it("should delete a user", async () => {
            userDao.deleteUser.mockResolvedValue(true);

            const result = await userService.deleteUser("1");
            expect(result).toBe(true);
        });
    });

    describe("updateUserPassword", () => {
        it("should throw an error if user ID or password is missing", async () => {
            await expect(userService.updateUserPassword(null, "newpassword")).rejects.toThrow("User ID and new password are required");
            await expect(userService.updateUserPassword("1", null)).rejects.toThrow("User ID and new password are required");
        });

        it("should update the user password successfully", async () => {
            userDao.updateUserPassword.mockResolvedValue(true);

            const result = await userService.updateUserPassword("1", "newpassword");
            expect(result).toBe(true);
        });
    });

    describe("changeUserRole", () => {
        it("should change the user role successfully", async () => {
            const mockTicketID = "1";
            const role = "Manager";
            userDao.changeUserRole.mockResolvedValue(true);

            const result = await userService.changeUserRole(mockTicketID, role);
            expect(result).toBe(true);
        });

        it("should throw an error if the role is invalid", async () => {
            await expect(userService.changeUserRole("1", "InvalidRole")).rejects.toThrow("Error: role must be updated to Employee or Manager");
        });
    });
});