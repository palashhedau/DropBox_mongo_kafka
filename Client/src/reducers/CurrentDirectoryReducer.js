const initialState = {
	
	directory : '' ,
	directoryForServer : ''
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'SET_CURRENT_DIRECTORY' : {
			return {...state , directory : action.payload.directory , 
								directoryForServer : action.payload.directoryForServer }
		}
		default :
			return state ; 

	}


}