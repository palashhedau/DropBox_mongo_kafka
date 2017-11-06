var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var groups = require('./services/groups');
var users = require('./services/users');
var files = require('./services/files');

var topic_name = 'dropbox_app';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();




console.log('Hi');

var mongoURL =        "mongodb://localhost:27017/DropBox_application";
var mongo = require("./services/mongo");
var pool = require("./services/connectionPool");

pool.createConnectionPool(mongoURL , function(data){
    if(data){
        console.log("Database Pool Created ") ; 
    }
}) ;
  

var chunk_requests = {};







console.log('server is running');
consumer.on('message', function (message) {
    
    var data = JSON.parse(message.value);
    var apiToCall  = data.data.api ; 
    console.log("API " , apiToCall) ; 
    
    if(apiToCall !== 'upload'){
        pool.getConnection( function(db , dbId){

            if(apiToCall === 'login'){
                
                   login.handle_request(data.data, db , dbId ,   function(err,res){
                           
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    });
                

            }else if(apiToCall === 'createGroup'){
                    groups.createGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getAllGroups'){
                    groups.getAllGroups(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'addMemberToGroup'){
                    groups.addMemberToGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }
            else if(apiToCall === 'getMembersOfGroup'){
                    groups.getMembersOfGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'deleteMembersOfGroup'){
                    groups.deleteMembersOfGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'deleteGroup'){
                    groups.deleteGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getAllUsers'){
                    users.getAllUsers(data.data, db , dbId ,   function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'submitProfile'){
                    users.submitProfile(data.data, db ,dbId ,   function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'readallfiles'){
                    files.readallfiles(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'createFolder'){
                    files.createFolder(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'unStarfile'){
                    files.unStarfile(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'starFile'){
                    files.starFile(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'readallStarredfiles'){
                    files.readallStarredfiles(data.data, db , dbId ,   function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'readRecentfiles'){
                    files.readRecentfiles(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getGroupName'){
                    groups.getGroupName(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'shareFile'){
                    files.shareFile(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getAllSharedFile'){
                    files.getAllSharedFile(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'readFolderForIndividuals'){
                    files.readFolderForIndividuals(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'shareFileWithGroup'){
                    groups.shareFileWithGroup(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getAllSharedGroupComponents'){
                    groups.getAllSharedGroupComponents(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'readFolderForGroups'){
                    groups.readFolderForGroups(data.data, db , dbId ,  function(err,res){
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'getFilesHistory'){
                    files.getFilesHistory(data.data, db , dbId ,  function(err,res){
                        console.log('History ' , res.profile)
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'downloadFile'){
                    files.downloadFile(data.data, db , dbId ,  function(err,res ){


                         for(var i=0;i< res.chunks.length;i++){

                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res.code,
                                        chunk:res.chunks[i],
                                        total_chunks:res.chunks.length,
                                        chunk_no:i,
                                        is_chunk_data:true,
                                    }),
                                    partition : 0
                                }
                            ];

                            producer.send(payloads, function(err, data){
                                if(err){
                                    console.log(err)
                                }else{
                                    console.log("Data sent successfully");
                                }

                            });

                         }

                         return;

                    })
            }else if(apiToCall === 'delete'){
                    files.deleteFile(data.data, db , dbId ,  function(err,res){
                       // console.log('History ' , res.data)
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'registration'){
                    login.registration(data.data, db , dbId ,   function(err,res){
                       // console.log('History ' , res.data)
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }else if(apiToCall === 'checkIfAlreadyLoggedIn'){
                    users.checkIfAlreadyLoggedIn(data.data, db , dbId ,  function(err,res){
                       // console.log('History ' , res.data)
                            var payloads = [
                                { topic: data.replyTo,
                                    messages:JSON.stringify({
                                        correlationId:data.correlationId,
                                        data : res
                                    }),
                                    partition : 0
                                }
                            ];
                            producer.send(payloads, function(err, data){
                                //console.log(data);
                            });
                            
                            return;
                    })
            }
            
        })
    }else if(apiToCall === 'upload'){
                  
                if(data.is_chunk_data){
                     var chunk_request = chunk_requests[data.correlationId];
                     if(chunk_request){
                        chunk_request.chunks.push({
                            data:data.chunk,
                            order:data.chunk_no  
                        })
                    }else{
                         chunk_request = {
                                            chunks:[
                                                {
                                                    data:data.chunk,
                                                    order:data.chunk_no
                                                }
                                            ],
                                            total_chunks:data.total_chunks
                                        }
                        chunk_requests[data.correlationId] = chunk_request;
                    }

                     if(chunk_request.chunks.length === chunk_request.total_chunks){
                        chunk_request.chunks.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);});
                        var combined_chunks_data = "";
                        for (var i=0;i<chunk_request.chunks.length;i++) {
                            combined_chunks_data += chunk_request.chunks[i].data;
                        }
                        data.data.buffer = Buffer.from(combined_chunks_data,'base64');

                         

                          pool.getConnection( function(db , dbId){
                                files.upload(data.data, db , dbId ,  function(err,res){
                                   // console.log('History ' , res.data)
                                        var payloads = [
                                            { topic: data.replyTo,
                                                messages:JSON.stringify({
                                                    correlationId:data.correlationId,
                                                    data : res
                                                }),
                                                partition : 0
                                            }
                                        ];
                                        producer.send(payloads, function(err, data){
                                            //console.log(data);
                                        });
                                        
                                        return;
                                })
                          })


                        


                     }


                }


                
            }
    

});


