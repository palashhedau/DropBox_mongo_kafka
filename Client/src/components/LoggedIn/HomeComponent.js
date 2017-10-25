import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import FileComponent from './FileComponentForRecent'
import FileStarredComponents from './FileStarredComponents'
import  NotificationSystem from 'react-notification-system'



class HomeComponent extends Component{

	

	

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

		

		var listOfAUserFiles = this.props.listOfRecentFiles.map((file , key) => {
			return <FileComponent key={key} file={file} > </FileComponent>
		})

		var listOfAStarredUserFiles = this.props.listOfSTarredFiles.map((file , key) => {
			return <FileStarredComponents  {...this.props} key={key} file={file} > </FileStarredComponents>
		})

		return (
				
				

				<div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12" >
					
											




					      	   <div className="row" style={styleBottomBorder}>
					      		<p>Starred</p>
						      </div>
						      <div > 
						      		<ul className="list-group">
						      		{ listOfAStarredUserFiles}
						      		</ul>
						      </div>
						      <div className="row" style={style5}>
						      </div>
						      <div className="row" style={styleBottomBorder}>
						      	<p>Recent</p>
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
        listOfRecentFiles : state.fileUploadReducer.listOfRecentFiles
    };
}



export default connect(mapStateToProps , mapDispatchToProps)(HomeComponent) ;