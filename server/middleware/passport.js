var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/DropBox_application";
var bcrypt = require('bcrypt');
var kafka = require('./kafka/client');



module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username   , password, done) {
        try {
        	kafka.make_request('dropbox_app',{"api" : "login" , "email":username,"password":password}, function(err,results){
                console.log('in result');
                console.log("Data from kafka ");
                
                console.log(results ) ; 
                if(err){
                    done(err,{});
                }
                else
                {
                    if(results.code == 200){
                        done(null,results.user);
                    }
                    else {
                        done(null,false);
                    }
                }
            });
        }
        catch (e){
            done(e,{});
        }
    }));
};