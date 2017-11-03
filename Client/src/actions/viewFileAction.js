import axios from 'axios' ; 
import FileSaver  from 'file-saver' ; 

var some = true ; 

const headers = {
    'Accept': 'application/json'
};


export function viewFile(email , file , directory )  {
	console.log("WALLLAAAAA")
	axios.get('http://localhost:3002/downloadFile',{responseType: 'blob',  params: {
		      email: email,
		      file : file ,
		      directory : directory
		    },
		    withCredentials: true
	  })
	  .then(function (response) {
	  	
	    console.log("Response for new download ") ; 
	    console.log(response) ; 
		FileSaver.saveAs(response.data, file);
	    	

	  })
	  .catch(function (error) {
	   		
	  })
}





export function viewFileForGroup(email , fileowner , file , directory )  {
	
	axios.get('http://localhost:3002/downloadFile',{responseType: 'blob',  params: {
		      email: email,
		      file : file ,
		      directory : directory,
		      fileowner : fileowner
		    },
		    withCredentials: true
	  })
	  .then(function (response) {
	  	
	    console.log(response)
		FileSaver.saveAs(response.data, file);
	    	

	  })
	  .catch(function (error) {
	   		
	  })






	
	
}