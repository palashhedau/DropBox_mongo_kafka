const initialState = {
	
	historyItems : []
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'HISTORY_OBJECT_SUCCESS' : {
			return {...state , historyItems :  action.payload.profile }
		}
		default :
			return state ; 

	}


}