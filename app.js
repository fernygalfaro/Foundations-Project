const express = require('express');
const fs = require ('fs');
const {logger} = require('./logger');

const app = express();
const PORT = 3000;
const DATA_FILE = 'usernamePassword.json';
app.use(express.json());

let usernameAndPassword = [];

if (fs.existsSync(DATA_FILE)) {
    usernameAndPassword = JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveDataToFile(){
    fs.writeFileSync(DATA_FILE, JSON.stringify(usernameAndPassword, null, 2));
}
// GET - retrieves username and password
app.get('/logininfo', (req, res) => {
   res.json(usernameAndPassword);
});


app.post('/update', (req, res) => {
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
app.put('/replaceInfo/:username', (req, res) => {
    const {username} = req.params;
    const {password} = req.body;
    const index = usernameAndPassword.findIndex(item => item.username == username);
    if (index === -1) return res.status(404).json({message: "User login information not found"});
    usernameAndPassword[index] = { ...usernameAndPassword[index], username, password};
    saveDataToFile();
    logger.info(`User Login information updated: ${JSON.stringify(usernameAndPassword[index])}`);
    res.json(usernameAndPassword[index]);
});
app.delete('/deleteInfo/:username', (req, res) => {
    const {username} = req.params;
    const index = usernameAndPassword.findIndex(item => item.username == username);
    if (index === -1) return res.status(404).json({message: "User login information not found"});
    const deletedItem = usernameAndPassword.splice(index, 1);
    saveDataToFile();
    logger.info(`User Login deleted: ${JSON.stringify(deletedItem[0])}`);
    res.json(deletedItem[0]);

});
module.exports = app;
app.listen(PORT, () =>{
    console.info(`Server listening on http://localhost:${PORT}`);
});