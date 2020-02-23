var express = require('express');
var router = express.Router();

//Controller
const UserController = require("../controllers/UserController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',UserController.validate("register"),UserController.register);

router.post('/auth/token',UserController.auth);
router.post('/auth/refresh',UserController.refreshToken);

module.exports = router;
