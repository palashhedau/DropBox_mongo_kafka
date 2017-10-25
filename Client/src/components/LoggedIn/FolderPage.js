import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import FileComponent from './FileComponent'

class FolderPage extends Component{


	
	render(){

		const styleBottomBorder = {
			borderBottom: "1px solid#888",
			paddingTop:"15px"
		}


		return (
				<div className=" col-sm-11 col-lg-11 col-md-11 col-xs-11">
					
					<div className="row" style={styleBottomBorder}>
						      	<p>{this.props.location.pathname.replace('/home' , '') }</p>
					</div>



				{this.props.listOfFiles.map((file , key) => {
					return <FileComponent key={key} file={file} > </FileComponent>
				})}
				</div>
			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		viewFile : (filename) => dispatch(viewFile(filename)),
		starItems : (item) => dispatch(starItems(item)),
		deleteFile : (email , filename ) => dispatch(deleteFile(email , filename ))
	}
}


function mapStateToProps(state) {
    return {
        isAuthenticated : state.AuthReducer.isAuthenticated,
        listOfFiles : state.fileUploadReducer.listOfFiles,
        fileContent : state.getClickedFileDataReducer.fileData, 
        listOfSTarredFiles : state.fileUploadReducer.listOfStarredFiles,
        
    };
}



export default connect(mapStateToProps , mapDispatchToProps)(FolderPage) ;