const router = require("express").Router();
// const {check} = require("express-validator");

// Middleware
const AuthMiddleware = require("../middleware/AuthMiddleware");
const AlleyMiddleware = require("../middleware/AlleyMiddleware");

// Controller
const MessageController=require("../controllers/MessageController");


router.use(AuthMiddleware.guard);
router.use(AlleyMiddleware.guard);

router.get("/ping",(req,res)=>{
    res.json({message:"pong"})
});

router.post("/message",MessageController.validate("post_message"),MessageController.postMessage);

router.post("/like",MessageController.validate("post_like"),MessageController.postLike);

router.post("/dislike",MessageController.validate("post_like"),MessageController.postDislike);

router.get("/message",MessageController.getMessage);
module.exports=router;
