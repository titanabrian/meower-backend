const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
var User = require("../models/User");

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,ser)=>{
        done(err,user);
    })
})

passport.use(new BearerStrategy({},(token,done)=>{
    User.findOne({_id:token},(err,user)=>{
        if(!user)
            done(null,false)
        return done(null,user);
    })
}))

module.exports=passport;