import React, { Component } from 'react';
import {viewFile , viewFileForGroup} from '../../actions/viewFileAction'
import { unStarItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import {deleteGroup , addMembersToTheGroup , getMembersOfGroup , setCurrentGroupFolder ,  openFolderAndViewContent ,  deleteMembersOfGroup} from '../../actions/GroupAction'


class FileComponent extends Component{

	

	render(){
		

		const styleBottomBorder = {
			border : "none",
			borderBottom: "solid 2px #E6E8EB",
			paddingTop:"15px"
		}

		console.log('SUb components ' , this.props.file) ; 
		
		return (
			
			 <li  style={styleBottomBorder} className="list-group-item padd">
			 		
			 	
			 	{
			 		this.props.file.is_directory == '1' ? 
			 			
			 			<a  onClick={() => {
				 			this.props.setCurrentGroupFolder(
								 				this.props.file.email  ) ;
							this.props.history.push('/sharedFolderInGroup/'+    this.props.file.directory + '/'+ this.props.file.file_name) 
				 			}}> 
						
							<img src={require("../../fonts/folder.jpg")}  height="40" width="40"/>
							
						
						{this.props.file.file_name}
						</a> 
			 		 : 
				 		<a  onClick={() => {
				 			viewFileForGroup(this.props.email , this.props.file.email , this.props.file.file_name 
				 				, this.props.file.directory)
				 			}}> 
							{ this.props.file.file_name.indexOf('.jpg') !== -1 ? 
									(<img src={require("../../fonts/image.jpg")}  height="40" width="40"/>) : 
									 ( this.props.file.file_name.indexOf('.pdf') !== -1 ? 
									  <img src={require("../../fonts/pdf.jpg")}  height="40" width="40"/> :
									 <img src={require("../../fonts/doc.jpg")}  height="40" width="40"/> )
							}
						
						{this.props.file.file_name}
						</a> 
			 	}


			 </li>


			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		viewFile : (filename) => dispatch(viewFile(filename)),
		unStarItems : (item1 , item2 , directory ) => dispatch(unStarItems(item1 , item2 , directory)),
		setCurrentGroupFolder : (email , directory , filename ) => dispatch(setCurrentGroupFolder(email , directory , filename))
	}
}

function mapStateToProps(state) {
    return {
        isAuthenticated : state.AuthReducer.isAuthenticated,
        email : state.AuthReducer.email,
        listOfFiles : state.fileUploadReducer.listOfFiles,
        fileContent : state.getClickedFileDataReducer.fileData, 
        listOfSTarredFiles : state.fileUploadReducer.listOfStarredFiles,
        directoryForServer : state.CurrentDirectoryReducer.directoryForServer,
    };
}




export default connect(mapStateToProps , mapDispatchToProps)(FileComponent) ;

