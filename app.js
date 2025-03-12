/*const express = require('express');
const fs = require ('fs');
const {logger} = require('./logger');

const app = express();
const PORT = 3000;
const DATA_FILE = 'usernamePassword.json';
const TICKETS_DATA = "tickets.json"
app.use(express.json());

let usernameAndPassword = [];
let tickets = [];

//  checks if usernamePassword.json exists 
if (fs.existsSync(DATA_FILE)) {
    usernameAndPassword = JSON.parse(fs.readFileSync(DATA_FILE));
}
// saves data to usernamePassword.json
function saveDataToFile(){
    fs.writeFileSync(DATA_FILE, JSON.stringify(usernameAndPassword, null, 2));
}
// GET - retrieves username and password
app.get('/loginInfo', (req, res) => {
    if (tickets === undefined || tickets.length == 0) return res.status(404).json({message: "No available users"}); 
   res.json(usernameAndPassword);
});

// POST - Adds user Login information 
app.post('/addUser', (req, res) => {
    const {username, password} = req.body;
    if (!username || password == null){
        return res.status(400).json({message: 'Missing required fields for Username or Password'});
    }
    const newItem = {username, password };
    usernameAndPassword.push(newItem);
    saveDataToFile();
    logger.info(`User Login added: ${JSON.stringify(newItem)}`);
    res.status(201).json(newItem);
});
// PUT - Updates password for user
app.put('/updateInfo/:username', (req, res) => {
    const {username} = req.params;
    const {password} = req.body;
    const index = usernameAndPassword.findIndex(item => item.username == username);
    if (index === -1) return res.status(404).json({message: "User login information not found"});
    usernameAndPassword[index] = { ...usernameAndPassword[index], username, password};
    saveDataToFile();
    logger.info(`User Login information updated: ${JSON.stringify(usernameAndPassword[index])}`);
    res.json(usernameAndPassword[index]);
});
// DELETE - Removes user from data 
app.delete('/deleteUser/:username', (req, res) => {
    const {username} = req.params;
    const index = usernameAndPassword.findIndex(item => item.username == username);
    if (index === -1) return res.status(404).json({message: "User login information not found"});
    const deletedItem = usernameAndPassword.splice(index, 1);
    saveDataToFile();
    logger.info(`User Login deleted: ${JSON.stringify(deletedItem[0])}`);
    res.json(deletedItem[0]);

});
// methods for adding tickets 
//  checks if tickets.json exists 
if (fs.existsSync(TICKETS_DATA)) {
    tickets= JSON.parse(fs.readFileSync(TICKETS_DATA));
}
// saves data to tickets.json
function saveDataToFile(){
    fs.writeFileSync(TICKETS_DATA, JSON.stringify(tickets, null, 2));
}

// GET - Retrieve all available tickets 
app.get('/ticketInfo', (req, res) => {
    if (tickets === undefined || tickets.length == 0) return res.status(404).json({message: "There is no available tickets"});
    res.json(tickets);
 });
// POST - Adds ticktes to system
app.post('/addTicket', (req, res) => {
    const {amount, description, status = "Pending"} = req.body;
    if (!amount || description == null || status == null){
        return res.status(400).json({message: 'Missing required fields for tickets submission'});
    }
    let  ticketID = Math.floor(Math.random() * 1000);
    const newItem = {ticketID, amount, description, status};
    tickets.push(newItem);
    saveDataToFile();
    logger.info(`User Login added: ${JSON.stringify(newItem)}`);
    res.status(201).json(newItem);
});
// PUT - Updates ticket information
app.put('/updateTicket/:ticketID', (req, res) => {
    const {ticketID} = req.params;
    const {amount, description, status} = req.body;
    const index = tickets.findIndex(item => item.ticketID == ticketID);
    if (index === -1) return res.status(404).json({message: "Ticket was not found"});
    tickets[index] = { ...tickets[index], amount, description, status};
    saveDataToFile();
    logger.info(`Ticket updated:  ${JSON.stringify(tickets[index])}`);
    res.json(tickets[index]);
});
// DELETE - Removes tickets from list 
app.delete('/deleteTicket/:ticketID', (req, res) => {
    const {ticketID} = req.params;
    const index = tickets.findIndex(item => item.ticketID == ticketID);
    if (index === -1) return res.status(404).json({message: "Ticket was not found"});
    const deletedItem = tickets.splice(index, 1);
    saveDataToFile();
    logger.info(`Ticket deleted: ${JSON.stringify(deletedItem[0])}`);
    res.json(deletedItem[0]);

});

module.exports = app;
app.listen(PORT, () =>{
    console.info(`Server listening on http://localhost:${PORT}`);
});*/

const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const ticketRoutes = require('./Routes/ticketRoutes')
const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

app.listen(PORT, () =>{
    console.info(`Server listening on http://localhost:${PORT}`);
});