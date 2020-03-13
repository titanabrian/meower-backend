const jwt = require("jsonwebtoken");
const Alley = require("../models/Alley.js");
const ObjectId = require('mongoose').Types.ObjectId

exports.guard=async(req,res,next)=>{
    let user = req.headers.authorization
    user = jwt.decode(req.headers.authorization.split(" ")[1]);
    let alley_id=(req.body.alley) ? req.body.alley : req.param("alley_id");
    if(alley_id){
        if(!ObjectId.isValid(alley_id)){
            res.status(422).json({errors:[{msg:"Invalid alley_id as ObjectId"}]});
        }else{
            let alley=await Alley.findOne({_id:alley_id,members:{"$in":user._id}})
            if(!alley){
                res.status(401).json({msg:"You Have No Permission To Access This Alley"})
            }else{                
                next();
            }        
        }
    }else{
        next();
    }
        
}