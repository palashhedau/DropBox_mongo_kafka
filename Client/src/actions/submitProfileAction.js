import axios from 'axios';

const headers = {
    'Accept': 'application/json'
};




export function submitProfile(email , about , education , profession , lifeevents )  {
	
	return function(dispatch){
			fetch('http://localhost:3002/submitProfile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email,
							  	about : about,
							  	education : education,
							  	 profession : profession , 
							  	 lifeevents : lifeevents})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	dispatch({type : 'PROFILE_ADD_SUCCESS' , payload : null});

			    })
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'PROFILE_ADD_FAILURE' , payload : error})
	            
	        })
		}
}


export function updateProfile(email , about , education , profession , lifeevents )  {
	
	console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP ', email , about , education , profession , lifeevents)

	return  function(dispatch){
		 axios.post('http://localhost:3002/updateProfile', {
	  	email : email,
	  	about : about,
	  	education : education,
	  	 profession : profession , 
	  	 lifeevents : lifeevents
	  })
	  .then(function (response) {
	  
	  	
	  	dispatch({type : 'PROFILE_EDIT_SUCCESS' , payload : null});
	  })
	  .catch(function (error) {
	   dispatch({type : 'PROFILE_EDIT_FAILURE' , payload : error})
	  })
	}
	
}

export function getProfile(email  )  {
	
	console.log('Email to get ptofilr ' , email ) ; 

	return function(dispatch){
			fetch('http://localhost:3002/getProfile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email})

	  		}).then(function (response) {
			        
			      response.json().then(res => {
			      	console.log('Profile ' , res ) ; 
			      dispatch({type : 'GET_PROFILE_SUCCESS' , payload : res});

			    })
																		        
	   		})
	        .catch(error => {
	          dispatch({type : 'GET_PROFILE_FAILURE' , payload : error})
	            
	        })
		}
}


export function checkProfileExist(email)  {
	
	return function(dispatch){
			fetch('http://localhost:3002/checkProfileExist', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email})

	  		}).then(function (response) {
			        
			      response.json().then(res => {
			      dispatch({type : 'CHECK_PROFILE_SUCCESS' , payload :  res });

			    })
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'PROFILE_ADD_FAILURE' , payload : error})
	            
	        })
		}
	
}