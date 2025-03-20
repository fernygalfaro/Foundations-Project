const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);
const logger = require("../logger");

const TABLE_NAME = "Users";

// Function to get user by ID
async function getUser(userID) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { userID },
    });

    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (err) {
        console.error("Error getting user:", err);
        return null;
    }
}

// Function to get user by username
async function getUserByUsername(username) {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ":username": username },
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify("Username: " + username)}`);
        return data.Items?.[0] || null;
    } catch (err) {
        console.log("Could not find username", err);
        return null;
    }
}

// Function to put a user into the database
async function putUser(user) {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`PUT command for user completed ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

// Function to delete a user by ID
async function deleteUser(userID) {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { userID },
    });

    try {
        await documentClient.send(command);
        return { message: "User deleted" };
    } catch (err) {
        console.error("Error deleting user", err);
        return null;
    }
}

// Function to update user password
async function updateUserPassword(userID, password) {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userID },
        UpdateExpression: "set #pwd = :password",
        ExpressionAttributeNames: {
            "#pwd": "password",
        },
        ExpressionAttributeValues: {
            ":password": password,
        },
        ReturnValues: "UPDATED_NEW",
    });

    try {
        const result = await documentClient.send(command);
        return { message: "Password updated", updatedAttributes: result.Attributes };
    } catch (err) {
        console.error("Error updating password", err);
        return null;
    }
}

// Function to change user role
async function changeUserRole(userID, role) {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userID },
        UpdateExpression: "set #role = :role",
        ExpressionAttributeNames: {
            "#role": "role",
        },
        ExpressionAttributeValues: {
            ":role": role,
        },
        ReturnValues: "UPDATED_NEW",
    });

    try {
        const result = await documentClient.send(command);
        return { message: "User role updated", updatedAttributes: result.Attributes };
    } catch (err) {
        console.error("Error updating user", err);
        return null;
    }
}

// Exporting all functions
module.exports = {
    getUser,
    getUserByUsername,
    putUser,
    deleteUser,
    updateUserPassword,
    changeUserRole,
};
