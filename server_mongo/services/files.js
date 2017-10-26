

function readallfiles(msg, db ,  callback){

    var res = {};

    var email = msg.email ; 
    var path = msg.path ; 
    var directory = msg.directory ; 
    
    var collection = db.collection('user_files') ;  
         
    collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err, result){
             if(err){
                 console.log(err)
             }else{
                 res.code = 200 ; 
                 res.filelist = result ;
                 callback(null , res)
             }
    })    

}


function createFolder(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
    var directory = msg.directory ; 
    var  folderInsertObject = msg.folderInsertObject ; 


     var collection = db.collection('user_files') ;
      
      collection.insertOne(folderInsertObject , function(err , result){
                 if(err){
                    res.code = 500 ;
                    res.recent_files = null ;
                    res.filelist = null ; 
                    callback(null , res);
                 }else{
                     collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err , result){
                         if(err){
                             console.log(err);
                         }else{
                             collection.find({ email : email , is_deleted : 0 }).toArray(function(err, result2){
                                 
                                res.code = 200 ;
                                res.recent_files = result2 ;
                                res.filelist = result ; 
                                callback(null , res);

                             })
                         }
                     })
                 }
       })       
             

}



function unStarfile(msg, db ,  callback){

    var res = {
        code : 500,
        recent_files : null ,
        filelist : null ,
        starred_data : null 
    };
    var email = msg.email ; 
    var directory = msg.directory ; 
    var file_name = msg.file_name ; 
    
    var collection = db.collection('user_files') ; 
         
    collection.find({ email : email , file_name : file_name  , 
                         directory : directory , is_deleted : 0 }).toArray(function(err , result){
                            if(err){
                                 console.log(err);
                              callback(null , res) ; 
                             }else{
                                 var starred = 0 ;
                                var updateObj = {
                                        email : result[0].email ,
                                        file_name : result[0].file_name,
                                        starred : starred,
                                        is_directory : result[0].is_directory,
                                        directory :  result[0].directory,
                                        file_add_date : result[0].file_add_date ,
                                        is_deleted : result[0].is_deleted
                                        }
                                
                                collection.update({email : email , file_name : file_name  , 
                                    directory : directory , is_deleted : 0 } ,
                                    updateObj , function(err , response){
                                
                                if(err){
                                    console.log(err);
                                }else{
                                    
                                    collection.find({email : email , is_deleted : 0 , 
                                        starred : 1 }).toArray(function(err , result){
                                            if(err){
                                                console.log(err);
                                                callback(null , res) ; 
                                            }else{
                                                
                                                collection.find({email : email , directory : directory , 
                                                    is_deleted : 0 }).toArray(function(err , result2){
                                                        if(err){
                                                            console.log(err);
                                                           callback(null , res) ; 
                                                        }else{
                                                         
                                                            collection.find({email : email  , 
                                                                is_deleted : 0 }).toArray(function(err , result3){
                                                                    if(err){
                                                                        console.log(err);
                                                                        callback(null , res) ; 
                                                                    }else{
                                                                        res.code = 200;
                                                                        res.recent_files = result3 ;
                                                                        res.filelist = result2 ; 
                                                                        res.starred_data = result ;
                                                                        callback(null , res) ; 
 
                                                                    }
                                                                })
                                                            }
                                                    })
                                            }
                                        })
                                }
                         }) 
                                 
                             }
                         })     
         
}


function starFile(msg, db ,  callback){

    var res = {
        code : 500,
        recent_files : null ,
        filelist : null ,
        starred_data : null 
    };
    var email = msg.email ; 
    var directory = msg.directory ; 
    var file_name = msg.file_name ; 
    
    var collection = db.collection('user_files') ; 

    collection.find({ email : email , file_name : file_name  , 
                         directory : directory , is_deleted : 0 }).toArray(function(err , result){
                             if(err){
                                 console.log(err);
                                callback(null , res) ;
                             }else{
                                 
                                 if(result[0].starred === 0 ){
                                    var starred = 1 ;
                                 }else if(result[0].starred === 1){
                                    var starred = 0 ;
                                 }
                                 
                                var updateObj = {
                                        email : result[0].email ,
                                        file_name : result[0].file_name,
                                        starred : starred,
                                        is_directory : result[0].is_directory,
                                        directory :  result[0].directory,
                                        file_add_date : result[0].file_add_date ,
                                        is_deleted : result[0].is_deleted
                                        }
                                 
                                 
                                 collection.update({email : email , file_name : file_name  , 
                                            directory : directory , is_deleted : 0 } ,
                                            updateObj , function(err , response){
                                        
                                        if(err){
                                            console.log(err);
                                        }else{
                                            
                                            collection.find({email : email , is_deleted : 0 , 
                                                starred : 1 }).toArray(function(err , result){
                                                    if(err){
                                                        console.log(err);
                                                        callback(null , res) ;
                                                    }else{
                                                        
                                                        collection.find({email : email , directory : directory , 
                                                            is_deleted : 0 }).toArray(function(err , result2){
                                                                if(err){
                                                                    console.log(err);
                                                                    callback(null , res) ;
                                                                }else{
                                                                 
                                                                    collection.find({email : email  , 
                                                                        is_deleted : 0 }).toArray(function(err , result3){
                                                                            if(err){
                                                                                console.log(err);
                                                                                callback(null , res) ;
                                                                            }else{
                                                                             
                                                                                res.code = 200;
                                                                                res.recent_files = result3 ;
                                                                                res.filelist = result2 ; 
                                                                                res.starred_data = result ;
                                                                                callback(null , res) ; 
  
                                                                            }
                                                                        })
                                                                    }
                                                            })
                                                    }
                                                })
                                        }
                                 }) 
                            }
                         })


}






