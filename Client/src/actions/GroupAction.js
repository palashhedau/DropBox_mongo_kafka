import axios from 'axios' ; 

var some = true ; 

const headers = {
    'Accept': 'application/json'
};

export function createGroup(email , groupname)  {
	
		return function(dispatch){
			fetch('http://localhost:3002/createGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email: email, groupname: groupname})

	  		}).then(function (response) {
			       
			      response.json().then(res => {
			      	console.log('res ' , res )

			      dispatch({type : 'CREATE_GROUP_SUCCESS' , payload :   res.grouplist })
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
	
}


export function deleteGroup(email , groupname , id)  {
	
		return function(dispatch){
			fetch('http://localhost:3002/deleteGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email,
								groupname : groupname,
								group_id : id})

	  		}).then(function (response) {
			       
			      response.json().then(res => {
			      console.log('res ' , res )

			      dispatch({type : 'CREATE_GROUP_SUCCESS' , payload :   res.grouplist })
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
	
}





export function deleteMembersOfGroup(email , membertodelete ,  groupname , id  )  {
	
		return function(dispatch){
			fetch('http://localhost:3002/deleteMembersOfGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email,
								  	groupname : groupname,
								  	membertodelete : membertodelete ,
								  	group_id : id })

	  		}).then(function (response) {
			       
			      response.json().then(res => {
			      	console.log('res ' , res )

			      dispatch({type : 'GET_GROUP_MEMBER_SUCCESS' , payload : res.groupMemberList });
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
	
}








export function getMembersOfGroup(email , id )  {
	
		return function(dispatch){
			fetch('http://localhost:3002/getMembersOfGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email,
	  								group_id : id })

	  		}).then(function (response) {
			       
			   
			    	response.json().then(res => {
			       console.log('ALLLLLLLLL HABAIABAHAIAIAIAI ' , res) ; 
	  				dispatch({type : 'GET_GROUP_MEMBER_SUCCESS' , payload : res.groupMemberList });
			      
				})
			    
			    
																		        
	   		})
	        .catch(error => {
	            console.log('Response after share Error ' , error) ; 
	  		    dispatch({type : 'GET_GROUP_MEMBER_FAILURE' , payload : null})
	            
	        })
		}
	
}







export function addMembersToTheGroup(email , emailtoadd , groupname , id )  {
	
		return function(dispatch){
			fetch('http://localhost:3002/addMemberToGroup', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email: email, emailtoadd : emailtoadd , 
												groupname : groupname,
												group_id : id})

	  		}).then(function (response) {
			       
			      response.json().then(res => {
			      		console.log( res)
	 				 	dispatch({type : 'ADD_MEMBER_SUCCESS' , payload :  null })
			      
				})
																		        
	   		})
	        .catch(error => {
	             dispatch({type : 'ADD_MEMBER_FAILURE' , payload : error})
	            
	        })
		}
	
}






export function getAllGroups(email )  {
	
		return function(dispatch){
			fetch('http://localhost:3002/getAllGroups', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email: email})

	  		}).then(function (response) {
			       
			      response.json().then(res => {
			      	
					dispatch({type : 'GET_ALL_GROUPS_SUCCESS' , payload :  res.grouplist })
			      
				})
																		        
	   		})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}
}









export function getGroupName(groupId)  {
	
	return function(dispatch){
			fetch('http://localhost:3002/getGroupName', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ group_id : groupId })

	  		}).then(function (response) {
			      response.json().then(res => {
			      	console.log("group name " ,  res.groupname)
			      		dispatch({type : 'GET_GROUP_NAME_SUCCESS' , payload :   res.groupname })
			      })
			})
	        .catch(error => {
	             dispatch({type : 'GET_GROUP_NAME_FAILURE' , payload : error})
	            
	        })
		}
}




export function setCurrentGroupFolder(fromEmail , directory , filename ){
	return ({
		type : 'SET_CURRENT_GROUP_FOLDER' , 
		payload : {fromEmail , directory , filename}
	})
}





export function openFolderAndViewContent(email , folderowner ,  foldername)  {
	
	
	
	return function(dispatch){
			fetch('http://localhost:3002/readFolderForGroups', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ email : email,
			folderowner : folderowner,
			foldername : foldername })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )
			      	
			      dispatch({type : 'SET_CURRENT_GROUP_FOLDER_CONTENT_SUCCESS' , payload :    res.subGroupContent })
			      
				})
																		        
	   		})
	        .catch(error => {
	            dispatch({type : 'SET_CURRENT_GROUP_FOLDER_CONTENT_ERROR' , payload : error})
	            
	        })
		}




}













export function getAllSharedGroupComponents(email , groupname )  {
	
	return function(dispatch){
			fetch('http://localhost:3002/getAllSharedGroupComponents', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ email : email,
	  			group_id : groupname })

	  		}).then(function (response) {
			        console.log("Response from server " , response);
			      response.json().then(res => {
			      	console.log('res ' , res )
			      	
			      dispatch({type : 'GET_GROUP_SHARED_FILE_SUCCESS' , payload : res.filelist });
			      
				})
																		        
	   		})
	        .catch(error => {
	            
	            dispatch({type : 'GET_GROUP_SHARED_FILE_FAILURE' , payload : error})
	        })
		}



}








