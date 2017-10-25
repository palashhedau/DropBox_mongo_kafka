
module.exports = function(req,  res , next ){ 
		console.log("Authenticated " , req.isAuthenticated()) ; 
	    if(req.isAuthenticated()){
			return next();
		}else{
			res.status(403).json({loggedIn : false , user : null});
		}
}