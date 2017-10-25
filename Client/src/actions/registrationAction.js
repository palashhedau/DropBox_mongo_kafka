import axios from 'axios'

export function register(email , password, fname , lname , gender , dob)  {
	
	console.log('Elements ' , email , password , fname , lname , dob , gender ) ; 


	return  function(dispatch){
		 axios.post('http://localhost:3002/registration', {
	  	email : email , password : password , fname : fname  
	  	, lname : lname  , gender : gender  , dob : dob
	  })
	  .then(function (response) {
	  	console.log('Response ' , response) ; 
	  	
	  	dispatch({type : 'REGISTRATION_SUCCESS' , payload : response.data});
	  })
	  .catch(function (error) {
	  	console.log(error) ; 
	   dispatch({type : 'REGISTRATION_FALIURE' , payload : true})
	  })
	}
}



export function setBackRegistered(){
	return {
		type : 'SET_BACK_REGISTERED',
		payload : {success : false }
	}
}