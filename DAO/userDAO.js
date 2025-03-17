const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({region: "us-east-2"});
const documentClient = DynamoDBDocumentClient.from(client);
const logger = require ("../logger");

const TABLE_NAME = "Users";

const userDAO = {
    async getUser(userID){
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { userID }
        });

        try {
            const data = await documentClient.send(command);
            return data.Item;
          } catch (err) {
            console.error("Error getting user:", err);
            return null;
        }
    },
    async getUserByUsername(username){
        const command = new ScanCommand({
            TableName : TABLE_NAME,
            FilterExpression: "#username = :username",
            ExpressionAttributeNames: {"#username": "username"},
            ExpressionAttributeValues: {":username":  username}
        });
        try{
            const data = await documentClient.send(command);
            logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
            return data.Items?.[0] || null;
        }catch(err){
            console.log("Could not find username", err);
            return null; 
        }
    },
    async putUser(user) {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: user,
        });
        try {
            const data =  await documentClient.send(command);
            logger.info(`PUT command for user completed ${JSON.stringify(data)}` );
            return data;
        }catch(err){
            logger.error(err);
            return null;
        }
    },
    async deleteUser(userID) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {userID},

        });
        try{
            await documentClient.send(command);
            return {message: "User deleted"};
        } catch (err){
            console.err("Error deleting user", err);
            return null;
        }
    },
    async updateUserPassword(userID, password) {
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
    
};
module.exports = userDAO;