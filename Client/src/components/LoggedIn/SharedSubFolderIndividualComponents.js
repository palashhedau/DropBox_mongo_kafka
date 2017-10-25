import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import { unStarItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import {deleteGroup , addMembersToTheGroup , getMembersOfGroup , setCurrentGroupFolder ,  openFolderAndViewContent ,  deleteMembersOfGroup} from '../../actions/GroupAction'
import SharedSubFolderIndividualComponentsList from './SharedSubFolderIndividualComponentsList' ; 

class FileComponent extends Component{

	

	render(){
		
		console.log('SUb components ' , this.props.file) ; 
		
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


		return (
			


			<div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12" >
					      	  
					      	   <div className="row" style={styleBottomBorder}>
					      			<p>Shared Content by  {this.props.toEmail}</p>
						      </div>
						      <div > 
						      		<ul className="list-group">
						      		
						      		{
						      			this.props.listOfIndividualSharedFIles.map((file,  key) => {
						      				return <SharedSubFolderIndividualComponentsList {...this.props} key={key} file={file}></SharedSubFolderIndividualComponentsList>
						      			})
						      		}

						      		
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
        toEmail : state.getClickedFileDataReducer.sharedBy,
        listOfIndividualSharedFIles : state.fileUploadReducer.listOfIndividualSHaredContent
    };
}




export default connect(mapStateToProps , mapDispatchToProps)(FileComponent) ;

