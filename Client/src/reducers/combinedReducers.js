import { combineReducers  } from 'redux';
import AuthReducer from './authReducer';
import fileUploadReducer from './fileUploadReducer';
import getClickedFileDataReducer from './getClickedFileDataReducer';
import registerReducer from './registerReducer'
import CurrentDirectoryReducer from './CurrentDirectoryReducer'
import HomeReducer from './HomeReducer'
import groupsReducer from './groupsReducer'
import profileReducer from './profileReducer'
import HistoryItemReducer from './HistoryItemReducer'

export default combineReducers({
	AuthReducer,
	fileUploadReducer,
	getClickedFileDataReducer,
	registerReducer,
	CurrentDirectoryReducer,
	HomeReducer,
	groupsReducer,
	profileReducer,
	HistoryItemReducer
})