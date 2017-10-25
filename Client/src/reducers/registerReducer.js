const initialState = {
	
	registered : false ,
	error : false 
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'REGISTRATION_SUCCESS' : {
			return {...state , registered : action.payload.success , 
								error : action.payload.error }
		}
		case 'REGISTRATION_FALIURE' : {
			return {...state ,  error : action.payload }
		}
		case 'SET_BACK_REGISTERED' : {
			return {...state , registered : action.payload.success }
		}
		default :
			return state ; 

	}
	
}