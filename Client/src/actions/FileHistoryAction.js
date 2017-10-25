import axios from 'axios' ; 

const headers = {
    'Accept': 'application/json'
};


export function getHistoryItems(email )  {
	

	return function(dispatch){
			fetch('http://localhost:3002/getFilesHistory', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )
			      	dispatch({type : 'HISTORY_OBJECT_SUCCESS' , payload : res});
			      
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}


	
}
