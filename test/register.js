const env = require("dotenv").config();
const chai  = require("chai");
const chaiHttp = require("chai-http");
const server = env.parsed.BASE_URL;

chai.use(chaiHttp);

module.exports.test=describe("Register Endpoint Test",()=>{

    describe("/POST User without payload",()=>{
        it("it should return validation error status 422",(done)=>{
            chai.request(server)
            .post("register")
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST User with empty string payload",()=>{
        it("it should return validation error status 422",(done)=>{
            let payload={
                username:"",
                password:"",
                confirm:""
            }
            chai.request(server)
            .post("register")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST User with invalid password confirm",()=>{
        it("it should return validation error status 422",(done)=>{
            let payload={
                username:"toto",
                password:"thispassword",
                confirm:"thispassword1"
            }
            chai.request(server)
            .post("register")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST User",()=>{
        it("it should correct case status 200 and return User Object",(done)=>{
            let payload={
                username:"titanabrian",
                password:"thispassword",
                confirm:"thispassword"
            }
            chai.request(server)
            .post("register")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body._id).to.be.a("string");
                done();
            })
        })
    })

    describe("/POST Duplicate User",()=>{
        it("it should return validation error status 422",(done)=>{
            let payload={
                username:"titanabrian",
                password:"thispassword",
                confirm:"thispassword"
            }
            chai.request(server)
            .post("register")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(422);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })
})