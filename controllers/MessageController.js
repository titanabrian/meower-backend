const Message = require("../models/Message");
const {check,validationResult} = require("express-validator/check");
const jwt = require("jsonwebtoken");

module.exports.postMessage=(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(422);
            res.json({errors:errors.array()});
        }else{
            let text = req.body.text;
            let parent = req.body.parent;
            let message = new Message();
            let user = jwt.decode(req.headers.authorization.split(" ")[1]);
            message.user=user;
            message.text=text;
            if(parent){
                message.parent=parent;
            }
            message.save((err,message)=>{
                if(err){
                    res.status(500).json({message:"Internal Server Errors"});
                }else{
                    res.json(message);
                }
            })
        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

module.exports.getMessage=(req,res)=>{
    try{
        let parent=req.param("parent");
        let id=req.param("id");
        if(id){
            Message.find({_id:id}).sort({created_at:-1}).exec((err,messages)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    res.json(messages);
                }
            })
        }else if(parent){
            Message.find({parent:parent}).sort({created_at:-1}).exec((err,messages)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    res.json(messages);
                }
            })
        }else{
            Message.find({parent:null}).sort({created_at:-1}).exec((err,messages)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    res.json(messages);
                }
            })
        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

exports.validate=(method)=>{
    switch (method){
        case"post_message":{
            return [
                check('text').exists().notEmpty().trim().escape().bail().withMessage('Your message is required'),
                check('parent').trim().escape().bail()            ]
        }
    }
}
