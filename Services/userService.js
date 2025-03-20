const userDao = require("../DAO/userDAO");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

function validateUser(user) {
    const usernameResult = user.username.length > 0;
    const passwordResult = user.password.length > 0;
    return (usernameResult && passwordResult);
}

async function getUser(id) {
    const user = await userDao.getUser(id);
    if (!user) throw new Error("User not found");
    return user;
}

async function validateLogin(username, password) {
    const user = await getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    } else {
        return null;
    }
}

async function getUserByUsername(username) {
    if (username) {
        const data = await userDao.getUserByUsername(username);
        if (data) {
            return data;
        } else {
            return null;
        }
    }
    return null;
}

async function createUser(user) {
    if (!validateUser(user)) {
        return { error: "Invalid user login" };
    }
    const existingUser = await getUserByUsername(user.username);
    if (existingUser) {
        return { error: "Username already exists" };
    }

    const saltRounds = 10;
    const password = await bcrypt.hash(user.password, saltRounds);
    const role = "Employee";
    const data = await userDao.putUser({
        username: user.username,
        password,
        role,
        userID: uuid.v4(),
    });
    return data;
}

async function deleteUser(id) {
    return await userDao.deleteUser(id);
}

async function updateUserPassword(userID, password) {
    if (!userID || !password) {
        throw new Error("User ID and new password are required");
    }
    return await userDao.updateUserPassword(userID, password);
}

async function changeUserRole(ticketID, role) {
    if (role === "Employee" || role === "Manager") {
        return await userDao.changeUserRole(ticketID, role);
    } else {
        throw new Error("Error: role must be updated to Employee or Manager");
    }
}

module.exports = {
    getUser,
    validateLogin,
    getUserByUsername,
    createUser,
    deleteUser,
    updateUserPassword,
    changeUserRole,
};
