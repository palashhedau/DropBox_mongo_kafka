var mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let conn = mongoose.connection ; 
Grid.mongo = mongoose.mongo ;
let gfs ; 
var FileReader = require('filereader');

var  pool = require("./connectionPool");


var CHUNK_SIZE = 100 * 1024;

function readallfiles(msg, db , dbId ,  callback){

    var res = {};

    var email = msg.email ; 
    var path = msg.path ; 
    var directory = msg.directory ; 
    
    var collection = db.collection('user_files') ;  
         
    collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err, result){
            pool.releaseConnection(db , dbId);
             if(err){
                 console.log(err)
             }else{
                 res.code = 200 ; 
                 res.filelist = result ;
                 callback(null , res)
             }
    })    

}


function createFolder(msg, db , dbId ,  callback){

    var res = {};
    var email = msg.email ; 
    var directory = msg.directory ; 
    var  folderInsertObject ;
    var  file_name = msg.file_name ;
    var  starred = msg.starred ;
    var  is_directory = msg.is_directory ;
    var  is_deleted = msg.is_deleted ;

    folderInsertObject = {
                     email : email  ,
                     file_name : file_name  ,
                     starred : starred   , 
                     is_directory : is_directory   ,
                     directory : directory   ,
                     file_add_date : new Date()  , 
                     is_deleted : is_deleted  
    }



     var collection = db.collection('user_files') ;
      
      collection.insertOne(folderInsertObject , function(err , result){
                 if(err){
                    pool.releaseConnection(db , dbId);
                    res.code = 500 ;
                    res.recent_files = null ;
                    res.filelist = null ; 
                    callback(null , res);
                 }else{
                     collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err , result){
                         if(err){
                             pool.releaseConnection(db , dbId);
                             console.log(err);
                         }else{
                             collection.find({ email : email , is_deleted : 0 }).sort({file_add_date : -1}).limit(5).toArray(function(err, result2){
                                
                                pool.releaseConnection(db , dbId);
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



function unStarfile(msg, db , dbId ,  callback){

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
                                pool.releaseConnection(db , dbId);
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
                                    pool.releaseConnection(db , dbId);
                                    console.log(err);
                                }else{
                                    
                                    collection.find({email : email , is_deleted : 0 , 
                                        starred : 1 }).toArray(function(err , result){
                                            if(err){
                                                console.log(err);
                                                pool.releaseConnection(db , dbId);
                                                callback(null , res) ; 
                                            }else{
                                                
                                                collection.find({email : email , directory : directory , 
                                                    is_deleted : 0 }).toArray(function(err , result2){
                                                        if(err){
                                                            console.log(err);
                                                            pool.releaseConnection(db , dbId);
                                                           callback(null , res) ; 
                                                        }else{
                                                         
                                                            collection.find({email : email  , 
                                                                is_deleted : 0 }).sort({file_add_date : -1}).limit(5).toArray(function(err , result3){
                                                                    if(err){
                                                                        console.log(err);
                                                                        pool.releaseConnection(db , dbId);
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


function starFile(msg, db , dbId ,  callback){

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
                                 pool.releaseConnection(db , dbId);
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
                                            pool.releaseConnection(db , dbId);
                                            console.log(err);
                                        }else{
                                            
                                            collection.find({email : email , is_deleted : 0 , 
                                                starred : 1 }).toArray(function(err , result){
                                                    if(err){
                                                        pool.releaseConnection(db , dbId);
                                                        console.log(err);
                                                        callback(null , res) ;
                                                    }else{
                                                        
                                                        collection.find({email : email , directory : directory , 
                                                            is_deleted : 0 }).toArray(function(err , result2){
                                                                if(err){
                                                                    console.log(err);
                                                                    pool.releaseConnection(db , dbId);
                                                                    callback(null , res) ;
                                                                }else{
                                                                 
                                                                    collection.find({email : email  , 
                                                                        is_deleted : 0 } ).sort({file_add_date : -1}).limit(5).toArray(function(err , result3){
                                                                            pool.releaseConnection(db , dbId);
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






function readallStarredfiles(msg, db ,dbId ,   callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_files') ; 
             
    collection.find({starred : 1 , email : email  , is_deleted  : 0 }).toArray(function(err , result){
                pool.releaseConnection(db , dbId);
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


function readRecentfiles(msg, db , dbId , callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_files') ; 
    collection.find({ email : email  , is_deleted  : 0 }  ).sort({file_add_date : -1}).limit(5).toArray(function(err , result){
                pool.releaseConnection(db , dbId);
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


function shareFile(msg, db ,dbId ,   callback){

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
                pool.releaseConnection(db , dbId);
                 console.log(error);
                 res.code = 500 ; 
                 res.success = null ;
                 callback(null , res);
             }else{
                 if(result[0]){
                    pool.releaseConnection(db , dbId);
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
                        pool.releaseConnection(db , dbId);
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


function getAllSharedFile(msg, db ,dbId ,  callback){

    var res = {};
    var email = msg.email ; 
    
    var collection = db.collection('user_shared_files') ; 
         
         collection.find({to_email : email }).toArray(function(err , result){
             pool.releaseConnection(db , dbId);
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



function readFolderForIndividuals(msg, db , dbId ,  callback){

    var res = {};
    var email = msg.email ; 
    var folderowner = msg.folderowner ; 
    var foldername = msg.foldername ; 
    var directory = msg.directory ; 

    
    var collection = db.collection('user_files') ; 
         
         collection.find({email : folderowner , directory : foldername , is_deleted : 0 }).toArray(function(err , result){
             pool.releaseConnection(db , dbId);
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

function getFilesHistory(msg, db , dbId ,  callback){

    var res = {};
    var email = msg.email ; 
   
   var collection = db.collection('user_files') ;
         
         collection.find({is_deleted : 1 ,email : email  }).toArray(function(err , result){
             pool.releaseConnection(db , dbId);
             if(err){
                 console.log(err);
                 res.code = 500 ; 
                 res.profile = 'Error while getting profile '
                 callback(null , res );
             }else{
                
                res.code = 200 ; 
                 res.profile = result
                 callback(null , res );
             }
         })

}



function deleteFile(msg, db , dbId ,  callback){

   var res = {};
   var email = msg.email ; 
   var filename = msg.filename ; 
   var directory = msg.directory ; 
   gfs = Grid(db);
   
   var collection = db.collection('user_files') ; 
                         
        collection.find({ email : email  , is_deleted  : 0 , file_name :filename , directory : directory }).toArray(function(err , result){
         
         if(err){
                    console.log(err);
                    pool.releaseConnection(db , dbId);
                   res.code = 500 ;
                   callback(null , res); 
                } else{
                    
                    if(result[0]){
                        
                        
                        if(result[0].is_directory === 0 ){
                            //code for deletetion of files from mongoDB
                            var collectionFiles = db.collection('fs.files');
                            collectionFiles.find({"metadata.email" : email , "metadata.directory" : directory ,  "metadata.file_name" : filename  }).toArray(function(err , result){
                                var idToRemove = result[0]._id ;
                                gfs.remove({_id : idToRemove}, function (err) {
                                  if (err) throw err;
                                });
                             })

                        }else if(result[0].is_directory === 1){
                            //code of recursive deletion
                            var folderContentToDelete = directory + '/' + filename+'/*' ;
                            console.log("folderContentToDelete " , folderContentToDelete) ;
                            collection.find({email : email  , is_deleted  : 0  , directory : {$regex : folderContentToDelete }}).toArray(function(err , arrResult){
                                for(var i = 0 ; i < arrResult.length ; i++){
                                     
                                    if(arrResult[i].is_directory === 0){
                                         var collectionFiles2 = db.collection('fs.files');
                                          collectionFiles2.find({"metadata.email" : arrResult[i].email , "metadata.directory" : arrResult[i].directory ,  "metadata.file_name" : arrResult[i].file_name  }).toArray(function(err , result){
                                            var idToRemove = result[0]._id ;
                                            gfs.remove({_id : idToRemove}, function (err) {
                                              if (err) throw err;
                                            });
                                         })
                                    }


                                     var deleteObj = {
                                                        email : arrResult[i].email ,
                                                        file_name : arrResult[i].file_name,
                                                        starred : arrResult[i].starred,
                                                        is_directory : arrResult[i].is_directory,
                                                        directory :  arrResult[i].directory,
                                                        file_add_date : arrResult[i].file_add_date ,
                                                        is_deleted : 1
                                                      }
                                     collection.update({email : email  , is_deleted  : 0  , file_name : arrResult[i].file_name,
                                       directory :   arrResult[i].directory      } , deleteObj , function(err , response){
                                            if(err) throw err ; 
                                       })

                                }
                            })


                        }



                        var deleteObj = {
                                email : result[0].email ,
                                file_name : result[0].file_name,
                                starred : result[0].starred,
                                is_directory : result[0].is_directory,
                                directory :  result[0].directory,
                                file_add_date : result[0].file_add_date ,
                                is_deleted : 1
                                }
                        
                         collection.update({email : email  , is_deleted  : 0 , file_name :filename , directory : directory } ,
                                 deleteObj , function(err , response){
                                if(err){
                                    
                                    console.log(err)
                                     res.code = 500 ;
                                     callback(null , res);
                                }else{
                                   
                                         var collection2 = db.collection('user_shared_files') ; 
                                         collection2.remove({from_user : email , filename : filename , directory : directory } , function(err , result ){
                                           
                                             if(err ){
                                                 console.log(err);
                                                  res.code = 500 ;
                                                 callback(null , res);
                                             }else{
                                                
                                                var collection3 = db.collection('groups') ; 
                                                collection3.find({ filelist: {$elemMatch : { file_owner  : email , file_directory : directory , filename : filename }} } , function(err , result){
                                                    

                                                    
                                                    collection3.updateMany({} , {$pull: {filelist : {file_owner  : email , file_directory : directory , filename : filename} }} , function(err , response){
                                                       
                                                        if(err){
                                                             console.log(err);
                                                             res.code = 500 ;
                                                            callback(null , res);
                                                        }else{
                                                            
                                                            collection.find({email : email , is_deleted : 0 , 
                                                                starred : 1 , directory : directory  }).toArray(function(err , result){
                                                                    if(err){
                                                                        console.log(err);
                                                                        res.code = 500 ;
                                                                        callback(null , res);
                                                                    }else{
                                                                        
                                                                        collection.find({email : email , directory : directory , 
                                                                            is_deleted : 0 }).toArray(function(err , result2){
                                                                                if(err){
                                                                                    console.log(err);
                                                                                     res.code = 500 ;
                                                                                     callback(null , res);
                                                                                }else{
                                                                                 
                                                                                    collection.find({email : email  , 
                                                                                        is_deleted : 0 }  ).sort({file_add_date : -1}).limit(5).toArray(function(err , result3){
                                                                                           pool.releaseConnection(db , dbId);
                                                                                            if(err){
                                                                                                console.log(err);
                                                                                                 res.code = 500 ;
                                                                                                callback(null , res);
                                                                                            }else{
                                                                                                 res.code = 500 ;
                                                                                                 res.starred_data = result ;
                                                                                                 res.filelist = result2 ;
                                                                                                 res.recent_files = result3 ;
                                                                                                 callback(null , res);

                                                                                                
                                                                                            }
                                                                                        })
                                                                                    }
                                                                            })
                                                                    }
                                                                })
                                                        }
                                                    })
                                                
                                                })
                                             }
                                         })
                                    
                                    
                                }
                         })
                        
                    }
                }
             })              

}


function downloadFile(msg, db , dbId ,  callback){

    
    var res = {};
    
    var file =  msg.file;
    var directory =  msg.directory; 
    var email = msg.email ; 

    
   
    gfs = Grid(db);

     var collection = db.collection('fs.files');
         collection.find({"metadata.email" : email , "metadata.directory" : directory ,  "metadata.file_name" : file  }).toArray(function(err , result){
             
             if(err){
                throw err ;
             }else{
                
             
             gfs.files.find({
                 _id : result[0]._id
             }).toArray(function(err , result){
                 if(result){
                     let data = [];
                     let readStream = gfs.createReadStream({
                         _id : result[0]._id
                     })
                     
                     readStream.on('data' , function(chunk){
                         data.push(chunk) ;
                     })
                     
                     readStream.on('end' , function(){
                        pool.releaseConnection(db , dbId);

                        data = Buffer.concat(data) ; 
                        var fileBuffer = new Buffer(data).toString('base64') ;
                        var chunks = SplitFileIntoArray(fileBuffer) ;
                        
                        res.code = 200 ; 
                        res.chunks = chunks; 
                        callback(null , res );
                         
                         
                     })
                     
                     
                 }else{
                    pool.releaseConnection(db , dbId);
                     console.log("File not found");
                 }



             })
             }

             
             
         })
}



function SplitFileIntoArray(fileString){
    var parts = [];
    while(fileString !== ''){
        if(fileString.length > CHUNK_SIZE){
            parts.push(fileString.slice(0, CHUNK_SIZE));
            fileString = fileString.slice(CHUNK_SIZE);
        } else {
            parts.push(fileString);
            break;
        }
    }
    return parts;
}


function upload(msg, db , dbId ,  callback){

    
    var res = {};
    
    gfs = Grid(db);


    var email = msg.email ; 
    var starred = msg.starred ; 
    var is_directory = msg.is_directory ; 
    var directoryToUpload = msg.directoryToUpload ; 
    var datetime = msg.datetime ; 
    var is_deleted = msg.is_deleted ; 


    var fileData =  new Buffer(msg.buffer);
    var filename  = msg.filename; 
    //var fileData = new Buffer(file.data.data)
  
   
   
    var fileReader = new FileReader();

    var collection = db.collection('user_files') ; 


    collection.find({email : email , file_name : filename ,directory : directoryToUpload , is_deleted : 0 }).toArray(function(err , result){
        if(result[0]){
           res.code = 400 ;
            callback(null , res); 
        }else{
            

            var insertObj = {
                            email : email ,
                            file_name : filename,
                            starred : starred,
                            is_directory : is_directory,
                            directory :  directoryToUpload,
                            file_add_date : new Date() ,
                            is_deleted : is_deleted,
                            } ; 

            //File upload in DB
             //File upload in DB
                                let writeStream = gfs.createWriteStream({
                                    filename:  filename,
                                    mode: 'w',
                                    content_type:  msg.mimetype ,
                                    metadata: {
                                       email : email,
                                       directory :  directoryToUpload,
                                       file_name : filename,
                                    }
                                });
                                
                                
                                writeStream.on('close', function(file){
                                    if(!file) {
                                       console.log('No file received');
                                    }else{
                                        console.log("File Done")
                                    }
                                })
                                

                                writeStream.write(fileData, function(){
                                  writeStream.end();

                                  collection.insertOne(insertObj , function(err , response ){
                                     if(err){
                                         res.code = 500 ;
                                         pool.releaseConnection(db , dbId);
                                         callback(null , res);
                                     }else{
                                        
                                        collection.find({email : email , directory : directoryToUpload , is_deleted : 0 }).toArray(function(err , result){
                                             if(err){
                                                 console.log(err);
                                                 pool.releaseConnection(db , dbId);
                                             }else{
                                                 collection.find({ email : email , is_deleted : 0 }).sort({file_add_date : -1}).limit(5).toArray(function(err, result2){
                                                     pool.releaseConnection(db , dbId);
                                                    res.code = 200 ;
                                                    res.filelist = result ;
                                                    res.recent_files = result2 ; 

                                                     callback(null , res ) ; 
                                                 })
                                             }
                                         })


                                     }
                                    })


                                });                    



        }
    })




}





exports.deleteFile = deleteFile;
exports.upload = upload;
exports.downloadFile = downloadFile;
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
