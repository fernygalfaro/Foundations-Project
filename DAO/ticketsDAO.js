const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand} = require("@aws-sdk/lib-dynamodb");
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
   async getTicketsByUsername(username) {
      const command = new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "#username = :username",
          ExpressionAttributeNames: {
              "#username": "username",
          },
          ExpressionAttributeValues: {
              ":username": username,
          },
      });
  
      try {
          const data = await documentClient.send(command);
          return data.Items;
      } catch (err) {
          console.error("Error fetching tickets by username:", err);
          return null;
      }
  },
   async postTicket(ticket){
      const command = new PutCommand({
         TableName: TABLE_NAME,
         Item: ticket,
      });
      console.log("Ticket to be added:", ticket);
      try{
        
         await documentClient.send(command);
         return {message: "Ticket added"};
      }catch(err){
         console.error("Error adding ticket", err);
         return null;
      }
   },
   async deleteTicket(ticketID){
      const command = new DeleteCommand({
         TableName: TABLE_NAME,
         Key: {ticketID},
      });
      try{
         await documentClient.send(command);
         return {message: "Ticket was deleted"};
      }catch(err){
         console.err("Error deleting ticket");
         return null;
      }
   },
   async updateTicket(ticketID, status){
      const command = new UpdateCommand({
         TableName: TABLE_NAME,
         Key: {ticketID},
         UpdateExpression: "set #sts = :status",
         ExpressionAttributeNames: {
            "#sts" : "status"
         },
         ExpressionAttributeValues: {
            ":status" : status
         },
         returnValues: "UPDATED_NEW",
      });
      try {
         const result = await documentClient.send(command);
         return { message: "Ticket updated", updatedAttributes: result.Attributes};
      }catch(err){
         console.error("Error updating ticket", err);
         return null;
      }
   }

};
module.exports = ticketsDAO;