var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var sleep = require('system-sleep');

var connectionArray = [] ; 
const poolsize = 10  ;

var connId = 0 ; 

exports.createConnectionPool = function(url , callback){

  for (var i = 0 ; i < poolsize ; i++) {
                      
      MongoClient.connect(url, function(err, _db){
            var connection = {} ; 

            if(connectionArray[connId] === undefined){
               console.log(connId , "New connection establishing") ;
               connection.db = _db ;
               connection.id = connId ; 
               connectionArray.push(connection) 
               connId ++ ; 

             }  
      }) 
  
       callback(true) ; 
  }

}

exports.getConnection = function( callback){
  
    var connectionFOund = false

    if(connectionArray.length > 0){
      var conn = connectionArray.pop() ; 
      connectionFOund = true ; 
      callback(conn.db , conn.id)
    }

     if(!connectionFOund){
        console.log("Asking for available connection") ;
        var conn = setUpQueue(callback) ;
        callback(conn.db , conn.id) 
     }
}


setUpQueue = function(){
  var  connectionFound = false ; 
  var conn ;

  while(connectionFound === false){
    if(connectionArray.length > 0){
      console.log("Found connection") ;
      conn = connectionArray.pop() ; 
      connectionFound = true ;
    }

    sleep(50);

  }

  
  if(conn !== undefined){
    return conn ; 
  }

}



exports.releaseConnection = function(db , id){
  
   var connection = {} ;
   connection.db = db ;
   connection.id = id ; 
 
   connectionArray.push(connection) ; 

}




