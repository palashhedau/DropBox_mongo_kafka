var assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
var app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe("Testing", function() {
    
	
	
	
	
	
	it("Get File History", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/getFilesHistory')
	          .send({"email": "messi@gmail.com" ,
	        	  "password": "messi" ,
	        	  "fname": "Messi" ,
	        	  "lname": "Messi" ,
	        	  "dob": "22/07/1992" ,
	        	  "gender": "Male" ,
	        	  })
	          .end(function(err, res) {
	        	 
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	
	it("Create Group", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/createGroup')
	          .send({"email": "messi@gmail.com" ,
	        	  "groupname": "KAKA" 
	        	  })
	          .end(function(err, res) {
	        	   
	            assert.equal(res.status, 201);
	            done();
	          });
	});
	
	
	it("Read Starred files", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/readallStarredfiles')
	          .send({"email": "messi@gmail.com" ,
	        	  
	        	  })
	          .end(function(err, res) {
	        	 
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	
	it("Read Recent files", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/readRecentfiles')
	          .send({"email": "palashhedau900@gmail.com" ,
	        	  
	        	  })
	          .end(function(err, res) {
	        	 
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	it("Get Shared Files", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/getAllSharedFile')
	          .send({"email": "palashhedau900@gmail.com" ,
	        	  
	        	  })
	          .end(function(err, res) {
	        	 
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	
	it("Get all Groups", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/getAllGroups')
	          .send({"email": "messi@gmail.com" ,
	        	 
	        	  })
	          .end(function(err, res) {
	        	  
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	
	it("Get all Users", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/getAllUsers')
	          .send({"email": "messi@gmail.com" ,
	        	 
	        	  })
	          .end(function(err, res) {
	        	 
	            assert.equal(res.status, 200);
	            done();
	          });
	});
	
	it("Check profile existence", function (done)  {
	      chai.request('http://localhost:3002')
	          .post('/checkProfileExist')
	          .send({"email": "palashhedau900@gmail.com" ,
	        	 
	        	  })
	          .end(function(err, res) {
	        	   
	            assert.equal(res.body.profileExist, true);
	            done();
	          });
	});
	
	
	it("Check Login", function (done)  {
      chai.request('http://localhost:3002')
          .post('/checkIfAlreadyLoggedIn')
          .send({"email": "palashhedau900@gmail.com"
        	  
        	  })
          .end(function(err, res) {
        	  
            assert.equal(res.status, 403);
            done();
          });
    });
    
    
    it("Get profile", function (done)  {
        chai.request('http://localhost:3002')
            .post('/getProfile')
            .send({"email": "palashhedau900@gmail.com"
          	  
          	  })
            .end(function(err, res) {
          	 
              assert.equal(res.body.profile.email, "palashhedau900@gmail.com");
              done();
            });
      });
    
    
});

