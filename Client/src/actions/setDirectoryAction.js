

export function setDirectory(directory)  {
	
	
	return ({
		type : 'SET_CURRENT_DIRECTORY' ,
		payload : { directory : directory === 'root' ? '' : directory, 
			directoryForServer  : directory }
	})
}


