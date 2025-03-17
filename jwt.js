const jwt = require("jsonwebtoken");
const logger = require("./logger");

const secretKey = "secret-key";

async function authenticateToken(req, res, next){

    // authorization: "Bearer tokenstring"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        res.status(403).json({message: "Forbidden Access"});
    }else{
        const user = await decodeJWT(token);
        req.user = user;
        next();
    }
}

async function decodeJWT(token){
    try{
        const user = await jwt.verify(token, secretKey);
        return user;
    }catch(err){
        logger.error(err);
    }
}

module.exports = {
    authenticateToken
}
