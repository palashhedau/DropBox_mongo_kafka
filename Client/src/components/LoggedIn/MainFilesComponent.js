import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import FileComponent from './FileComponent'
import FileStarredComponents from './FileStarredComponents'

class MainFilesComponents extends Component{

	
	

	render(){
		
		
		const style10 = {
			height: "10%"
		}
		const style5 = {
			height: "5%"
		}

		

		const styleBottomBorder = {
			borderBottom: "1px solid rgb(220, 220,220 )",
			paddingTop:"15px"
		}

		

		var listOfAUserFiles = this.props.listOfFiles.map((file , key) => {
			return <FileComponent key={key} file={file} > </FileComponent>
		})

		

		return (
				
				

				<div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12" >
					      	  
					      	   <div className="row" style={styleBottomBorder}>
					      			<p>Repository</p>
						      </div>
						      <div > 
						      		<ul className="list-group">
						      		

						      		{ listOfAUserFiles}
						      		</ul>
						      </div>
						      <div> 
						      		
						      </div>
					      
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



export default connect(mapStateToProps , mapDispatchToProps)(MainFilesComponents) ;