const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: "us-east-2" });
const documentClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "userTickets";

async function getTicket(ticketID) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { ticketID }
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (err) {
        console.error("Error getting user:", err);
        return null;
    }
}

async function getTicketsByUsername(username) {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ":username": username }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (err) {
        console.error("Error fetching tickets by username:", err);
        return null;
    }
}

async function getPendingTickets(status) {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#sts = :status",
        ExpressionAttributeNames: { "#sts": "status" },
        ExpressionAttributeValues: { ":status": status }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items || [];
    } catch (err) {
        console.error("Error fetching ticket by status", err);
        return [];
    }
}

async function getTypeTickets(type) {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#typ = :type",
        ExpressionAttributeNames: { "#typ": "type" },
        ExpressionAttributeValues: { ":type": type }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items || [];
    } catch (err) {
        console.error("Error fetching ticket by type", err);
        return [];
    }
}

async function postTicket(ticket) {
    const command = new PutCommand({ TableName: TABLE_NAME, Item: ticket });
    console.log("Ticket to be added:", ticket);
    try {
        await documentClient.send(command);
        return { message: "Ticket added" };
    } catch (err) {
        console.error("Error adding ticket", err);
        return null;
    }
}

async function deleteTicket(ticketID) {
    const command = new DeleteCommand({ TableName: TABLE_NAME, Key: { ticketID } });
    try {
        await documentClient.send(command);
        return { message: "Ticket was deleted" };
    } catch (err) {
        console.error("Error deleting ticket", err);
        return null;
    }
}

async function updateTicket(ticketID, status, processedBy) {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { ticketID },
        UpdateExpression: "set #sts = :status, #processedBy = :processedBy",
        ExpressionAttributeNames: { "#sts": "status", "#processedBy": "processedBy" },
        ExpressionAttributeValues: { ":status": status, ":processedBy": processedBy },
        ReturnValues: "UPDATED_NEW",
    });
    try {
        const result = await documentClient.send(command);
        return { message: "Ticket updated", updatedAttributes: result.Attributes };
    } catch (err) {
        console.error("Error updating ticket", err);
        return null;
    }
}

module.exports = {
    getTicket,
    getTicketsByUsername,
    getPendingTickets,
    getTypeTickets,
    postTicket,
    deleteTicket,
    updateTicket
};
