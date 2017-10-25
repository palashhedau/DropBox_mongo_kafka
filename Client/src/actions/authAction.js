import axios from 'axios'
import  setAuthorizationToken from '../utils/setAuthorizationToken'
import jwt from 'jsonwebtoken' ; 

const headers = {
    'Accept': 'application/json'
};





export function checkUser(email , password ){
	
		return function(dispatch){
			fetch('http://localhost:3002/login', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({username: email, password: password})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )

			      	if(res.user === null){
			      		dispatch({ type : 'UNSUCCESSFUL_LOGIN' , payload : { userFound : res.loggedIn }} )
			      	}else{
			      		dispatch({ type : 'SET_CURRENT_USER' , payload : { userFound : res.loggedIn , user : res.user}} )
			      	}
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
	
}





export function logout()  {
	

	return function(dispatch){
			fetch('http://localhost:3002/logout', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include'
			}).then(function (response) {
			   
				 response.json().then(res => {
			      dispatch({ type : 'SET_CURRENT_USER_LOGOUT' , payload : {userFound : res.loggedIn }}) ;
			    })
	
			})
	        .catch(error => {
	            console.log("This is error");
	        })
		}


	
}




export function checkIfAldreadyLoggedIn()  {
	
	console.log('checkIfAldreadyLoggedIn') ; 
	return function(dispatch){
			fetch('http://localhost:3002/checkIfAlreadyLoggedIn', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include'
			}).then(function (response) {
			   
			   response.json().then(res => {
			      	console.log('res ' , res )

			      	if(res.user === null){
			      		dispatch({ type : 'UNSUCCESSFUL_LOGIN' , payload : { userFound : res.loggedIn }} )
			      	}else{
			      		dispatch({ type : 'SET_CURRENT_USER' , payload : { userFound : res.loggedIn , user : res.user}} )
			      	}
			      
				})
				
			})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}

}



