var assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
var app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe("Login API", function() {
    it("It should login", function (done)  {
      chai.request('http://localhost:3002')
          .post('/getProfile')
          .send({"email": "palashhedau900@gmail.com"
        	  
        	  })
          .end(function(err, res) {
        	  console.log("response.body " , res.body) ; 
            assert.equal(res.body.loggedIn, true);
            done();
          });
    });
});


