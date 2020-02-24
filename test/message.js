const env = require("dotenv").config();
const chai  = require("chai");
const chaiHttp = require("chai-http");
const server = env.parsed.BASE_URL;

chai.use(chaiHttp);

module.exports.test=describe("Message Endpoint Test || AFTER AUTHENTICATION PERFORMED",()=>{

    let access_token="";

    describe("/POST auth/token do authentication before send messages",()=>{
        it("it should return valid credential",(done)=>{
            let payload={
                username:"titanabrian",
                password:"thispassword"
            }
            chai.request(server)
            .post("auth/token")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.access_token).to.be.a("string");
                chai.expect(res.body.refresh_token).to.be.a("string");
                access_token=res.body.access_token;
                done();
            })
        })
    })

    describe("/POST api/message without payload",()=>{
        it("it should return validation error status 422 amd body have to be an object",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/message with empty string payload",()=>{
        let payload ={
            text:""
        }
        it("it should return validation error status 422 and body have to be an object",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    let parent_id="";
    describe("/POST api/message valid payload",()=>{
        let payload ={
            text:"Hi here im testing for message"
        }
        it("it should return 200 and body have _id and parent have to be null",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                parent_id=res.body._id;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body._id).to.be.a("string");
                chai.expect(res.body.parent).to.be.null;
                done();
            })
        })
    })

    describe("/POST api/message message with empty string parent payload",()=>{
        let payload ={
            text:"Hi here im testing for message",
            parent:""
        }
        it("it should return 200 and body have _id and parent have to be null",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body._id).to.be.a("string");
                chai.expect(res.body.parent).to.be.null;
                done();
            })
        })
    })

    describe("/POST api/message message as reply with invalid parent (parent is and objectid)",()=>{
        let payload ={
            text:"Hi here im testing for reply",
            parent:"invalidparentobjectid"
        }
        it("it should return 422 and body have to be an object",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })


    describe("/POST api/message message as reply with valid but unknown parent",()=>{
        let payload ={
            text:"Hi here im testing for reply",
            parent:"5e53ef7dedfeb3eafb94d584"
        }
        it("it should return 422 and body have to be an object",(done)=>{
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/message message as reply with valid parent",()=>{
        it("it should return 200 and parent attribut should be a string",(done)=>{
            let payload ={
                text:"Hi here im testing for reply",
                parent:parent_id
            }
            chai.request(server)
            .post("api/message")
            .set("authorization","Bearer "+access_token)
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body._id).to.be.a("string");
                chai.expect(res.body.parent).to.be.a("string");
                done();
            })
        })
    })

    describe("/GET api/message",()=>{
        it("it should return 200 and body should be an array",(done)=>{
            chai.request(server)
            .get("api/message")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a("array");
                done();
            })
        })
    })

    describe("/GET api/message get reply from a message with invalid parent (parent is an ObjectId)",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            chai.request(server)
            .get("api/message?parent=invalidparent")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/GET api/message get reply from a message with valid parent but unknown parent",()=>{
        it("it should return 200 and body should be an array",(done)=>{
            chai.request(server)
            .get("api/message?parent=5e53ef7dedfeb3eafb94d584")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a("array");
                done();
            })
        })
    })

    describe("/GET api/message get reply from a message with valid parent",()=>{
        it("it should return 200 and body should be an array",(done)=>{
            chai.request(server)
            .get("api/message?parent="+parent_id)
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a("array");
                done();
            })
        })
    })

    describe("/POST api/like post like with empty payload",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            chai.request(server)
            .post("api/like")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/like post like with invalid message_id (message_id is an ObjectId)",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            let payload={
                message_id:"invalidmessageid"
            }
            chai.request(server)
            .post("api/like")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/like post like with valid message_id but unknown message",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            let payload={
                message_id:"5e53ef7dedfeb3eafb94d584"
            }
            chai.request(server)
            .post("api/like")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/like post like with valid message_id",()=>{
        it("it should return 200 and body should be an object",(done)=>{
            let payload={
                message_id:parent_id
            }
            chai.request(server)
            .post("api/like")
            .send(payload)
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/dislike post like with empty payload",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            chai.request(server)
            .post("api/dislike")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/dislike post like with invalid message_id (message_id is an ObjectId)",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            let payload={
                message_id:"invalidmessageid"
            }
            chai.request(server)
            .post("api/dislike")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/like post like with valid message_id but unknown message",()=>{
        it("it should return 422 and body should be an object",(done)=>{
            let payload={
                message_id:"5e53ef7dedfeb3eafb94d584"
            }
            chai.request(server)
            .post("api/dislike")
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST api/like post like with valid message_id",()=>{
        it("it should return 200 and body should be an object",(done)=>{
            let payload={
                message_id:parent_id
            }
            chai.request(server)
            .post("api/dislike")
            .send(payload)
            .set("authorization","Bearer "+access_token)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })
})