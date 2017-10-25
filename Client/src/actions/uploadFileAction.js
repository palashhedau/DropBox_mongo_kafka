import axios from 'axios'

const headers = {
    'Accept': 'application/json'
};

export function uploadFile(email , file , name , directory )  {
	 
	console.log('Upload Called ' , email , file  , name , directory ) ; 
	let data = new FormData();
	data.append('email', email);
  	data.append('file', file);
  	data.append('name', name);
  	data.append('directory', directory);
  	

	return  function(dispatch){
		 axios.post('http://localhost:3002/upload' , data  )
	  .then(function (response) {
	  	console.log("Response after upload " , response.data)
	  	dispatch({type : 'FILE_UPLOAD_SUCCESS' , payload : response.data})
	  })
	  .catch(function (error) {
	    dispatch({type : 'FILE_UPLOAD_FALIURE' , payload : error})
	  })
	}
}



export function getRecentFiles(email   )  {
	
	 
	return function(dispatch){
			fetch('http://localhost:3002/readRecentfiles', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email  })

	  		}).then(function (response) {
			      response.json().then(res => {
			      	console.log("///////////////////////////+++++++++++++++++++ " , res )
			      	dispatch({type : 'GET_RECENT_FILES_SUCCESS' , payload : res})
			      })
			})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}



}



export function getAllFiles(email , foldername , directory )  {
	 
	
	let data = new FormData();
  	data.append('email', email);
  	data.append('foldername', foldername);
  	data.append('directory', directory);
  	
  	return function(dispatch){
			fetch('http://localhost:3002/readallfiles', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({email : email , foldername : foldername , directory : directory })

	  		}).then(function (response) {
			      

			      response.json().then(res => {
			      	console.log('res ' , res )
			      	console.log("---------------------------- " , res)
			      	dispatch({type : 'GET_ALL_FILES_SUCCESS' , payload :  res.filelist}) ; 
			      })


			})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}

}


export function deleteFile(email , filename , directory  )  {
	
	return function(dispatch){
			fetch('http://localhost:3002/delete', {
	        method: 'POST',
	        headers: {
	            ...headers,
	            'Content-Type': 'application/json'
	        },
	        credentials:'include',
	   	    body: JSON.stringify({ email : email ,
		 	filename : filename ,
		 	directory : directory })

	  		}).then(function (response) {
			      

			      response.json().then(res => {
			      	dispatch({type : 'DELETE_FILE_SUCCESS' , payload : res})
			      })


			})
	        .catch(error => {
	            console.log("This is error");
	            
	        })
		}

}



