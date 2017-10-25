import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {viewFile , viewFileForGroup} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import {shareFile , setCurrentShared} from '../../actions/shareFileAction'


class SharedFileComponent extends Component{



	render(){

		const styleBottomBorder = {
			borderBottom: "1px solid#888",
			paddingTop:"15px"
		}

		return (
			
			 <tr>
			 		<td>
			 			
			 			{
			 				this.props.file.is_directory  === 1 ? 
			 				<a onClick={() => {
						 			this.props.setCurrentShared(this.props.file.from_user);
						 			this.props.history.push('/sharedFolderInIndividual/'+    this.props.file.directory + '/'+ this.props.file.filename)
						 		}}>
					 			<img src={require("../../fonts/folder.jpg")}  height="40" width="40"/>
								{this.props.file.filename}
				 			</a>

				 			:

				 			<a onClick={() => {
						 			viewFileForGroup(this.props.email , this.props.file.from_user,
						 			this.props.file.filename , this.props.file.directory )
						 		}}>
					 			{ this.props.file.filename.indexOf('.jpg') !== -1 ? 
															(<img src={require("../../fonts/image.jpg")}  height="40" width="40"/>) : 
															 ( this.props.file.filename.indexOf('.pdf') !== -1 ? 
															  <img src={require("../../fonts/pdf.jpg")}  height="40" width="40"/> :
															 <img src={require("../../fonts/doc.jpg")}  height="40" width="40"/> )
								}	
					 			{this.props.file.filename}
				 			</a>

			 			}

			 			

			 		</td>
			 		<td>	
			 			{this.props.file.from_user}
			 		</td>
			 </tr>


			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		viewFile : (filename) => dispatch(viewFile(filename)),
		starItems : (email , item , directory ) => dispatch(starItems(email ,item , directory)),
		deleteFile : (email , filename , directory  ) => dispatch(deleteFile(email , filename , directory )),
		shareFile : (filename , directory , fromUser , toUser ) => dispatch(shareFile(filename , directory , fromUser , toUser )),
		setCurrentShared : (email ) => dispatch(setCurrentShared(email))
	}
}


function mapStateToProps(state) {
    return {
        isAuthenticated : state.AuthReducer.isAuthenticated,
        listOfFiles : state.fileUploadReducer.listOfFiles,
        fileContent : state.getClickedFileDataReducer.fileData, 
        listOfSTarredFiles : state.fileUploadReducer.listOfStarredFiles,
        currentUrl : state.CurrentDirectoryReducer.directory,
        directoryForServer : state.CurrentDirectoryReducer.directoryForServer,
        email : state.AuthReducer.email,
    };
}


export default connect(mapStateToProps , mapDispatchToProps)(SharedFileComponent) ;