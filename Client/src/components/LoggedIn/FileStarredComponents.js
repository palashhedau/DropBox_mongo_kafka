import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import { unStarItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import {shareFile , shareFileInGroup} from '../../actions/shareFileAction'

class FileComponent extends Component{

	constructor(props){
		super(props);

		this.state = {
			url : '/home/' + (this.props.currentUrl === '' ? '' : this.props.currentUrl + '/' ) ,
			modalIsOpen: false,
			modal2IsOpen : false 
		}
	}

	render(){
		
		const styleBottomBorder = {
			border : "none",
			borderBottom: "solid 2px #E6E8EB",
			paddingTop:"15px"
		}

		const customStyles = {
	      content : {
	        top                   : '40%',
	        left                  : '50%',
	        right                 : '50%',
	        bottom                : '40%',
	        marginRight           : '-50%',
	        transform             : 'translate(-50%, -50%)'
	      }
	    };

		

		const stylePadding = {
			paddingTop : "30px"
		}
		
		return (
			
			 <li  style={styleBottomBorder} className="list-group-item padd">
			 		
			 	<Modal
                        isOpen={this.state.modalIsOpen}
                        style= {customStyles}
                        onRequestClose={this.closeModal}
                        shouldCloseOnOverlayClick={false}
                        contentLabel="Profile">

                        <div>
					 		<div>
						 		<select onChange={(e) => {	this.setState({
															 		shareToEmail : e.target.value,})
														}} className="form-control" id="sel1"> 	
												 	<option>---Select User---</option> 
												 	{this.props.AllUsers.map((user , key) => {
												  		return <option   key={key}>{user.email}</option>
												  	})} 

								</select>
							</div>

							<div style={stylePadding}>
								
								<button className="btn btn-danger btn-sm  pull-right" onClick={() => {
									this.setState({
										modalIsOpen : false
									})
								}}>Cancel</button>

								<button className="btn btn-primary btn-sm pull-right" onClick={() => {
										       		this.props.email === this.state.shareToEmail ? 
										       		console.log('Cannot share with ourself') :
										       		(
										       			this.props.shareFile(this.props.file.file_name , this.props.file.directory,
										       			this.props.email , this.state.shareToEmail , this.props.file.is_directory)
										       		)
										       		this.setState({
														modalIsOpen : false
													})
										       	
								 }}>Share</button>
								
								
							</div>

						</div>
						   

	                        
                        
                 </Modal>


                 <Modal
                        isOpen={this.state.modal2IsOpen}
                        style= {customStyles}
                        onRequestClose={this.closeModal}
                        shouldCloseOnOverlayClick={false}
                        contentLabel="Profile">

                        <div>
                        	<div>
						 		<select onChange={(e) => {	this.setState({
															 		shareToGroup : e.target.value,})
														}} className="form-control" id="sel1">

														<option>---Select Group---</option> 	
												 	{this.props.groupList.map((group , key) => {
												  		return <option   key={key}>{group.group_name} - {group.groupowner}</option>
												  	})} 

								</select>
							</div>

							<div>

								<button className="btn btn-danger btn-sm pull-right" onClick={() => {
									this.setState({
										modal2IsOpen : false 
									})
								}}>Cancel</button>
								<button className="btn btn-primary btn-sm pull-right" onClick={() => {
									       		this.setState({
									       			
									       		})
									       		this.props.shareFileInGroup(this.props.email , this.state.shareToGroup 
									       			,this.props.file.file_name , this.props.file.directory , this.props.file.is_directory  )
									       		this.setState({
									       			modal2IsOpen : false 
									       		})
									       }}>Add</button>
								
							</div>

						
						</div>
						   

	                        
                        
                 </Modal>


			 	
			 	{
			 		this.props.file.is_directory == '1' ? 
			 			
			 			<Link   to={

			 				(
			 					this.props.file.directory === 'root' ?  
			 					this.state.url  +  this.props.file.file_name : 
			 					this.state.url  + this.props.file.directory + '/' +  this.props.file.file_name 
			 				) 


			 				}  > 
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
						           <li className="list-group-item"><a onClick={() => {
						          	this.setState({
										modalIsOpen : true
									})
						          }}>Share</a></li>
						          <li className="list-group-item"><a onClick={() => {
						          	this.setState({
										modal2IsOpen : true
									})
						          }}>Share with Group</a></li>
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
		
		unStarItems : (item1 , item2 , directory ) => dispatch(unStarItems(item1 , item2 , directory)),
		shareFile : (filename , directory , fromUser , toUser , id ) => dispatch(shareFile(filename , directory , fromUser , toUser , id)),
		shareFileInGroup : (email , groupname , filename , directory , is_directory) => dispatch(shareFileInGroup(email , groupname , filename , directory, is_directory))
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
		AllUsers : state.HomeReducer.getAllUsers,
        groupList : state.groupsReducer.getAllGroups
    };
}




export default connect(mapStateToProps , mapDispatchToProps)(FileComponent) ;