function readallStarredfiles(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_files') ; 
             
    collection.find({starred : 1 , email : email  , is_deleted  : 0 }).toArray(function(err , result){
                if(err){
                    res.code = 500 ;
                    res.starred_data = null  ;
                    callback(null , res);
                } else{
                    res.code = 200 ;
                    res.starred_data = result  ;
                    callback(null , res);
                }
    })
}


function readRecentfiles(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_files') ; 
    collection.find({ email : email  , is_deleted  : 0 }).toArray(function(err , result){
                if(err){
                    res.code = 500 ;
                    res.starred_data = null  ;
                    callback(null , res);
                } else{
                    res.code = 200 ;
                    res.recent_items = result  ;
                    callback(null , res);
                }
         })
}


function shareFile(msg, db ,  callback){

    var res = {};
    var file_name = msg.file_name ; 
    var directory = msg.directory ; 
    var fromUser = msg.fromUser ; 
    var toUser = msg.toUser ; 
    var is_directory = msg.is_directory ; 

    
    var collection = db.collection('user_shared_files') ; 
         
         collection.find({from_user : fromUser , to_email : toUser , 
                        filename : file_name , directory : directory ,
                        is_directory : is_directory }).toArray(function(err , result){
             if(err){
                 console.log(error);
                 res.code = 500 ; 
                 res.success = null ;
                 callback(null , res);
             }else{
                 if(result[0]){
                     res.code = 400 ; 
                     res.success = null ;
                     callback(null , res);
                 }else{
                     var shareObj = {from_user : fromUser ,
                                to_email : toUser , 
                                filename : file_name ,
                                directory : directory,
                                is_directory : is_directory}
                     collection.insert(shareObj , function(err , response){
                         if(err){
                             console.log(error);
                             res.code = 500 ; 
                             res.success = null ;
                             callback(null , res);
                         }else{
                             res.code = 200 ; 
                             res.success = true ;
                             callback(null , res);
                         }
                     })
                 }
             }
                            
         })
}


function getAllSharedFile(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_shared_files') ; 
         
         collection.find({to_email : email }).toArray(function(err , result){
             if(err){
                res.code = 500 ;
                res.filelist = null ; 
                callback(null , res)
             }else{
                 res.code = 200 ;
                res.filelist = result ; 
                callback(null , res)
             }
         })
}



function readFolderForIndividuals(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
    var folderowner = msg.folderowner ; 
    var foldername = msg.foldername ; 
    var directory = msg.directory ; 

    
    var collection = db.collection('user_files') ; 
         
         collection.find({email : folderowner , directory : foldername }).toArray(function(err , result){
             if(err){
                res.code = 200 ;
                res.subGroupContent = null ;
                callback(null , res);
             }else{
                res.code = 200 ;
                res.subGroupContent = result ;
                callback(null , res);
             }
         })

}

function getFilesHistory(msg, db ,  callback){

    var res = {};
    var email = msg.email ; 
   
   var collection = db.collection('user_files') ;
         
         collection.find({is_deleted : 1 ,email : email  }).toArray(function(err , result){
             if(err){
                 console.log(err);
                 res.code = 500 ; 
                 res.profile = 'Error while getting profile '
                 callback(null , res );
             }else{
                console.log("FIle history ") ; 
                res.code = 200 ; 
                 res.profile = result
                 callback(null , res );
             }
         })

}





exports.getFilesHistory = getFilesHistory;
exports.readFolderForIndividuals = readFolderForIndividuals;
exports.getAllSharedFile = getAllSharedFile;
exports.shareFile = shareFile;
exports.readRecentfiles = readRecentfiles;
exports.readallStarredfiles = readallStarredfiles;
exports.starFile = starFile;
exports.unStarfile = unStarfile;
exports.createFolder = createFolder;
exports.readallfiles = readallfiles;
