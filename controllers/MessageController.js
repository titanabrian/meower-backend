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
            let alley_id=req.body.alley_id;
            message.user=user;
            message.text=text;
            message.alley=alley_id;
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
                                Message.updateOne({_id:parentMessage._id},{$push:{"replies":message._id}},((err,updatedMessage)=>{
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
        let alleyId=req.param("alley_id") ? ObjectId(req.param("alley_id")) : null;
        let popular=req.param("popular") ? req.param("popular") : null;
        let project={
            $project:{
                _id:1,
                replies:1,
                likes:1,
                dislikes:1,
                parent:1,
                alley:1,
                created_at:1,
                user:1,
                text:true,
                popular:{$size:"$likes"}
            }
        };
        let match={}
        let sort={}
        if(popular=="true"){
            sort={
                $sort:{
                    popular:-1
                }
            }
        }else{
            sort={
                $sort:{
                    created_at:-1
                }
            }
            
        }
        if(id){
            if(!ObjectId.isValid(id)){
                res.status(422).json({errors:[{msg:"Invalid id as ObjectId"}]})
            }else{
                match={
                    $match:{
                        _id:ObjectId(id),
                        alley:alleyId
                    }
                }
                Message.aggregate([match,project,sort]).exec((err,messages)=>{
                    if(err){
                        res.status(500).json({error:"Internal Server Errors"})
                    }else{
                        res.json(messages)
                    }
                })
                // Message.find({_id:id,alley:alleyId}).sort({created_at:-1}).exec((err,messages)=>{
                //     if(err){
                //         res.status(500).json({error:"Internal Server Errors"})
                //     }else{
                //         res.json(messages);
                //     }
                // })
            }
        }else if(parent){
            if(!ObjectId.isValid(parent)){
                res.status(422).json({errors:[{msg:"Invalid parent as ObjectId"}]})
            }else{
                match={
                    $match:{
                        parent:ObjectId(parent),
                        alley:alleyId
                    }
                }
                
                Message.aggregate([match,project,sort]).exec((err,messages)=>{
                    if(err){
                        res.status(500).json({error:"Internal Server Errors"})
                    }else{
                        res.json(messages)
                    }
                })
                // Message.find({parent:parent,alley:alleyId}).sort({created_at:-1}).exec((err,messages)=>{
                //     if(err){
                //         res.status(500).json({error:"Internal Server Errors"})
                //     }else{
                //         res.json(messages);
                //     }
                // })
            }
        }else{
            match={
                $match:{parent:null,
                alley:alleyId}
            }
            Message.aggregate([match,project,sort]).exec((err,messages)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    res.json(messages)
                }
            })

            // Message.find({parent:null,alley:alleyId}).sort({created_at:-1}).exec((err,messages)=>{
            //     if(err){
            //         res.status(500).json({error:"Internal Server Errors"})
            //     }else{
            //         res.json(messages);
            //     }
            // })
        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

module.exports.postLike=(req,res)=>{
    try{
        let id=req.body.message_id;
        let user = jwt.decode(req.headers.authorization.split(" ")[1]);
        let alley_id=req.body.alley_id;
        if(!ObjectId.isValid(id)){
            res.status(422).json({errors:[{msg:"Invalid parent as ObjectId"}]})
        }else{
            Message.updateOne({_id:id,alley:alley_id},{$pull:{likes:user._id}},(err,updatedMessage)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    Message.updateOne({_id:id,alley:alley_id},{$push:{likes:user._id},$pull:{dislikes:user._id}},(err,message)=>{
                        if(err){
                            res.status(500).json({error:"Internal Server Errors"})
                        }else{
                            if(message.nModified>0){
                                res.json({message:"Success Like Message",success:1});
                            }else{
                                res.json({message:"Failed Like Message. We cannot find message you want to dislike",success:0});
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
        let alley_id=req.body.alley_id;
        if(!ObjectId.isValid(id)){
            res.status(422).json({errors:[{msg:"Invalid id as ObjectId"}]})
        }else{
            Message.updateOne({_id:id,alley:alley_id},{$pull:{dislikes:user._id}},(err,updatedMessage)=>{
                if(err){
                    res.status(500).json({error:"Internal Server Errors"})
                }else{
                    Message.updateOne({_id:id,alley:alley_id},{$push:{dislikes:user._id},$pull:{likes:user._id}},(err,message)=>{
                        if(err){
                            res.status(500).json({error:"Internal Server Errors"})
                        }else{
                            if(message.nModified>0){
                                res.json({message:"Success Dislike Message",success:1});
                            }else{
                                res.json({message:"Failed Dislike Message, We cannot find message you want to dislike",success:0});
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
