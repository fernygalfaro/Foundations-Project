const userService = require('../Services/userService');
const jwt = require('jsonwebtoken');
const secretKey = "secret-key";

async function getUser(req, res) {
    try {
        const user = await userService.getUser(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function getUserByUsername(req, res) {
    try {
        const { username } = req.params;
        const user = await userService.getUserByUsername(username);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    const data = await userService.validateLogin(username, password);
    if (data) {
        const token = jwt.sign(
            { username: data.username, role: data.role },
            secretKey,
            { expiresIn: "10m" }
        );
        res.status(200).json({ message: "Success login", token });
    } else {
        res.status(401).json({ message: "Invalid credentials for login" });
    }
}

async function createUser(req, res) {
    const addedUser = await userService.createUser(req.body);
    if (addedUser && addedUser.error) {
        res.status(400).json({ message: addedUser.error });
    } else if (addedUser) {
        res.status(201).json({ message: `Created User ${JSON.stringify(req.body)}` });
    } else {
        res.status(400).json({ message: "User not created", data: req.body });
    }
}

async function deleteUser(req, res) {
    try {
        const deletedResult = await userService.deleteUser(req.params.id);
        res.json(deletedResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateUserPassword(req, res) {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: "New password is required" });
        }
        const updatedResult = await userService.updateUserPassword(req.params.id, password);
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateUserRole(req, res) {
    try {
        if (!req.user || req.user.role !== "Manager") {
            return res.status(403).json({ error: "Access denied. Only Managers can update user role." });
        }
        const { role } = req.body;
        const userID = req.params.id;
        if (!role) {
            return res.status(400).json({ error: "Role field is required for update" });
        }
        const updatedResult = await userService.changeUserRole(userID, role);
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

function validatePostUser(req, res, next) {
    const user = req.body;
    if (user.username && user.password) {
        next();
    } else {
        res.status(400).json({ message: "Invalid username or password", data: user });
    }
}

module.exports = {
    getUser,
    getUserByUsername,
    login,
    createUser,
    deleteUser,
    updateUserPassword,
    updateUserRole,
    validatePostUser
};
