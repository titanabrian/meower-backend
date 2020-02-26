const Message = require("../models/Message");
const {check,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId

module.exports.postMessage= async (req,res)=>{
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
                if(!ObjectId.isValid(parent)){
                    res.status(422).json({errors:[{msg:"Invalid parent as ObjectId"}]})
                }else{
                    let parentMessage=await Message.findOne({_id:parent});
                    if(parentMessage){
                        message.parent=parent;    
                        message.save((err,message)=>{
                            if(err){
                                res.status(500).json({message:"Internal Server Errors"});
                            }else{
                                Message.updateOne({_id:parentMessage._id},{$push:{"replies":message._id}},((err,updatedMessahe)=>{
                                    if(err){
                                        message.remove();
                                        res.status(500).json({message:"Internal Server Errors"});
                                    }else{
                                        res.json(message)
                                    }
                                }));
                            }
                        })
                    }else{
                        res.status(422).json({errors:[{msg:"You replies on unknown post, i can't allow that :("}]})
                    }
                }
            }else{
                message.save((err,message)=>{
                    if(err){
                        res.status(500).json({message:"Internal Server Errors"});
                    }else{
                        res.json(message);
                    }
                })
            }
            
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
            if(!ObjectId.isValid(id)){
                res.status(422).json({errors:[{msg:"Invalid id as ObjectId"}]})
            }else{
                Message.find({_id:id}).sort({created_at:-1}).exec((err,messages)=>{
                    if(err){
                        res.status(500).json({error:"Internal Server Errors"})
                    }else{
                        res.json(messages);
                    }
                })
            }
        }else if(parent){
            if(!ObjectId.isValid(parent)){
                res.status(422).json({errors:[{msg:"Invalid parent as ObjectId"}]})
            }else{
                Message.find({parent:parent}).sort({created_at:-1}).exec((err,messages)=>{
                    if(err){
                        res.status(500).json({error:"Internal Server Errors"})
                    }else{
                        res.json(messages);
                    }
                })
            }
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

module.exports.postLike=(req,res)=>{
    try{
        let id=req.body.message_id;
        let user = jwt.decode(req.headers.authorization.split(" ")[1]);

        if(!ObjectId.isValid(id)){
            res.status(422).json({errors:[{msg:"Invalid parent as ObjectId"}]})
        }else{
            Message.updateOne({_id:id},{$pull:{likes:user._id}},(err,updatedMessage)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    Message.updateOne({_id:id},{$push:{likes:user._id},$pull:{dislikes:user._id}},(err,message)=>{
                        if(err){
                            res.status(500).json({error:"Internal Server Errors"})
                        }else{
                            if(message.nModified>0){
                                res.json({message:"Success Like Message",success:1});
                            }else{
                                res.json({message:"Failed Like Message",success:0});
                            }
                        }
                    })
                }
            })
        }

    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

module.exports.postDislike=(req,res)=>{
    try{
        let id=req.body.message_id;
        let user = jwt.decode(req.headers.authorization.split(" ")[1]);
        if(!ObjectId.isValid(id)){
            res.status(422).json({errors:[{msg:"Invalid id as ObjectId"}]})
        }else{
            Message.updateOne({_id:id},{$pull:{dislikes:user._id}},(err,updatedMessage)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    Message.updateOne({_id:id},{$push:{dislikes:user._id},$pull:{likes:user._id}},(err,message)=>{
                        if(err){
                            res.status(500).json({error:"Internal Server Errors"})
                        }else{
                            if(message.nModified>0){
                                res.json({message:"Success Dislike Message",success:1});
                            }else{
                                res.json({message:"Failed Dislike Message",success:0});
                            }
                        }
                    })
                }
            })
        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

exports.validate=(method)=>{
    if (method=="post_message"){
        return [
            check('text').exists().trim().notEmpty().bail().withMessage('Your message is required'),
            check("parent").trim().escape().bail()
        ]
    }else if(method==="post_like"){
        return [
            check("message_id").exists().notEmpty().bail().withMessage('Your message ID is required')
        ]
    }
}
