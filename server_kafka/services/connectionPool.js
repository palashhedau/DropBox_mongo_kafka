var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;


/**
 * Connects to the MongoDB Database with the provided URL
 */

var connectionArray = [] ; 
  const poolsize = 1 ;
 // const MAX_IDLE_TIME = 10;

exports.getConnection = function(url , callback){
  
  var connection = {} ; 

  for (var i = 0 ; i < poolsize ; i++) 
  { 

     
      if(connectionArray[i] === undefined)
      {
           
            MongoClient.connect(url, function(err, _db){
            if (err) { throw new Error('Could not connect: '+err); }
            db = _db;
            connection.db = _db ;
            connection.id = i ; 

            connectionArray.push(connection) ; 
           // console.log("Length " , connectionArray.length );

            callback(connection.db , connection.id ) ; 
            
          });
           break ; 
      }

      if(i === poolsize-1){
        console.log("Waiting for connection") ; 
      }

  }

}




exports.releaseConnection = function(id){
 // console.log("Connection to release " , id ) ; 
  for(var i = 0 ; i < connectionArray.length ; i ++  ){
    if(connectionArray[i].id === id ){
    
      connectionArray.splice( i , 1 );
      break ; 
    }
  }
  /*console.log("length of Connection Available " , connectionArray.length) ;
  console.log(connectionArray) ;  
  console.log('------------------------------------------') ; */
}




