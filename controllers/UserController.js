const bcrypt =require("bcryptjs");
const User = require("../models/User");
const {check,validationResult} = require("express-validator");
const jwt=require("jsonwebtoken");
const env = require("dotenv").config();
const Schema = require("mongoose").Schema;

exports.register=(req,res)=>{
    try{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(422);
            res.json({errors:errors.array()});
        }else{
            bcrypt.genSalt(10,(err,salt)=>{
                if (err)
                    throw err;    
                let username=req.body.username;
                let password = req.body.password;
                bcrypt.hash(password,salt,(err,hash)=>{
                    let newUser = new User();
                    newUser.username=username;
                    newUser.password=hash;
                    newUser.save((err,user)=>{
                        if(err)
                            throw err;
                        res.json({
                            _id:user.id,
                            username:user.username,
                            created_at:user.created_at
                        }); 
                    }) 
                })
            })

        }
    }catch(err){
        res.status(500).json({error:"Internal Server Errors"})
    }
}

exports.auth=async (req,res)=>{
    User.findOne({username:req.body.username})
    .then(async (user)=>{
        if(!user){
            res.status(401).json({message:"Invalid grant authorization"})
        }else{
            let grant = await bcrypt.compareSync(req.body.password,user.password);
            if(grant){
                let access_token = jwt.sign({_id:user._id,username:user.username},env.parsed.TOKEN_SECRET,{expiresIn:60*60})
                let refresh_token = jwt.sign({_id:user._id,username:user.username},env.parsed.REFRESH_SECRET,{expiresIn:"3h"})
                res.json({
                    message:"Successfully Logen In",
                    access_token:access_token,
                    refresh_token:refresh_token
                })
            }else{
                res.status(401).json({message:"Invalid grant authorization"})
            }
        }
    })
    .catch(err=>{
        res.status(401).json({message:"Invalid grant authorization"})
    })
}

exports.refreshToken=async(req,res)=>{
    jwt.verify(req.body.refresh_token,env.parsed.REFRESH_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json(err);
        }else{
            user=decoded
            let access_token = jwt.sign({_id:user._id,username:user.username},env.parsed.TOKEN_SECRET,{expiresIn:3600})
            let refresh_token = jwt.sign({_id:user._id,username:user.username},env.parsed.REFRESH_SECRET,{expiresIn:60*60*12})
            res.json({
                message:"Successfully Refresh Token",
                access_token:access_token,
                refresh_token:refresh_token
            })
        }
    })
}

exports.validate=(method)=>{
    switch (method){
        case"register":{
            return [
                check('username').exists().notEmpty().bail().withMessage('Username is required'),
                check('username').custom(value=>{
                    
                    return User.findOne({username:value})
                    .then((user)=>{
                        if(user){
                            return Promise.reject("Username already in use");
                        }
                    })
                }).bail(),
                check('password').exists().notEmpty().bail().withMessage('Password is required'),
                check("password").custom((value,{req})=>{
                    if(value !== req.body.confirm){
                        return Promise.reject("Invalid password confirmation");
                    }else{
                        return true;
                    }
                }).bail()
            ]
        }
    }
}