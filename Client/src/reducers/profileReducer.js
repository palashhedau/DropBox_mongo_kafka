const initialState = {
	
	profile : null ,
	profile_details : {} ,
	profileExist : false 
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'GET_PROFILE_SUCCESS' : {
			return {...state ,  profile : action.payload.profile }
		}
		case 'CHECK_PROFILE_SUCCESS' : {
			return {...state ,  profile_details : action.payload.user ,
								profileExist : action.payload.profileExist }
		}
		default :
			return state ; 

	}


}