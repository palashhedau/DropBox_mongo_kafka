import axios from 'axios' ; 

const headers = {
    'Accept': 'application/json'
};


export function starItems(email , file , directory)  {
	
	
	return function(dispatch){
			fetch('http://localhost:3002/starFile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({filename : file,
							  	directory : directory,
							  	email : email })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )

			      	dispatch({type : 'STAR_FILES' , payload : res});
			      
				})
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'STAR_FILES_FAILURE' , payload : error})
	            
	        })
		}


	
}




export function getAllStarredFiles(email , directory )  {
	 
	return function(dispatch){
			fetch('http://localhost:3002/readallStarredfiles', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ directory : directory,
							  	email : email })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('Stareed Filed  -----------------------------------   ' , res )

			      	dispatch({type : 'GET_STAR_FILES' , payload : res});
			      
				})
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'STAR_FILES_FAILURE' , payload : error})
	            
	        })
		}




}



export function unStarItems(email , filename , directory)  {
	

	return function(dispatch){
			fetch('http://localhost:3002/unStarfile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ email : email ,
		 	filename : filename,
		 	directory : directory  })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	

			      dispatch({type : 'UN_STAR_FILE' , payload : res});
			      
				})
																		        
	   		})
	        .catch(error => {
	           dispatch({type : 'UN_STAR_FILE_FAILURE' , payload : error})
	            
	        })
		}



	
}

