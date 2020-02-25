const mongoose = require("mongoose");
const User = require("./models/User");
const Message = require("./models/Message");
const env = require("dotenv").config();

console.log("RESET DEVELOPMENT DATABASES");
mongoose.connect(env.parsed.MONGO_DEV_URI,{useNewUrlParser:true,useUnifiedTopology: true})
.then()
.catch(()=>console.log("Failed to Connect to Database"));

User.deleteMany({}, (err) => { });   

Message.deleteMany({}, (err) => { });
console.log("FINISH RESET DEVELOPMENT")

process.exit();
