const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const env=require('dotenv').config()
const cors = require('cors');
const indexRouter = require('./routes/index');
const apiRouter = require("./routes/api.js");
const alleyRouter = require("./routes/alley.js");
const app = express();

app.use(cors());
// Connection
if(process.env.NODE_ENV=="development"){
  app.use(logger('dev'));
  mongoose.connect(env.parsed.MONGO_DEV_URI,{useNewUrlParser:true,useUnifiedTopology: true})
  .then(()=>{
    console.log("Connected To Database")
    module.exports=runServer(app);
  })
  .catch((err)=>{
    console.log(err);
    console.log("Failed to Connect to Database Development")
  });
}else if(process.env.NODE_ENV=="testing"){
  mongoose.connect(env.parsed.MONGO_TEST_URI,{useNewUrlParser:true,useUnifiedTopology: true})
  .then(()=>{
    console.log("Connected To Database")
    module.exports=runServer(app);
  })
  .catch(()=>console.log("Failed to Connect to Database Testing"));
}else if(process.env.NODE_ENV=="production"){
  mongoose.connect(env.parsed.MONGO_PRODURI,{useNewUrlParser:true,useUnifiedTopology: true})
  .then(()=>{
    console.log("Connected To Database")
    module.exports=runServer(app);
  })
  .catch(()=>console.log("Failed to Connect to Database Production"));
}


function runServer(app){
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/', indexRouter);
  app.use('/api',apiRouter);
  app.use('/alley',alleyRouter);
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  
  var timeout = require('connect-timeout'); //express v4
  
  app.use(timeout("30s"));
  app.use(haltOnTimedout);
  
  function haltOnTimedout(req, res, next){
    if (!req.timedout) {next()};
  }
  
  const port =env.parsed.PORT||3000;
  
  app.listen(port);
  console.log("\x1b[32m", process.env.NODE_ENV+" Server Running on Port : "+port)
  return app;
}

// module.exports = app;
