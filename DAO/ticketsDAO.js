const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({region: "us-east-2"});

const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "userTickets";

const ticketsDAO = {
    async getTicket(ticketID){
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { ticketID }
     });
     try {
        const data = await documentClient.send(command);
        return data.Item;
     }catch(err){
        console.error("Error getting user:", err)
        return null;
     }
},

};
module.exports = ticketsDAO;