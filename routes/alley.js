const router = require("express").Router();

// Middleware
const AuthMiddleware = require("../middleware/AuthMiddleware");

// Controller
const AlleyController=require("../controllers/AlleyController");

router.use(AuthMiddleware.guard);


router
.get("/",AlleyController.getAlley)
.post("/",AlleyController.validate("create_alley"),AlleyController.createAlley);

router
.post("/join",AlleyController.validate("join_alley"),AlleyController.joinAlley)
.delete("/join",AlleyController.validate("quit_alley"),AlleyController.quitAlley)
module.exports=router;
