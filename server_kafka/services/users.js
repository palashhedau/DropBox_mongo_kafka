var ObjectID = require('mongodb').ObjectID;
var  pool = require("./connectionPool");


function getAllUsers(msg, db , dbId ,  callback){

    var res = {};
    
    var email = msg.email ;
    
    var collection = db.collection('users');
        

         collection.find({"email" : {$ne : email }} , {"email" : 1 }).toArray(function(err , result){
            pool.releaseConnection(dbId);
             if(err){
                 console.log(err);
                 res.code = 500 ;
                 res.allUsers = null ; 
                 callback(null , res ) ; 
             }else{
                 res.code = 200 ;
                 res.allUsers = result ; 
                 callback(null , res ) ; 
             }
         })


}


function submitProfile(msg, db , dbId ,  callback){

    var res = {};
    
    var email = msg.email ;
    var about = msg.about ;
    var education = msg.education ;
    var profession = msg.profession ;
    var lifeevents = msg.lifeevents ;

    var collection = db.collection('profile');
     
    collection.find({email : email }).toArray(function(err , result){
             if(err){
                 console.log(err);
                 res.status(500).json({})
             }else{
                 if(result[0]){
                     res.status(400).json(result[0])
                 }else{
                     var obj = {
                             email : email  ,
                             about : about  ,
                             education  : education ,
                             profession : profession  ,
                             lifeevents : lifeevents 
                     }
                     collection.insertOne(obj , function(err , response){
                        pool.releaseConnection(dbId);
                         if(err){
                             res.code = 500; 
                             callback(null , res) ;
                         }else{
                             res.code = 200;
                             callback(null , res) ; 
                         }
                     })
                 }
             }
    })    
         


}


function getProfile(msg, db , dbId ,   callback){

    var res = {};
    
    var email = msg.email ;
    var collection = db.collection('profile') ; 
         
         collection.find({email : email }).toArray(function(err , result){
            pool.releaseConnection(dbId);
             console.log("Result " , result [0]) ; 
             if(result[0]){
                 res.code = 200;
                 res.profile = result[0];
                 callback(null , res )
                
             }else{
                 res.code = 200;
                 res.profile = null ;
                 callback(null , res )
             }
         })
}



function checkIfAlreadyLoggedIn(msg, db , dbId ,  callback){

    var res = {};
    
    var user = msg.user ; 
    user = new ObjectID(user) ;
    
    
    var collection = db.collection('users');
         
         collection.find({_id : user}).toArray(function(err , result){
             
             pool.releaseConnection(dbId);


             if(result[0]){
                 user  =  { email : result[0].email ,
                        fname : result[0].fname ,
                            lname : result[0].lname ,
                        dob : result[0].dob ,
                        gender : result[0].gender} 
                        
                    res.code = 200 ; 
                    res.loggedIn = true ; 
                    res.user = user ;
                    callback(null , res) ;
                 
                 
             }else{
                    res.code = 200 ; 
                    res.loggedIn = false ; 
                    res.user = null ;
                    callback(null , res) ;
             }
        })

}



exports.checkIfAlreadyLoggedIn = checkIfAlreadyLoggedIn;
exports.getProfile = getProfile;
exports.submitProfile = submitProfile;
exports.getAllUsers = getAllUsers;
