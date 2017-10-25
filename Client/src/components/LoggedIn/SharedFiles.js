import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import FileComponent from './FileComponent'
import {getAllSharedComponents , setCurrentShared} from '../../actions/shareFileAction'
import SharedFileComponent from './SharedFileComponent'

class SharedComponent extends Component{


	componentWillMount(){
		this.props.getAllSharedComponents(this.props.email);
	}
	
	render(){

		const styleBottomBorder = {
			borderBottom: "1px solid rgb(220, 220,220 )",
			paddingTop:"15px",
			height: "10%"
		}
		console.log('SHared files ' , this.props.listOfSharedFiles); 
		return (
				<div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12">
					
					<div className="row" style={styleBottomBorder}>
						      	<p>File Received as Shared</p>
					</div>

					
					<table className="table table-hover table-condensed">

						<thead className="thead-inverse">
					      <tr>
					        <th >File Name</th>
					        <th >Shared By</th>
					      </tr>
					    </thead>
					    <tbody>

						{ this.props.listOfSharedFiles.map((file,key) => {
							return <SharedFileComponent {...this.props} key={key} file={file}></SharedFileComponent>
						})}
						</tbody>
					</table>
					
				</div>
			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		viewFile : (filename) => dispatch(viewFile(filename)),
		starItems : (item) => dispatch(starItems(item)),
		deleteFile : (email , filename ) => dispatch(deleteFile(email , filename )),
		getAllSharedComponents : (email) => dispatch(getAllSharedComponents(email)),
		setCurrentShared : (email) => dispatch(setCurrentShared(email))
	}
}


function mapStateToProps(state) {
    return {
        isAuthenticated : state.AuthReducer.isAuthenticated,
        listOfFiles : state.fileUploadReducer.listOfFiles,
        fileContent : state.getClickedFileDataReducer.fileData, 
        listOfSTarredFiles : state.fileUploadReducer.listOfStarredFiles,
        email : state.AuthReducer.email,
        listOfSharedFiles : state.fileUploadReducer.listOfSharedFiles,
    };
}



export default connect(mapStateToProps , mapDispatchToProps)(SharedComponent) ;