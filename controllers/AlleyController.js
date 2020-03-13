const Alley = require("../models/Alley");
const User = require("../models/User");
const {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId

module.exports.createAlley=async(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(422);
            res.json({errors:errors.array()});
        }else{
            let name=req.body.name
            let admin = jwt.decode(req.headers.authorization.split(" ")[1]);
            let alley = new Alley();
            alley.name=name;
            alley.administrators=[admin._id];
            alley.members=[admin._id];
            alley.save((err,alley)=>{
                if(err){
                    res.status(500).json({message:"Internal Servers Errors"})
                }else{
                    res.json(alley);
                }
            })
        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

module.exports.getAlley=async(req,res)=>{
    try{
        let alleyId=req.param("id");
        let user = jwt.decode(req.headers.authorization.split(" ")[1]);
        let scope=req.param("scope");
        if(alleyId){
            if(!ObjectId.isValid(alleyId)){
                res.status(422).json({errors:[{msg:"Invalid id as ObjectId"}]})
            }else{
                Alley.find({_id:alleyId})
                .populate("members","username")
                .populate("administrators","username")
                .exec((err,alleys)=>{
                    if(err){
                        res.status(500).json({message:"Internal Server Errors"});
                    }else{
                        res.json(alleys);
                    }
                })
            }
        }else{
            if(scope&&scope!=="global"){
                if(scope==="join"){
                    Alley.find({members:{"$in":user._id}})
                    .populate("members","username")
                    .populate("administrators","username")
                    .exec((err,alleys)=>{
                        if(err){
                            res.status(500).json({message:"Internal Server Errors"});
                        }else{
                            res.json(alleys);
                        }
                    })
                }else{
                    res.status(400).json({msg:"Bad request parameters"})
                }
            }else{
                Alley.find({})
                .populate("members","username")
                .populate("administrators","username")
                .exec((err,alleys)=>{
                    if(err){
                        res.status(500).json({message:"Internal Server Errors"});
                    }else{
                        res.json(alleys);
                    }
                })
            }
        }
    }catch (err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

module.exports.joinAlley=(req,res)=>{
    try{
        const errors=validationResult(req);
        
        if(!errors.isEmpty()){
            res.status(422);
            res.json({errors:errors.array()});
        }else{
            let alleyId=req.body.alley_id
            let user = jwt.decode(req.headers.authorization.split(" ")[1]);
            Alley.updateOne({_id:alleyId},{$push:{members:user._id}},(err,updatedAlley)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    if(updatedAlley.nModified>0){
                        res.json({message:"Success Join Alley",success:1});
                    }else{
                        res.json({message:"Wops We Cannot Find The Alley you want to join",success:0});
                    }
                }
            })
        }
    }catch (err){
        res.status(500).json({message:"Internal Server Errors"});
    }
}

module.exports.quitAlley=(req,res)=>{
    try{
        const errors=validationResult(req);
        
        if(!errors.isEmpty()){
            res.status(422);
            res.json({errors:errors.array()});
        }else{
            let alleyId=req.body.alley_id
            let user = jwt.decode(req.headers.authorization.split(" ")[1]);
            Alley.updateOne({_id:alleyId,members:{"$in":user._id}},{$pull:{members:user._id}},(err,updatedAlley)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    if(updatedAlley.nModified>0){
                        res.json({message:"Success Quit Alley",success:1});
                    }else{
                        res.json({message:"Wops We Cannot Find The Alley you want to Quit",success:0});
                    }
                }
            })
        }
    }catch (err){
        res.status(500).json({message:"Internal Server Errors"});
    }
}

exports.validate=(method)=>{
    if(method=="create_alley"){
        return [
            check('name').exists().trim().notEmpty().bail().withMessage("Name is required"),
            check("name").custom((value,{req})=>{
                let user = jwt.decode(req.headers.authorization.split(" ")[1]);
                return Alley.findOne({name:value,administrators:{"$in":user._id}})
                .then((alley)=>{
                    if(alley){
                        return Promise.reject("Alley Name already in use")
                    }
                })
            }).bail()
        ]
    }else if(method=="join_alley"){
        return[
            check("alley_id").notEmpty().bail().withMessage("Alley id is required"),
            check("alley_id").custom(async (value,{req,res})=>{
                if(!ObjectId.isValid(value)){
                    return Promise.reject("Invalid alley_id as ObjectId")
                }else{
                    let user = jwt.decode(req.headers.authorization.split(" ")[1]);
                    let alley=await Alley.findOne({_id:value,members:{"$in":user._id}})
                    if(alley){
                        return Promise.reject("You already joined to this alley")
                    }
                }
            }).bail()
        ]
    }else if(method=="quit_alley"){
        return[
            check("alley_id").notEmpty().bail().withMessage("Alley id is required"),
            check("alley_id").custom(async (value,{req,res})=>{
                if(!ObjectId.isValid(value)){
                    return Promise.reject("Invalid alley_id as ObjectId")
                }
            }).bail()
        ]
    }
}