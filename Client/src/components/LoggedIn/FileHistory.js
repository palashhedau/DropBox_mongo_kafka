import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import {getHistoryItems} from '../../actions/FileHistoryAction'
import FileComponent from './FileComponent'
import {getAllSharedComponents} from '../../actions/shareFileAction'
import SharedFileComponent from './SharedFileComponent'

class FileHistory extends Component{


	componentWillMount(){
		this.props.getHistoryItems(this.props.email);
	}
	
	render(){

		const styleBottomBorder = {
			borderBottom: "1px solid rgb(220, 220,220 )",
			paddingTop:"15px",
			height: "10%"
		}


		return (
				<div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12">
					
					<div className="row" style={styleBottomBorder}>
						      	<p>History</p>
					</div>

					
					<table className="table ">

						<thead>
					      <tr>
					        <th>File Name</th>
					        <th>Creation Date</th>
					        <th>Deleted</th>
					      </tr>
					    </thead>
					    <tbody>

						{ this.props.historyItems.map((file,key) => {
							return <tr key={key}>
								 		<td>
								 			{ file.is_directory === '1' ? 
												<img src={require("../../fonts/folder.jpg")}  height="40" width="50"/>	:

												(     file.file_name.indexOf('.jpg') !== -1 ? 
														(<img src={require("../../fonts/image.jpg")}  height="40" width="40"/>) : 
														 ( file.file_name.indexOf('.pdf') !== -1 ? 
														  <img src={require("../../fonts/pdf.jpg")}  height="40" width="40"/> :
														 <img src={require("../../fonts/doc.jpg")}  height="40" width="40"/> )
												)					
											}		
								 			{file.file_name}
								 		</td>
								 		<td>	
								 			{file.file_add_date}
								 		</td>
								 		<td>	
								 			YES
								 		</td>
								 </tr>
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
		getHistoryItems : (email) => dispatch(getHistoryItems(email))
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
        historyItems : state.HistoryItemReducer.historyItems
    };
}



export default connect(mapStateToProps , mapDispatchToProps)(FileHistory) ;