const env = require("dotenv").config();
const chai  = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const User = require("../models/User");
const Message = require("../models/Message");
// Module Test
chai.use(chaiHttp);
describe("PERFORM UNIT TESTING FOR BACKEND",()=>{
    
    before((done) => {
        console.log("\t Cleaning database before testing")
        mongoose.connect(env.parsed.MONGO_TEST_URI,{useNewUrlParser:true,useUnifiedTopology: true})
        .then()
        .catch(()=>console.log("Failed to Connect to Database"));
        
        User.deleteMany({}, (err) => { 
        });   
        
        Message.deleteMany({}, (err) => { 
            });
            done();  
    });

    after((done) => {
        console.log("\t Cleaning database after testing")
        mongoose.connect(env.parsed.MONGO_TEST_URI,{useNewUrlParser:true,useUnifiedTopology: true})
        .then()
        .catch(()=>console.log("Failed to Connect to Database"));
        
        User.deleteMany({}, (err) => { 
        });

        Message.deleteMany({}, (err) => { 
            }); 

            done();
    });

    require("./unauthorized").test
    require("./register").test;
    require("./auth").test;
    require('./message').test;
})


