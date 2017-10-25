const initialState = {
	
	getAllGroups : [],
	error : null ,
	groupmembers : [],
	sharedCurrentGroup : {} ,
	sharedCurrentGroupContents : [] ,
	groupname : ''
}


export default function reducer (state=initialState , action )  {
	switch(action.type){
		case 'GET_ALL_GROUPS_SUCCESS' : {
			return {...state ,  getAllGroups : action.payload }
		}
		case 'GET_ALL_GROUPS_FAILURE' : {
			return {...state ,  error : action.payload }
		}
		case 'CREATE_GROUP_SUCCESS' : {
			return {...state ,  getAllGroups : action.payload }
		}
		case 'CREATE_GROUP_FAILURE' : {
			return {...state ,  error : action.payload }
		}
		case 'SET_CURRENT_GROUP_FOLDER' : {
			return {...state ,  sharedCurrentGroup : action.payload }
		}
		case 'SET_CURRENT_GROUP_FOLDER_CONTENT_SUCCESS' : {
			return {...state ,  sharedCurrentGroupContents : action.payload }
		}
		case 'GET_GROUP_NAME_SUCCESS' : {
			return {...state ,  groupname : action.payload }
		}
		default :
			return state ; 

	}


}