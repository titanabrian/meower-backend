const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

exports.guard=(req,res,next)=>{
    let authorization = req.headers.authorization.split(" ")[1];
    
    jwt.verify(authorization,env.parsed.TOKEN_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json(err)
        }else{
            next();
        }
    });    
}