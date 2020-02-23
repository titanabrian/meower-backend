const router = require("express").Router();
const passport = require("../config/passport");
const {check} = require("express-validator");

// Middleware
const AuthMiddleware = require("../middleware/AuthMiddleware");


router.use(AuthMiddleware.guard);

router.get("/ping",[
    check("username").isIn(["a","b"])
],(req,res)=>{
    res.json({message:"pong"})
}); 

module.exports=router;