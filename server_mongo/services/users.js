
function getAllUsers(msg, db ,  callback){

    var res = {};
    
    var email = msg.email ;
    
    var collection = db.collection('users');
        

         collection.find({"email" : {$ne : email }} , {"email" : 1 }).toArray(function(err , result){
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


function submitProfile(msg, db ,  callback){

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


function getProfile(msg, db ,  callback){

    var res = {};
    
    var email = msg.email ;
    var collection = db.collection('profile') ; 
         
         collection.find({email : email }).toArray(function(err , result){
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



exports.getProfile = getProfile;
exports.submitProfile = submitProfile;
exports.getAllUsers = getAllUsers;
