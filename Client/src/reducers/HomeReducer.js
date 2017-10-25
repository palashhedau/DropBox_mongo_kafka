const initialState = {
	
	Heading : '',
	getAllUsers : []
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'SET_HOME_HEADING' : {
			return {...state ,  Heading : action.payload }
		}
		case 'GET_ALL_USERS_SUCCESS' : {
			return {...state ,  getAllUsers : action.payload.allUsers }
		}
		default :
			return state ; 

	}


}