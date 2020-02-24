const env = require("dotenv").config();
const chai  = require("chai");
const chaiHttp = require("chai-http");
const server = env.parsed.BASE_URL;
chai.use(chaiHttp);

module.exports.test=describe("Request Without Authorization",()=>{
    
        describe("/GET Message",()=>{
            it("it should return unauthorized",(done)=>{
                chai.request(server)
                .get("api/message")
                .end((err,res)=>{
                    chai.expect(res).to.have.status(401);
                    chai.expect(res.body).to.be.a("object");
                    done();
                })
            })
        })


        describe("/GET Message With Wrong Bearer Token",()=>{
            it("it should return unauthorized",(done)=>{
                chai.request(server)
                .get("api/message")
                .set("authorization","invalidwttoken")
                .end((err,res)=>{
                    chai.expect(res).to.have.status(401);
                    chai.expect(res.body).to.be.a("object");
                    done();
                })
            })
        })
        
        describe("/GET Message Detail",()=>{
            it("it should return unauthorized",(done)=>{
                let id="randomid"
                chai.request(server)
                .get("api/message?id="+id)
                .end((err,res)=>{
                    chai.expect(res).to.have.status(401);
                    chai.expect(res.body).to.be.a("object");
                    done();
                })
            })
        })
    
        describe("/GET Message Reply",()=>{
            it("it should return unauthorized",(done)=>{
                let id="randomid"
                chai.request(server)
                .get("api/message?parent="+id)
                .end((err,res)=>{
                    chai.expect(res).to.have.status(401);
                    chai.expect(res.body).to.be.a("object");
                    done();
                })
            })
        })
    })