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
		 
		 console.log('Palash');
		 
		 var collection = db.collection('groups');
		 collection.find({groupowner : email , groupname : groupname }).toArray(function(err , result){
			 if(result[0]){
				 console.log('Group exist ')
			 }else{
				
				var obj = {
						 groupowner : email ,
						 group_name : groupname ,
						 members : 
							 [ {"email"  : email , "group_owner" : email } ],
				} ; 
				 
				 collection.insertOne(obj , function(err , response){
					 if(err){
						 console.log(err) ;
					 }else{
						// Fetching the groups for the users 
						 var collection = db.collection('groups');
						 collection.find({members : {$elemMatch : { email : email } }}).toArray(function(err , response){
							 if(err){
								 console.log(err);
								 res.status(200).json({})
							 }else{
								 console.log('Users group ' , response ) ; 
								 res.status(201).json({grouplist : response })
							 }
						 })
					 }
				 })
			 }
		 })
	})
	
	app.post('/getAllGroups',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 
		 var collection = db.collection('groups');
		 collection.find({members : {$elemMatch : { email : email } }}).toArray(function(err , response){
			 if(err){
				 console.log(err);
				 res.status(200).json({})
			 }else{
				 console.log('Users group ' , response ) ; 
				 res.status(201).json({grouplist : response })
			 }
		 })
	})
	  
	app.post('/addMemberToGroup',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var emailToAdd = req.body.emailtoadd 
		 var groupname = req.body.groupname ;
		 var group_id = req.body.group_id ; 
		 console.log('Before query ') ; 
		 
		 group_id = new ObjectID(group_id) ;
		 console.log('GroupID ' , group_id) ; 
		 console.log(email , emailToAdd , groupname ) ; 
		 
		 
		 
		 
		 var collection = db.collection('groups');
		 collection.find({_id : group_id , members: {$elemMatch : { email : emailToAdd }} }).toArray(function(err , response){
			 if(response[0]){
				 res.status(401).json({})
			 }else{
				 console.log('User not present , need to add ') ; 
				 var emailToAddObj = {
						email: emailToAdd , "group_owner" : email 
				 } ;
				 
				 collection.update({_id : group_id} , {$addToSet: {members : emailToAddObj }} , function(err , response ){
					 if(err){
						 console.log(err)
					 }else{
						 res.status(201).json({}) ; 
					 }
				 })
			 }
		 })
	})
	
	
	
	 app.post('/getMembersOfGroup',authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ;
		
		 group_id = new ObjectID(group_id) 
		  
		 var collection = db.collection('groups');
		 
		 collection.find({_id : group_id } , {members : 1 }).toArray(function(err , response ){
			if(err){
				console.log(error);
				res.status(500).json({})
			}else{
				if(response[0]){
					
					res.status(200).json({groupMemberList  : response[0].members })
				}
			}
		})
	})
	
	app.post('/deleteMembersOfGroup', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var groupname = req.body.groupname ;
		 var membertodelete = req.body.membertodelete ; 
		 var group_id = req.body.group_id ; 
		 
		 console.log('Memeber to delete ' , email , groupname , membertodelete  , group_id ) ; 
		 group_id = new ObjectID(group_id) 
		 var collection = db.collection('groups');
		 
		 collection.find({_id : group_id , members: {$elemMatch : { email : membertodelete }}  }).toArray(function(err , response ){
				if(err){
					console.log(error);
					res.status(500).json({})
				}else{
					if(response[0]){
						//group found 
						console.log('Group and member found ') ; 
						 var emailToAddObj = {
									email: membertodelete , "group_owner" : email 
							 } ;
						collection.update({_id : group_id} , {$pull: {members : emailToAddObj }} , function(err , response){
							if(err){
								console.log(error)
							}else{
								console.log('Deleted fuccessfully ') ; 
								 
								 collection.find({_id : group_id } , {members : 1 }).toArray(function(err , response ){
									if(err){
										console.log(error);
										res.status(500).json({})
									}else{
										if(response[0]){
											
											res.status(200).json({groupMemberList  : response[0].members })
										}
									}
								})
							}
						})
						
					}
				}
			})
	})
	
	
	 app.post('/deleteGroup', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var groupname = req.body.groupname ;
		 var group_id = req.body.group_id ;
		 
		 group_id = new ObjectID(group_id) 
		 var collection = db.collection('groups');
		 
		 collection.remove({_id : group_id } , function(err , response ){
			 if(err){
				 console.log(err)
			 }else{
				 var collection = db.collection('groups');
				 collection.find({members : {$elemMatch : { email : email } }}).toArray(function(err , response){
					 if(err){
						 console.log(err);
						 res.status(200).json({})
					 }else{
						 console.log('Users group ' , response ) ; 
						 res.status(201).json({grouplist : response })
					 }
				 })
			 }
		 })
	})
	
	
	app.post('/getAllUsers', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 
		 var collection = db.collection('users');
		 
		 collection.find({"email" : {$ne : email }} , {"email" : 1 }).toArray(function(err , result){
			 if(err){
				 console.log(err);
				 res.status(500).json({})
			 }else{
				 console.log("Users " , result.length ) ;
				 res.status(200).json({allUsers : result })
			 }
		 })
	})
	
	
	
	
	app.post('/submitProfile', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var about = req.body.about ;
		 var education = req.body.education ;
		 var profession = req.body.profession ;
		 var lifeevents = req.body.lifeevents ;
		
		 
		 
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
							 console.log(err);
							 res.status(500).json({})
						 }else{
							 res.status(200).json({})
						 }
					 })
				 }
			 }
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
		
		 console.log(email ) ; 
		 
		 var collection = db.collection('profile') ; 
		 
		 collection.find({email : email }).toArray(function(err , result){
			 console.log("Result " , result [0]) ; 
			 if(result[0]){
				 console.log("Profile " , result[0]); 
				 res.status(200).json({ profile : result[0] })
			 }else{
				 res.status(200).json({ profile : null })
			 }
		 })
		 
		 
	})
	
	app.post('/readallfiles', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var path = 'public/Images/'+email;
		 var directory = req.body.directory ; 
		 
		 
		 var collection = db.collection('user_files') ;  
		 
		 collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err, result){
			 if(err){
				 console.log(err)
			 }else{
				 res.status(200).json({filelist : result})
			 }
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
			 
			 var collection = db.collection('user_files') ;
			 
			 collection.insertOne(folderInsertObject , function(err , result){
				 if(err){
					 console.log(err);
					 res.status(500).json({})
				 }else{
					 collection.find({email : email , directory : directory , is_deleted : 0 }).toArray(function(err , result){
						 if(err){
							 console.log(err);
						 }else{
							 collection.find({ email : email , is_deleted : 0 }).toArray(function(err, result2){
								 res.status(200).json({filelist : result , recent_files : result2})
							 })
						 }
					 })
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
		 console.log('Directory ' , directory )
		 
		  var collection = db.collection('user_files') ; 
		 
		 
		 collection.find({ email : email , file_name : file_name  , 
			 			 directory : directory , is_deleted : 0 }).toArray(function(err , result){
			 				if(err){
			 					 console.log(err);
			 					res.status(500).json({})
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
			 					 
			 				 }
			 			 })
		 
		 
	})
	
	
	
	
	
	app.post('/starFile', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var file_name = req.body.filename ;
		 var directory = req.body.directory ; 
		 
		 var collection = db.collection('user_files') ; 
		 
		 
		 collection.find({ email : email , file_name : file_name  , 
			 			 directory : directory , is_deleted : 0 }).toArray(function(err , result){
			 				 if(err){
			 					 console.log(err);
			 					res.status(500).json({})
			 				 }else{
			 					 console.log('Starred ' , result[0].starred)
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
			 				}
			 			 })
	})
	
	
	app.post('/readallStarredfiles', authenticate ,   function(req, res) {
			 var email = req.body.email ; 
			 var collection = db.collection('user_files') ; 
			 
			 collection.find({starred : 1 , email : email  , is_deleted  : 0 }).toArray(function(err , result){
				if(err){
					console.log(err);
					res.status(500).json({})
				} else{
					 res.status(200).json({starred_data : result})
				}
			 })
	})
	
	app.post('/readRecentfiles', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var collection = db.collection('user_files') ; 
		 
		 collection.find({ email : email  , is_deleted  : 0 }).toArray(function(err , result){
				if(err){
					console.log(err);
					res.status(500).json({})
				} else{
					
					 res.status(200).json({recent_items : result})
				}
			 })
		
	})
	
	
	
	  app.post('/getGroupName',authenticate ,   function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ; 
		 
		 console.log('Group id')
		 
		 group_id = new ObjectID(group_id) ;
		 
		 
		 
		 var collection = db.collection('groups') ; 
		 
		 collection.find({_id : group_id } ,  {group_name : 1 }).toArray(function(err, result){
			 if(err){
				 console.log(err);
				 res.status(500).json({})
			 }else{
				 res.status(200).json({groupname : result[0].group_name})
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
		 
		 var collection = db.collection('user_shared_files') ; 
		 
		 collection.find({from_user : fromUser , to_email : toUser , 
			 			filename : file_name , directory : directory ,
			 			is_directory : is_directory }).toArray(function(err , result){
			 if(err){
				 console.log(error);
				 res.status(500).json({})
			 }else{
				 if(result[0]){
					 res.status(400).json({})
				 }else{
					 var shareObj = {from_user : fromUser ,
							 	to_email : toUser , 
					 			filename : file_name ,
					 			directory : directory,
					 			is_directory : is_directory}
					 collection.insert(shareObj , function(err , response){
						 if(err){
							 console.log(error);
							 res.status(500).json({})
						 }else{
							 res.status(200).json({success : true})
						 }
					 })
				 }
			 }
			 				
		 })
		 
	})
	
	
	 app.post('/getAllSharedFile', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		
		 var collection = db.collection('user_shared_files') ; 
		 
		 collection.find({to_email : email }).toArray(function(err , result){
			 if(err){
				 console.log(err);
				 res.status(500).json({})
			 }else{
				 res.status(200).json({filelist : result})
			 }
		 })
		 
	 })
	
	 
	 app.post('/readFolderForIndividuals', authenticate ,  function(req, res) {
		 var email = req.body.email ; 
		 
		 var folderowner = req.body.folderowner ; 
		 var foldername = req.body.foldername ; 
		 var directory = req.body.directory ; 
		 
		 var collection = db.collection('user_files') ; 
		 
		 collection.find({email : folderowner , directory : foldername }).toArray(function(err , result){
			 if(err){
				 console.log(err);
				 res.status(200).json({})
			 }else{
				 res.status(200).json({subGroupContent : result})
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
		 
		 var collection = db.collection('groups');
		
		 
		 
		 collection.find({groupowner : groupowner , group_name : groupname , 
			 filelist: {$elemMatch : { group_name : groupname ,file_owner :file_owner ,filename: filename ,
				 file_directory : directory , group_owner : groupowner , is_directory : is_directory }} }).toArray(function(err , response){
			 if(response[0]){
				 res.status(401).json({})
			 }else{
				 console.log('File not shared  , need to add ') ; 
				 var shareFileAdd = {
						 group_name : groupname ,
						 file_owner :file_owner ,
						 filename: filename ,
						 file_directory : directory ,
						 group_owner : groupowner,
						 is_directory : is_directory
				 } ;
				 
				 collection.update({groupowner : groupowner , group_name : groupname} , {$addToSet: {filelist : shareFileAdd }} , function(err , response ){
					 if(err){
						 console.log(err)
					 }else{
						
						 collection.find({groupowner : groupowner , group_name : groupname}).toArray(function(err , result){
							 if(err ){
									console.log('Error while fetching data ' , err);
									res.status(500).json({})
								} 
								else{
									res.status(200).json({groupFileList : result})
								}
						 })
						 
					 }
				 })
			 }
		 })
	})
	 
	
	app.post('/getAllSharedGroupComponents', authenticate ,  function(req, res) {
		 var email = req.body.email ;
		 var group_id = req.body.group_id ; 
		 group_id = new ObjectID(group_id) 
		 
		 var collection = db.collection('groups');
		 
		 collection.find({_id : group_id } , {filelist : 1 }).toArray(function(err , response ){
			if(err){
				console.log(error);
				res.status(500).json({})
			}else{
				if(response[0]){
					console.log("Shared component " ,  response.length ) ; 
					if(response[0].filelist == null ){
						res.status(200).json({filelist  : [] })
					}else{
						res.status(200).json({filelist  : response[0].filelist })
					}
					
				}
			}
		})
		
		
	 })
	
	 app.post('/readFolderForGroups', authenticate ,   function(req, res) {
		 var email = req.body.email ; 
		 var folderowner = req.body.folderowner ; 
		 var foldername = req.body.foldername ; 
		 var directory = req.body.directory ; 
		 
		 
		 var collection = db.collection('user_files') ; 
		 
		 collection.find({email : folderowner , directory : foldername }).toArray(function(err , result){
			 if(err){
				 console.log(err);
				 res.status(200).json({})
			 }else{
				 res.status(200).json({subGroupContent : result})
			 }
		 })
	})
	
	
	app.post('/getFilesHistory', authenticate ,   function(req, res) {
		 var email = req.body.email ;
		
		 var collection = db.collection('user_files') ;
		 
		 collection.find({is_deleted : 1 ,email : email  }).toArray(function(err , result){
			 if(err){
				 console.log(err);
				 res.status(500).json({ profile : 'Error while getting profile ' })
			 }else{
				 res.status(200).json({ profile : result })
			 }
		 })
	})

	 
	 
	 
	 app.get('/downloadFile',  function(req, res) {
		 var email =  req.query.email;
		 var file =  req.query.file;
		 var directory =  req.query.directory;
		 var fileowner =  req.query.fileowner;
		 console.log(email , file , directory , fileowner) ; 
		 
		 
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
		 
		 
		 console.log('Path ' , path ) ; 
		 
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

