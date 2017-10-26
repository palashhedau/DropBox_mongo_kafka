var bcrypt = require('bcrypt') ; 


function handle_request(msg, db ,  callback){

    var res = {};
    
    var collection = db.collection('users');
    
    console.log(msg.email) ; 
                collection.find({email : msg.email} , {email : 1 , fname : 1 , lname : 1 , gender : 1 , password : 1 , dob : 1  } ).toArray(function(err , result){
                    
                    if(result[0]){
                        console.log('User found ')
                        bcrypt.compare(msg.password, result[0].password, function(err, result1) {
                            if(result1 == true){
                                console.log('User authenticated') ; 
                                user =  {user_id : result[0]._id , email : result[0].email , 
                                            fname : result[0].fname , dob :  result[0].dob , 
                                            lname : result[0].lname , gender : result[0].gender};


                                 res.code = "200";
                                 res.user = user ; 
                                 console.log("After authenticate " , res ) ; 
                                 callback(null , res);

                            }else{
                                  res.code = "401";
                                  res.user = {} ;
                                  callback(null , res);
                            }

                        })
                    }else{
                            res.code = "401";
                             res.user = {} ;
                             callback(res , null );
                    }
                    console.log("Response lol " , res) ;       
                 })

}



exports.handle_request = handle_request;
