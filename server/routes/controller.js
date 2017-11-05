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

var FileReader = require('filereader');
const splitFile = require('split-file');

//Mongoose 
var mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let conn = mongoose.connection ; 
Grid.mongo = mongoose.mongo ;
let gfs ; 

//Buffer 
var JSONB = require('json-buffer')
var Buffer2 = require('buffer').Buffer

var CHUNK_SIZE = 100 * 1024;


module.exports = function(app , db , connection  ){
	
	gfs = Grid(db);
	
	
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
	
	app.post('/upload' , authenticate ,    function(req, res) {
		var email = req.body.email ; 
		var starred = 0 ; 
		var is_directory = 0 ; 
		var directoryToUpload = req.body.directory ; 
		
		var currentdate = new Date();
		var datetime =  currentdate.getFullYear() + '-' + (currentdate.getMonth()+1) + '-' + currentdate.getDate() + " "+ 
		currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		
		var is_deleted = 0 ; 
		
		var file = req.files.file ;
		var fileBuffer = new Buffer(file.data).toString('base64') ;
		
		var chunks = SplitFileIntoArray(fileBuffer) ;
		
		
		var apiObject = {"api" : "upload" ,
				 email : email,
				 starred : starred ,
				 is_directory : is_directory,
				 directoryToUpload : directoryToUpload ,
				 datetime : datetime ,
				 is_deleted : is_deleted , 
				 filename : req.files.file.name,
				 mimetype : req.files.file.mimetype
				}
 
		 kafka.makeChunkedRequest('dropbox_app',apiObject , chunks , function(err,result){
			if(result.code === 200){
				res.status(result.code).json({filelist : result.filelist , recent_files : result.recent_files})
			}else{
				res.status(result.code).json({})
			}
		})
	});
	
	
	
	
	app.post('/checkIfAlreadyLoggedIn' , authenticate , function(req,res){
		 var user = req.user ; 
		 
		 var apiObject = {"api" : "checkIfAlreadyLoggedIn" ,
				 user : user 
				} ; 
 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			res.status(result.code).json({loggedIn : result.loggedIn , user : result.user})
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
		
		
		
		 var apiObject = {"api" : "registration" ,
				 email : email,
				 password : password ,
				 fname : fname,
				 lname : lname ,
				 dob : dob ,
				 gender : gender 
				};
 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			res.status(result.code).json({success : result.success , error : result.error });
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
		 
		 	var starred = 0 ; 
			var is_directory = 1 ; 
			
			
			var currentdate = new Date();
			var datetime =  currentdate.getFullYear() + '-' + currentdate.getMonth() + '-' + currentdate.getDay() + " "+ 
			currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			
			var is_deleted = 0 ; 
			
			var folderInsertObject = {
					 email : email  ,
					 file_name : foldername  ,
					 starred : starred   , 
					 is_directory : is_directory   ,
					 directory : directory   ,
					 file_add_date : new Date()  , 
					 is_deleted : is_deleted  
			 }
			 
			
			 var apiObject = {"api" : "createFolder" ,
					 email : email,
					 directory : directory,
					 folderInsertObject : folderInsertObject,
					 file_name : foldername  ,
					 starred : starred   , 
					 is_directory : is_directory   ,
					 is_deleted : is_deleted  
					}; 
			 
			 kafka.make_request('dropbox_app',apiObject , function(err,result){
				if(result.code === 500){
					res.status(result.code).json({})
				}else{
					res.status(result.code).json({recent_files : result.recent_files , filelist : result.filelist})
				}	
			 }) 
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
		
		
		 var apiObject = {"api" : "delete" ,
				 email : email,
				 filename : filename ,
				 directory : directory
				};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			if(result.code = 200){
				res.status(200).json({starred_data : result.starred_data , filelist : result.filelist , recent_files : result.recent_files})
			}
		 })
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

	 
	 
	 
	 app.get('/downloadFile' ,authenticate ,   function(req, res) {
		 var email =  req.query.email;
		 
		 var file =  req.query.file;
		 var directory =  req.query.directory;
		 var fileowner =  req.query.fileowner;
		 
		 console.log(fileowner , file , directory ) ; 
		
		 if(email === fileowner ){
			 email = email ;
		 }
		 else if(email != fileowner && fileowner != undefined )
		 {
			email =  fileowner
		 }
		 else{
			email =  email 
		 }
		 
		 console.log(email );
		 console.log(fileowner);
		 
		 var apiObject = {"api" : "downloadFile" ,
				 email : email,
				 file : file ,
				 directory : directory
			};
		 
		 kafka.make_request('dropbox_app',apiObject , function(err,result){
			if(!err){
				 res.end(new Buffer(result));
			}
		})
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
