import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import { unStarItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'


class FileComponent extends Component{

	constructor(props){
		super(props);

		this.state = {
			url : '/home/' + (this.props.currentUrl === '' ? '' : this.props.currentUrl + '/' ) ,
			
		}
	}

	render(){
		
		const styleBottomBorder = {
			border : "none",
			borderBottom: "solid 2px #E6E8EB",
			paddingTop:"15px"
		}
		
		return (
			
			 <li  style={styleBottomBorder} className="list-group-item padd">
			 		
			 	
			 	{
			 		this.props.file.is_directory === '1' ? 
			 			
			 			<Link   to={this.state.url  + this.props.file.file_name} > 
							<img src={require("../../fonts/folder.jpg")}  height="40" width="40"/>
							{this.props.file.file_name}
						</Link>
			 		 : 
				 		<a onClick={() => {
				 			viewFile(this.props.email , this.props.file.file_name , this.props.file.directory)
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


			 	
			 

			 	
					
			 		<span className="pull-right">
			 				<ul className="nav navbar-nav">
			 				<li className="dropdown">
			 					<img className="dropdown-toggle" data-toggle="dropdown" 
			 							 src={require("../../fonts/expand.JPG")}  height="25" width="50"  />
			 					
			 					<ul className="dropdown-menu">
						          <li className="list-group-item">Share</li>
						        </ul>
			 				</li>
			 			</ul>
					</span>

			 		<span className="pull-right"><img onClick={() => {
			 			var file =  this.props.file.file_name ;
			 			this.props.unStarItems(this.props.email , file , this.props.directoryForServer);
			 		}} src={require("../../fonts/rStar.JPG")} height="20" width="54" /></span>
			 </li>


			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		
		unStarItems : (item1 , item2 , directory ) => dispatch(unStarItems(item1 , item2 , directory))
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
        currentUrl : state.CurrentDirectoryReducer.directory,
    };
}




export default connect(mapStateToProps , mapDispatchToProps)(FileComponent) ;

