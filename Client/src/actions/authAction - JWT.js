import axios from 'axios'
import  setAuthorizationToken from '../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken' ; 

export function checkUser(username , password)  {
	
	return  function(dispatch){
		 fetch.post('http://localhost:3002/validateUser', {
	  	password : password , 
	  	username : username
	  })
	  .then(function (response) {
	  	console.log('Response ' , response) ; 
	  	

	  	


	  	const token = response.data.token ; 
	  	localStorage.setItem('jwtToken', token);
	  	setAuthorizationToken(token) ; 
	  
		dispatch({type : 'SET_CURRENT_USER' , payload : jwt.decode(token)})
	  })
	  .catch(function (error) {
	   dispatch({type : 'CHECKUSER_REJECTED' , payload : error})
	  })
	}
}



export function logout()  {
	localStorage.removeItem('jwtToken');
	setAuthorizationToken(false) ; 
	return  { type : 'SET_CURRENT_USER' , payload : null }
}



