import axios from 'axios'


const headers = {
    'Accept': 'application/json'
};



export function createFolder(email , foldername , directory )  {
	
		return function(dispatch){
			fetch('http://localhost:3002/createFolder', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email ,
		 	foldername : foldername,
		 	directory : directory})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )
					dispatch({type : 'CREATE_FOLDERNAME_SUCCESS' , payload : res })
			      
				})
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'CREATE_FOLDERNAME_FAILURE' , payload : error})
	            
	        })
		}
}