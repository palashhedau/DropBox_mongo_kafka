var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var groups = require('./services/groups');
var users = require('./services/users');
var files = require('./services/files');

var topic_name = 'dropbox_app';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();






var mongoURL =        "mongodb://localhost:27017/DropBox_application";
var mongo = require("./services/mongo");



  





console.log('server is running');
consumer.on('message', function (message) {
    
    var data = JSON.parse(message.value);
    var apiToCall  = data.data.api ; 
    console.log("API " , apiToCall) ; 
    
    mongo.connect(mongoURL, function(db){

        if(apiToCall === 'login'){
            
               login.handle_request(data.data, db ,  function(err,res){
                       
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
                            console.log(data);
                        });
                        
                        return;
                });
            

        }else if(apiToCall === 'createGroup'){
                groups.createGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getAllGroups'){
                groups.getAllGroups(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'addMemberToGroup'){
                groups.addMemberToGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }
        else if(apiToCall === 'getMembersOfGroup'){
                groups.getMembersOfGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'deleteMembersOfGroup'){
                groups.deleteMembersOfGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'deleteGroup'){
                groups.deleteGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getAllUsers'){
                users.getAllUsers(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'submitProfile'){
                users.submitProfile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'readallfiles'){
                files.readallfiles(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'createFolder'){
                files.createFolder(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'unStarfile'){
                files.unStarfile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'starFile'){
                files.starFile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'readallStarredfiles'){
                files.readallStarredfiles(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'readRecentfiles'){
                files.readRecentfiles(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getGroupName'){
                groups.getGroupName(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'shareFile'){
                files.shareFile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getAllSharedFile'){
                files.getAllSharedFile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'readFolderForIndividuals'){
                files.readFolderForIndividuals(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'shareFileWithGroup'){
                groups.shareFileWithGroup(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getAllSharedGroupComponents'){
                groups.getAllSharedGroupComponents(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'readFolderForGroups'){
                groups.readFolderForGroups(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'getFilesHistory'){
                files.getFilesHistory(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'downloadFile'){
                files.downloadFile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'upload'){
                files.upload(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'delete'){
                files.deleteFile(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'registration'){
                login.registration(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }else if(apiToCall === 'checkIfAlreadyLoggedIn'){
                users.checkIfAlreadyLoggedIn(data.data, db ,  function(err,res){
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
                            console.log(data);
                        });
                        
                        return;
                })
        }
        


    








    })

        

        
  

   
});


