const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const ticketRoutes = require('./Routes/ticketRoutes')
const authMiddleware = require('./Middleware/authMiddlewear');
const PORT = 3000;
const logger = require("./logger");
//const {authenticateToken} = require("./jwt");

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

/* app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
}) */

app.get("/protected", authMiddleware, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
});    

app.listen(PORT, () =>{
    console.info(`Server listening on http://localhost:${PORT}`);
});