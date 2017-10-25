import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {viewFile , viewFileForGroup} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import {shareFile} from '../../actions/shareFileAction'
import {deleteGroup , addMembersToTheGroup , getAllSharedGroupComponents ,  getMembersOfGroup , getGroupName , setCurrentGroupFolder ,  openFolderAndViewContent ,  deleteMembersOfGroup} from '../../actions/GroupAction'
import FileComponent from './FileComponent'
import FileStarredComponents from './FileStarredComponents'
import Modal from 'react-modal'
import {getProfile} from '../../actions/submitProfileAction'



class GroupComponent extends Component{

	constructor(props){
		super(props);
		this.state = {
			directoryForGroups : this.props.location.pathname.replace('/groups/' , '') ,
			url : '/profile/',
			modalIsOpen: false
		}
	}

	componentWillMount(){
		this.props.getAllSharedGroupComponents(this.props.email , this.state.directoryForGroups );
		this.props.getGroupName(this.state.directoryForGroups) ; 
		this.props.getMembersOfGroup(this.props.email , this.state.directoryForGroups);
	}
	
		
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

		const customStyles = {
	      content : {
	        top                   : '40%',
	        left                  : '50%',
	        right                 : '50%',
	        bottom                : 'auto',
	        marginRight           : '-50%',
	        transform             : 'translate(-50%, -50%)'
	      }
	    };

		

		const stylePadding = {
			paddingTop : "30px"
		}

		

		const FontSize = {
			fontSize: "20px"
		}


       

		return (
				 <div className=" col-sm-12 col-lg-12 col-md-12 col-xs-12">
					

					 <div className="row" style={styleBottomBorder}>
						      	<img src={require("../../fonts/groupMembers.jpg")}  height="60" width="100"/>
						      	<p>Group Members</p>
					</div>

					<div>


					 <Modal
                        isOpen={this.state.modalIsOpen}
                        style= {customStyles}
                        onRequestClose={this.closeModal}
                        shouldCloseOnOverlayClick={false}
                        contentLabel="Profile">

                        
						   

	                         {  this.props.profileData !== null  ?

							 	<div >   

								    <div className="pull-right"> 
								    		<h3>
								    			{this.props.profileData.email } 
								    			
								    		</h3>
								    </div>

								    <div style={stylePadding}>
								    
								    	<div style={styleBottomBorder}> 
												<p style={FontSize}>About </p>	
												    {this.props.profileData.about}
										</div>
								    </div>
								    
								   
								    
								    <div style={styleBottomBorder}> 
										<p style={FontSize}>Education </p>	
											{this.props.profileData.education}
									</div>
								    	
								    

								      <div style={styleBottomBorder}> 
												      	<p style={FontSize}>Profession </p>	
												      	{this.props.profileData.profession}
									  </div>
								    	
								    

								      <div  style={styleBottomBorder}> 
												      	<p style={FontSize}>Life-Events </p>	
												      	{this.props.profileData.lifeevents}
									  </div>
								    	 
								    </div>

								 


								    :
								    <h3>No Profile submitted by the member</h3>

								}
							   
                        
                      		<div className="pull-right" style={stylePadding}>
                      			<button onClick={() => {
                      				this.setState({modalIsOpen: false});
                      			}} className="btn btn-danger">Close</button>
                      		</div>
                        
                      </Modal>



					<ul className="list-group">
						
						{
							this.props.groupmembers.map((member , key) => {
							return <li style={styleBottomBorder} className="list-group-item padd" key={key}>
							<a onClick={(e) => {
								console.log('member ' , member.email)
								this.props.getProfile(member.email)
								this.setState({
									modalIsOpen: true
								})


							}}>{member.email} </a>
							{	
								
								this.props.email === member.group_owner ? 

								(
									member.email == member.group_owner ? <b></b> :
									<button className="btn btn-danger pull-right btn-xs" onClick={() => {
										this.props.deleteMembersOfGroup(this.props.email , member.email , 
										this.state.directoryForGroups , this.state.directoryForGroups )
									}}>Delete User</button>
								) : 
								<b></b>
								
							}

							</li>
							})
						}
					</ul>

					
					</div>
					 <div className="row" style={style5}>
					</div>


					<div className="row" style={styleBottomBorder}>
						      	<p>Group Files</p>
					</div>

					

					<table className="table ">

						<thead>
					      <tr>
					        <th>File Name</th>
					        <th>Shared By</th>
					      </tr>
					    </thead>
					    <tbody>

						{ this.props.listOfGroupSharedFiles.map((file,key) => {
							return  <tr key={key}>
								 		<td>
								 			
											{
												file.is_directory == '1' ?
												<a onClick={() => {
									 				this.props.setCurrentGroupFolder(
									 				file.file_owner , file.file_directory , file.filename ) ; 
									 				this.props.history.push('/sharedFolderInGroup/'+    file.file_directory + '/'+ file.filename)
									 			}} >
									 				<img src={require("../../fonts/folder.jpg")}  height="40" width="40"/>
									 				{file.filename}</a> 
									 			: 
									 			<a onClick={() => {
								 				viewFileForGroup(this.props.email ,  file.file_owner , file.filename 
						 										, file.file_directory)
										 			}} >
										 			{ file.filename.indexOf('.jpg') !== -1 ? 
															(<img src={require("../../fonts/image.jpg")}  height="40" width="40"/>) : 
															 ( file.filename.indexOf('.pdf') !== -1 ? 
															  <img src={require("../../fonts/pdf.jpg")}  height="40" width="40"/> :
															 <img src={require("../../fonts/doc.jpg")}  height="40" width="40"/> )
													}

										 			{file.filename}</a>
											}


								 			
								 		</td>
								 		<td>	
								 			<a >{file.file_owner}</a>
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
		starItems : (email , item , directory ) => dispatch(starItems(email ,item , directory)),
		deleteFile : (email , filename , directory  ) => dispatch(deleteFile(email , filename , directory )),
		shareFile : (filename , directory , fromUser , toUser ) => dispatch(shareFile(filename , directory , fromUser , toUser )),
		deleteGroup : (email , groupname) => dispatch(deleteGroup(email,groupname)),
		addMembersToTheGroup : (email , emailtoadd , groupname) => dispatch(addMembersToTheGroup(email , emailtoadd , groupname)),
		getMembersOfGroup : (email , groupname ) => dispatch(getMembersOfGroup(email, groupname)),
		deleteMembersOfGroup : (email , membertodelete , groupname , id ) => dispatch(deleteMembersOfGroup(email , membertodelete , groupname , id)),
		openFolderAndViewContent : (email , emailFrom , directory , foldername) => dispatch(openFolderAndViewContent(email , emailFrom , directory , foldername)),
		setCurrentGroupFolder : (email , directory , filename ) => dispatch(setCurrentGroupFolder(email , directory , filename)),
		getProfile : (email) => dispatch(getProfile(email)),
		getGroupName : (id ) => dispatch(getGroupName(id)),
		getAllSharedGroupComponents : (email , directory ) => dispatch(getAllSharedGroupComponents(email,directory)),
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
        AllUsers : state.HomeReducer.getAllUsers,
        listOfGroupSharedFiles : state.fileUploadReducer.listOfGroupSharedFiles,
         groupmembers : state.fileUploadReducer.groupmembers,
         profileData : state.profileReducer.profile
        
    };
}


export default connect(mapStateToProps , mapDispatchToProps)(GroupComponent) ;