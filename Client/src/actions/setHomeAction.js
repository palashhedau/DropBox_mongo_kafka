import axios from 'axios'

const headers = {
    'Accept': 'application/json'
};




export function setHomeHeading(heading)  {
	
	return {
		type : 'SET_HOME_HEADING' ,
		payload : heading
	}
	
	
}







export function getAllUsers(email  ){
	
		return function(dispatch){
			fetch('http://localhost:3002/getAllUsers', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      	response.json().then(res => {
			      		console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT " , res) ; 
			      	dispatch({type : 'GET_ALL_USERS_SUCCESS' , payload : res });
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
	
}
