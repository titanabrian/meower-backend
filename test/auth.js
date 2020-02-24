const env = require("dotenv").config();
const chai  = require("chai");
const chaiHttp = require("chai-http");
const server = env.parsed.BASE_URL;

chai.use(chaiHttp);

module.exports.test=describe("Auth Endpoint Test || AFTER REGISTER USER PERFORMED",()=>{

    describe("/POST auth/token without payload",()=>{
        it("it should return validation error status 401 and body have to be an object",(done)=>{
            chai.request(server)
            .post("auth/token")
            .end((err,res)=>{
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST auth/token with empty string payload",()=>{
        it("it should return validation error status 401 and body have to be an object",(done)=>{
            let payload={
                username:"",
                password:"",
            }
            chai.request(server)
            .post("auth/token")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST auth/token with unregistered user",()=>{
        it("it should return validation error status 401 and body have to be an object",(done)=>{
            let payload={
                username:"randomuser",
                password:"randompassword",
            }
            chai.request(server)
            .post("auth/token")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST auth/token with wrong password",()=>{
        it("it should return validation error status 401 and body have to be an object",(done)=>{
            let payload={
                username:"titanabrian",
                password:"randompassword",
            }
            chai.request(server)
            .post("auth/token")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    let ref_token="";
    describe("/POST auth/token with valid credential",()=>{
        it("it should return 200 and body have access_token and refresh token",(done)=>{
            let payload={
                username:"titanabrian",
                password:"thispassword",
            }
            chai.request(server)
            .post("auth/token")
            .send(payload)
            .end((err,res)=>{
                ref_token=res.body.refresh_token
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.access_token).to.be.a("string");
                chai.expect(res.body.refresh_token).to.be.a("string");
                done();
            })
        })
    })

    describe("/POST auth/refresh without payload",()=>{
        it("it should return 401 and body have to be an object",(done)=>{
            chai.request(server)
            .post("auth/refresh")
            .end((err,res)=>{
                refresh_token=res.body.refresh_token
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST auth/refresh with invalid refresh token",()=>{
        it("it should return 401 and body have to be an object",(done)=>{
            let payload={
                refresh_token:"invalid refresh token"
            }
            chai.request(server)
            .post("auth/refresh")
            .send(payload)
            .end((err,res)=>{
                refresh_token=res.body.refresh_token
                chai.expect(res).to.have.status(401);
                chai.expect(res.body).to.be.a("object");
                done();
            })
        })
    })

    describe("/POST auth/refresh with valid refresh token",()=>{
        it("it should return 200 and response new access_token and refresh_token",(done)=>{
            let payload={
                refresh_token:ref_token
            }
            chai.request(server)
            .post("auth/refresh")
            .send(payload)
            .end((err,res)=>{
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.access_token).to.be.a("string");
                chai.expect(res.body.refresh_token).to.be.a("string");
                done();
            })
        })
    })
})