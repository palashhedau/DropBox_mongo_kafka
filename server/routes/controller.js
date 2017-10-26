var upload = require('express-fileupload');
var fs = require('fs-extra');
var path = require('path')
var path = require('path');
var mime = require('mime');

var bcrypt = require('bcrypt');
var passport = require('passport');
var authenticate = require('../middleware/authenticateMiddleware');
require('../middleware/passport')(passport);
var session = require('express-session');


//mongo connection
var mongoSessionURL = "mongodb://localhost:27017/DropBox_sessions";
var mongo = require("../middleware/mongo");
const MongoStore = require('connect-mongo')(session);
var ObjectID = require('mongodb').ObjectID

//Kafka
var kafka = require('../middleware/kafka/client');


module.exports = function(app , db , connection  ){
	
	app.use(session({
		secret: 'fdghghjhjlfggnhmjmffsfdscdffbvgfgfg',
		  resave: false,
		  saveUninitialized: false,
		  duration: 60 * 60 * 1000,
		  activeDuration: 5 * 6 * 1000,
		  store : new MongoStore({
			  url: mongoSessionURL
		  })
	}))
	app.use(passport.initialize());
	app.use(passport.session());
	
	
	app.use(upload()) ; 
	
	app.post('/checkIfAlreadyLoggedIn' , authenticate , function(req,res){
		 var user = req.user ; 
		 console.log('user ' , user ); 
		 user = new ObjectID(user) ; 
		 
		 var collection = db.collection('users');
		 
		 collection.find({_id : user}).toArray(function(err , result){
			 console.log(result[0]); 
			 if(result[0]){
				 console.log("User already loggedIn ");
				 
				 user  =  { email : result[0].email ,
						fname : result[0].fname ,
							lname : result[0].lname ,
						dob : result[0].dob ,
						gender : result[0].gender} 
						
				console.log('Already logged In ' , user)
				 
				 res.status(200).json({loggedIn : true, user : user}) ; 
			 }else{
				 console.log('No vali session exist ') ; 
				 res.status(200).json({loggedIn : false , user : null })
			 }
		})
	})
	
	
	app.post('/registration' , function(req,res)
	{
		var email = req.body.email ;
		var password = req.body.password ; 
		var fname = req.body.fname ; 
		var lname = req.body.lname ; 
		var dob = req.body.dob ; 
		var gender = req.body.gender  ;
		console.log(email , password , fname , lname , dob , gender );
		
		
		
		var collection = db.collection('users');
		
		collection.find({email : email}).toArray(function(err , result){
			if(err){
				console.log(err)
			}else{
				if(result[0]){
					console.log('User already present ' , result[0]); 
					res.status(200).json({ success : false , error : 'User already present'})
				}else{
					
					
					const saltRounds = 10;
					
					bcrypt.hash(password, saltRounds, function(err, hash) {
						var obj = {email : email ,
								password : hash ,
								fname : fname,
								lname : lname  ,
								dob : dob ,
								gender : gender } ; 
						
						collection.insertOne(obj , function(err , response){
							if(err){
								console.log(err);
								res.status(500).json({success : false , error : error})
							}else{
								res.status(200).json({success : true , error : '' })
							}
						})
					})
					
				}
			}
		})
		
		
	})
		
	
	
	app.post('/createGroup', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var groupname = req.body.groupname ;
		 
		 var apiObject = {"api" : "createGroup" ,
						 "email":email,
						 "groupname":groupname}
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			
			 if(result.grouplist != null ){
				 res.status(result.code).json( { grouplist : result.grouplist } ) ;
			 }else{
				 res.status(result.code).json( {} ) ;
			 }
		})
	})
	
	app.post('/getAllGroups',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 
		 var apiObject = {"api" : "getAllGroups" ,
				 "email":email
				 } ; 
		 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			 if(result.grouplist != null ){
				 res.status(result.code).json( { grouplist : result.grouplist } ) ;
			 }else{
				 res.status(result.code).json( {} ) ;
			 }
			 
		 })
	})
	  
	
	
	
	app.post('/addMemberToGroup',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var emailToAdd = req.body.emailtoadd 
		 var groupname = req.body.groupname ;
		 var group_id = req.body.group_id ; 
		
		var apiObject = {"api" : "addMemberToGroup" ,
							 email : email,
							 emailToAdd : emailToAdd,
							 groupname : groupname ,
							 group_id : group_id 
							 } ; 
		 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			 console.log('result.code ' , result.code) ; 
			 res.status(result.code).json({})
			 
		 })
	})
	
	
	
	 app.post('/getMembersOfGroup',authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ;
		
		 var apiObject = {"api" : "getMembersOfGroup" ,
							 email : email,
							 group_id : group_id 
							 } ; 


		kafka.make_request('dropbox_app',apiObject , function(err,result){
			 console.log("Result " , result ) ; 
				
			 if(result.groupMemberList === null){
				 res.status(result.code).json({})
			 }else{
				 res.status(result.code).json({groupMemberList : result.groupMemberList})
			 }
 
		})
		  
		 
	})
	
	app.post('/deleteMembersOfGroup', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var groupname = req.body.groupname ;
		 var membertodelete = req.body.membertodelete ; 
		 var group_id = req.body.group_id ; 
		 
		 var apiObject = {"api" : "deleteMembersOfGroup" ,
							 email : email,
							 groupname : groupname,
							 membertodelete : membertodelete,
							 group_id : group_id 
						  } ; 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			 if(result.groupMemberList === null){
				 res.status(result.code).json({})
			 }else{
				 res.status(result.code).json({groupMemberList : result.groupMemberList})
			 }
 
		 })
	})
	
	
	 app.post('/deleteGroup', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ;
		 
		 var apiObject = {"api" : "deleteGroup" ,
				 email : email,
				 group_id : group_id 
			  } ; 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			if(result.grouplist === null){
				res.status(result.code).json({})
			}else{
				res.status(result.code).json({grouplist : result.grouplist})
			}
		 })
		 
	})
	
	
	app.post('/getAllUsers', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var apiObject = {"api" : "getAllUsers" ,
				 email : email
			  } 
		 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			 console.log("All users " , result ) ; 
				if(result.allUsers === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({allUsers : result.allUsers})
				}
		})
		 
		 
	})
	
	
	
	
	app.post('/submitProfile', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var about = req.body.about ;
		 var education = req.body.education ;
		 var profession = req.body.profession ;
		 var lifeevents = req.body.lifeevents ;
		
		 var apiObject = {"api" : "submitProfile" ,
				 email : email,
				 about : about , 
				 education : education ,
				 profession : profession ,
				 lifeevents : lifeevents
			  } 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			res.status(result.code).json({})
		})
		 
		 
		 
	})
	 
	 
	app.post('/checkProfileExist',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		
		 var collection = db.collection('profile');
		 
		 collection.find({email : email }).toArray(function(err , result){
			 console.log("Profile XXXXXXXX " , result[0])
			 if(result[0]){
				 res.status(200).json({user : result[0], profileExist : true})
			 }else{
				res.status(200).json({user : result[0] , profileExist : false})
			 }
		 })
	})
	
	
	
	app.post('/getProfile' , authenticate ,  function(req, res) {
		 var email = req.body.email ;
		
		 var apiObject = {"api" : "getProfile" ,
				 email : email,
				} 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			res.status(result.code).json({profile : result.profile});
		})
	})
	
	app.post('/readallfiles', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var path = 'public/Images/'+email;
		 var directory = req.body.directory ; 
		 
		 var apiObject = {"api" : "readallfiles" ,
				 email : email,
				 path : path,
				 directory : directory
				} 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				res.status(result.code).json({filelist : result.filelist});
			})
		
	})
	
	 app.post('/createFolder', authenticate ,  function(req, res) {
		 var email = req.body.email ; 
		 var foldername = req.body.foldername ; 
		 var path = 'public/Images/'+email ; 
		 var directory  = req.body.directory  ; 
		 
		 if(directory === 'root'){
			 var folderPath =  'public/Images/'+email+'/' + foldername;
			 var path = 'public/Images/'+email
		 }else{
			 var folderPath =  'public/Images/'+email+'/' + directory + '/' + foldername ;
			 var path = 'public/Images/'+email + '/' + directory
		 }
		 
			var starred = 0 ; 
			var is_directory = 1 ; 
			
			
			var currentdate = new Date();
			var datetime =  currentdate.getFullYear() + '-' + currentdate.getMonth() + '-' + currentdate.getDay() + " "+ 
			currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			
			var is_deleted = 0 ; 
			
			
			
		 if(!fs.existsSync(path)){
			 fs.mkdirSync(path , 0744);
		 }
			
			
		 if (!fs.existsSync(folderPath)) {
			 fs.mkdirSync(folderPath , 0744);
			 
			 var folderInsertObject = {
					 email : email  ,
					 file_name : foldername  ,
					 starred : starred   , 
					 is_directory : is_directory   ,
					 directory : directory   ,
					 file_add_date : datetime  , 
					 is_deleted : is_deleted  
			 }
			 
			//Kafka code 
			 var apiObject = {"api" : "createFolder" ,
					 email : email,
					 directory : directory,
					 folderInsertObject : folderInsertObject
					}; 
			 
			 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.code === 500){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({recent_files : result.recent_files , filelist : result.filelist})
				}	
			 })
		}else{
			 res.status(400).json({ success : false , error : 'Foolder already present'})
		 }
	})
	
	
	
	app.post('/unStarfile', authenticate ,   function(req, res) {
		 var email = req.body.email; 
		 var file_name = req.body.filename ;
		 var directory = req.body.directory ; 
		 console.log("Unstar " , email ) ; 
		 
		 var apiObject = {"api" : "unStarfile" ,
						 email : email,
						 directory : directory,
						 file_name : file_name
						}; 
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			if(result.code === 500){
				res.status(result.code).json({})
			}else{
				res.status(result.code).json({starred_data : result.starred_data , filelist : result.filelist , recent_files : result.recent_files})
			}
		 })
		 
	})
	
	
	
	
	
	app.post('/starFile', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var file_name = req.body.filename ;
		 var directory = req.body.directory ; 
		 
		 
		 var apiObject = {"api" : "starFile" ,
				 email : email,
				 directory : directory,
				 file_name : file_name
				}; 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.code === 500){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({starred_data : result.starred_data , filelist : result.filelist , recent_files : result.recent_files})
				}
			 })
	})
	
	
	app.post('/readallStarredfiles', authenticate ,   function(req, res) {
			 var email = req.body.email ; 
			 var apiObject = {"api" : "readallStarredfiles" ,
					 email : email,
					};
			 kafka.make_request('dropbox_app',apiObject , function(err,result){
					console.log("Starred Data " , result)
				   if(result.code === 500){
						res.status(result.code).json({})
					}else{
						res.status(result.code).json({starred_data : result.starred_data})
					}
			})
	})
	
	app.post('/readRecentfiles', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		
		 var apiObject = {"api" : "readRecentfiles" ,
				 email : email,
				};
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				console.log("Starred Data " , result)
			   if(result.code === 500){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({recent_items : result.recent_items})
				}
		})
		
	})
	
	
	
	  app.post('/getGroupName',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ; 
		 
		 var apiObject = {"api" : "getGroupName" ,
				 email : email,
				 group_id : group_id
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			if(result.code === 500){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({groupname : result.groupname})
				}
		 })
		 
		 
		
	 })
	
	
	
	app.post('/delete', authenticate ,  function(req, res) {
	var email = req.body.email ; 
	var filename = req.body.filename ; 
	var directory = req.body.directory ; 
	
	if(directory === 'root'){
		var path = 'public/Images/'+email ; 
	}else{
		var path = 'public/Images/'+email + '/' + directory 
	}
	
	//File Folder
	var file = path +'/'+filename;
	
	console.log('Delete called ') ; 
	
	if(fs.statSync(file)) {
		fs.lstat(file, function (err, stats){
			 if(err) throw err ;  
			    else{
			    	 var collection = db.collection('user_files') ; 
			    	 
			    	 collection.find({ email : email  , is_deleted  : 0 , file_name :filename , directory : directory }).toArray(function(err , result){
			    		 console.log('Delete called 2') ; 	
			    		 if(err){
								console.log(err);
								res.status(500).json({})
							} else{
								console.log('Delete called 3') ; 
								if(result[0]){
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
										 		console.log('Delete called 4') ; 
										 		console.log(err)
										 		res.status(500).json({})
										 	}else{
										 		console.log('Delete called 5') ; 
										 		var pathOfUser = path;
										 		if(fs.existsSync(pathOfUser)){
										 			console.log('Delete called 6') ; 
										 			 var collection2 = db.collection('user_shared_files') ; 
										 			 collection2.remove({from_user : email , filename : filename , directory : directory } , function(err , result ){
										 				console.log('Delete called 7') ; 
										 				 if(err ){
										 					 console.log(err);
										 					 res.status(500).json({})
										 				 }else{
										 					console.log('Delete called 8') ; 
										 					var collection3 = db.collection('groups') ; 
										 					collection3.find({ filelist: {$elemMatch : { file_owner  : email , file_directory : directory , filename : filename }} } , function(err , result){
										 						

									 							console.log('Delete called 2') ;
									 							collection3.updateMany({} , {$pull: {filelist : {file_owner  : email , file_directory : directory , filename : filename} }} , function(err , response){
									 								console.log('Delete called 3') ;
									 								if(err){
									 									 console.log(err);
													 					 res.status(500).json({})
									 								}else{
									 									if(stats.isDirectory()){
																			console.log('TO delete is directory ')
																    		fs.remove(file, function(err){
																				  if (err) throw err;
																				  else{}
																			});
																		}else{
																			console.log('TO delete is File  ')
																			fs.unlink(file, function(err){
																				  if (err) throw err;
																				  else{}
																			});
																		}
									 									
									 									collection.find({email : email , is_deleted : 0 , 
										 						 			starred : 1 , directory : directory  }).toArray(function(err , result){
										 						 				if(err){
										 						 					console.log(err);
										 						 					res.status(500).json({})
										 						 				}else{
										 						 					
										 						 					collection.find({email : email , directory : directory , 
										 						 						is_deleted : 0 }).toArray(function(err , result2){
													 						 				if(err){
													 						 					console.log(err);
													 						 					res.status(500).json({})
													 						 				}else{
													 						 				 
													 						 					collection.find({email : email  , 
													 						 						is_deleted : 0 }).toArray(function(err , result3){
																 						 				if(err){
																 						 					console.log(err);
																 						 					res.status(500).json({})
																 						 				}else{
																 						 					res.status(200).json({starred_data : result , filelist : result2 , recent_files : result3})
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
										 		
										 	}
									 })
									
								}
							}
						 })
			    	 
			    }
		})
	}
	
	
});


	app.post('/shareFile', authenticate ,  function(req, res) {
		 var file_name = req.body.filename ;
		 var directory = req.body.directory ; 
		 var fromUser = req.body.fromUser ;
		 var toUser = req.body.toUser ; 
		 var is_directory = req.body.is_directory ; 
		 
		 var apiObject = {"api" : "shareFile" ,
				 file_name : file_name,
				 directory : directory ,
				 fromUser : fromUser,
				 toUser : toUser,
				 is_directory : is_directory
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.success === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({success : result.success})
				}
		 })
		 
	})
	
	
	 app.post('/getAllSharedFile', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		
		 var apiObject = {"api" : "getAllSharedFile" ,
				 email : email 
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.filelist === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({filelist : result.filelist})
				}
		 })
	})
	
	 
	 app.post('/readFolderForIndividuals', authenticate ,  function(req, res) {
		 var email = req.body.email ; 
		 
		 var folderowner = req.body.folderowner ; 
		 var foldername = req.body.foldername ; 
		 var directory = req.body.directory ; 
		 
		 var apiObject = {"api" : "readFolderForIndividuals" ,
				 email : email ,
				 folderowner : folderowner ,
				 foldername : foldername ,
				 directory : directory
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.subGroupContent === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({subGroupContent : result.subGroupContent})
				}
		 })
		 
		 
	})
	 
	 
	
	app.post('/upload' ,  function(req, res) {
		var email = req.body.email ; 
		var starred = 0 ; 
		var is_directory = 0 ; 
		var directoryToUpload = req.body.directory ; 
		
		var currentdate = new Date();
		var datetime =  currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate() + " "+ 
		currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		
		var is_deleted = 0 ; 
		console.log('Palash') ; 
		//File Folder
		if(directoryToUpload === 'root'){
			var path = 'public/Images/'+email;
		}else{
			var path = 'public/Images/'+email+'/' + directoryToUpload;
		}
		
		var collection = db.collection('user_files') ; 
		
		if(req.files){
			console.log('File found from client ') ; 
			var file  = req.files.file ;
			var filename  = file.name ; 
			
			collection.find({email : email , file_name : filename ,directory : directoryToUpload , is_deleted : 0 }).toArray(function(err , result){
				if(result[0]){
					console.log('File already present') ; 
					if (!fs.existsSync(path)){
						fs.mkdirSync(path, 0744); 
					}
					
					if (fs.existsSync(path +'/'+filename)) {
					    console.log('Found file');
					    res.status(400).json({}) ; 
					}else{
						file.mv(path +'/'+filename , function(err){
							if(err){
								console.log(err);
								res.status(400).json({}) ; 
							} 
							else{
								res.status(400).json({}) ; 
								}
							})
					
					
				}
				}else{
					console.log('Doesnt Exist ')
					if (!fs.existsSync(path)){
						fs.mkdirSync(path, 0744); 
					}

					file.mv(path +'/'+filename , function(err){
						if(err)throw err ;
						else{
							
							var insertObj = {
								email : email ,
								file_name : filename,
								starred : starred,
								is_directory : is_directory,
								directory :  directoryToUpload,
								file_add_date : datetime ,
								is_deleted : is_deleted
								}
							
							 collection.insertOne(insertObj , function(err , response ){
								 if(err){
									 console.log(err);
									 res.status(500).json({})
								 }else{
									 if (fs.existsSync(path)) {
										 //Need to write the code 
										 
										 collection.find({email : email , directory : directoryToUpload , is_deleted : 0 }).toArray(function(err , result){
											 if(err){
												 console.log(err);
											 }else{
												 collection.find({ email : email , is_deleted : 0 }).toArray(function(err, result2){
													 res.status(200).json({filelist : result , recent_files : result2})
												 })
											 }
										 })
										 
									 }
								 }
							 })
						}
					})
				}
			})
		}
	});
	
	
	 
	
		
	app.post('/login' , function(req , res){
		
			passport.authenticate('login', function(err, user) {
				console.log('User ' , user ) ; 
		        if(user === false ){
		        	res.status(200).json({loggedIn : false , user : null})
		        }else{
		        	console.log("Login ------ " , user.user_id)
		        	req.login(user.user_id , function(err ){
			        	console.log(' ...Requesting');
			        	res.status(200).json({loggedIn : true , user : user})
			        })
		        }
		        
		    })(req, res)
			
			
	});
		
	
	app.post('/logout' , authenticate ,  function(req , res){
		console.log('Logout called ') ; 
		
		req.logout();
		req.session.destroy();
		res.status(200).json({loggedIn : false , user : null }); 
		
	});
	
	
	 
	 app.post('/shareFileWithGroup', authenticate ,  function(req, res) {
		 var file_owner = req.body.email ;
		 var groupname = req.body.groupname ;
		 var filename = req.body.filename ;
		 var directory = req.body.directory ;
		 var groupowner = req.body.groupowner ; 
		 var is_directory = req.body.isDirectory ; 
		 
		 var apiObject = {"api" : "shareFileWithGroup" ,
				 file_owner : file_owner ,
				 groupname : groupname ,
				 filename : filename ,
				 directory : directory,
				 groupowner : groupowner ,
				 is_directory : is_directory
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.groupFileList === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({groupFileList : result.groupFileList})
				}
		 })
		 
		 
	})
	 
	
	app.post('/getAllSharedGroupComponents', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ; 
		 
		 var apiObject = {"api" : "getAllSharedGroupComponents" ,
				 email : email ,
				 group_id : group_id 
			};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.filelist === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({filelist : result.filelist})
				}
		 })
	})
	
	 app.post('/readFolderForGroups', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var folderowner = req.body.folderowner ; 
		 var foldername = req.body.foldername ; 
		 var directory = req.body.directory ; 
		 
		 var apiObject = {"api" : "readFolderForGroups" ,
				 email : email ,
				 folderowner : folderowner ,
				 foldername : foldername ,
				 directory : directory
			};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.subGroupContent === null){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({subGroupContent : result.subGroupContent})
				}
		 })
		
	})
	
	
	app.post('/getFilesHistory', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var apiObject = {"api" : "getFilesHistory" ,
				 email : email
			};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			 console.log('Files History ' , result.profile);  
			 res.status(result.code).json({profile : result.profile})
		})
		 
	})

	 
	 
	 
	 app.get('/downloadFile',  function(req, res) {
		 var email =  req.query.email;
		 var file =  req.query.file;
		 var directory =  req.query.directory;
		 var fileowner =  req.query.fileowner;
		 
		 if(email === fileowner ){
			 var path = 'public/Images/'+email;
		 }
		 else if(email != fileowner && fileowner != undefined )
		 {
			 var path = 'public/Images/'+fileowner;
		 }
		 else{
			 var path = 'public/Images/'+email;
		 }
		 
		 if(directory === 'root'){
			 path = path + '/' ; 
		 }else{
			 path = path + '/' + directory + '/' ; 
		 }
		 
		 var file = path + file;
		 res.download(file);
	})
	
		
};

	
	
	

passport.serializeUser(function(user_id, done) {
	console.log('serializeUser')  ;
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
		console.log('Deserialize user ');
	    done(null, user_id);
	  
});

