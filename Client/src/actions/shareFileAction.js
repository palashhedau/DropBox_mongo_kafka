import axios from 'axios'



const headers = {
    'Accept': 'application/json'
};




export function shareFile(filename , directory , fromUser , toUser , is_directory )  {
	
	console.log("SGaring " , is_directory);
		return function(dispatch){
			fetch('http://localhost:3002/shareFile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({	filename : filename,
							  	directory : directory,
							  	fromUser : fromUser ,
							  	 toUser : toUser,
							  	 is_directory : is_directory })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			       response.json().then(res => {
			      	
			      	dispatch({type : 'SHARE_FILE_SUCCESS' , payload : null });
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	             dispatch({type : 'SHARE_FILE_ERROR' , payload : null})
	            
	        })
		}
}



export function getAllSharedComponents(email )  {
	
	return function(dispatch){
			fetch('http://localhost:3002/getAllSharedFile', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({	email : email})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			       response.json().then(res => {
			      	
			      	dispatch({type : 'GET_SHARED_FILE_SUCCESS' , payload : res.filelist });
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            dispatch({type : 'GET_SHARED_FILE_FAILURE' , payload : null})
	            
	        })
		}



}





export function shareFileInGroup(email , groupname , filename , directory , is_directory )  {
	
	var group = groupname.substring(0,groupname.indexOf('- ')-1)
	var owner = groupname.substring(groupname.indexOf('- ')+2 ,groupname.length )

	return function(dispatch){
			fetch('http://localhost:3002/shareFileWithGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ email : email,
								  	groupname : group,
								  	filename : filename,
								  	directory : directory,
								  	groupowner :  owner ,
								  	isDirectory : is_directory})

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )
			     dispatch({type : 'GET_SHARED_FILE_WITH_GROUP_SUCCESS' , payload : null });
			      
				})
																		        
	   		})
	        .catch(error => {
	            
	             dispatch({type : 'GET_SHARED_FILE_WITH_GROUP_FAILURE' , payload : null})
	        })
		}






}




export function setCurrentShared(email ){
	return {
		type : 'SET_SHARED_USER_FILES' ,
		payload : email
	}
}

export function openFolderAndViewContentIndividual(email , folderowner ,  foldername)  {
	
	
	return function(dispatch){
			fetch('http://localhost:3002/readFolderForIndividuals', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email,
			folderowner : folderowner,
			foldername : foldername  })

	  		}).then(function (response) {
			      response.json().then(res => {
			      	dispatch({type : 'SET_CURRENT_INDIVIDUAL_FOLDER_CONTENT_SUCCESS' , payload :    res  })
			      })
			})
	        .catch(error => {
	            console.log("This is error");
	             dispatch({type :  'SET_CURRENT_INDIVIDUAL_FOLDER_CONTENT_ERROR' , payload : error})
	        })
		}


	
}