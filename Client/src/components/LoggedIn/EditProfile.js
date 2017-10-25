import React, { Component } from 'react';
import {viewFile} from '../../actions/viewFileAction'
import {starItems} from '../../actions/StarredAction'
import {connect} from 'react-redux'
import {deleteFile} from '../../actions/uploadFileAction'
import {submitProfile , updateProfile} from '../../actions/submitProfileAction'
import FileComponent from './FileComponent'
import FileStarredComponents from './FileStarredComponents'
import {checkProfileExist} from '../../actions/submitProfileAction'

class EditProfile extends Component{

	constructor(props){
		super(props) ;

		this.state = {
			about : '' , 
			education : '' ,
			profession : '',
			lifeevents : '' , 
      profile : {}
		}
	}
	
  componentWillMount(){
    this.props.checkProfileExist(this.props.email) ; 
    this.setState({
      profile : this.props.profile_details
    })
  }


	render(){
		
		console.log('Profile from server ' , this.state.profile)
		const style10 = {
			height: "10%"
		}
		const style5 = {
			height: "5%"
		}

		

		const styleBottomBorder = {
			borderBottom: "1px solid#888",
			paddingTop:"15px"
		}


		const styleDisplayNone = {
			display: "none"
		}

		

		console.log('this.props.profile_details[0].lifeevents   ' , this.state.profile)

		return (
				
				

				<div className="row col-sm-12 col-lg-12 col-md-12 col-xs-12">
		
                    


					<div className="row">
                  		<div className="col-md-12">
                  		<div className="form-group">
                            <label>Profile Pic : </label>
                           <label className="btn  btn-default btn-file">
											    Select Profile Pic <input type="file"  style={styleDisplayNone}/>
					</label>
                  		</div>
                  	</div>
                    </div>


                  	<div className="row">
                  		<div className="col-md-12">
                  		<div className="form-group">
                            <label>About : </label>
                            <textarea value={this.props.profile_details.about} onChange={(e) => {
                            	this.setState({
                            		
                            			about : e.target.value
                            		
                            	})
                            }} className="form-control textarea" rows="3" name="Message" id="Message" placeholder="Write about Yourself"></textarea>
                  		</div>
                  	</div>
                    </div>
                    
                    
                    <div className="row">
                  		<div className="col-md-12">
                  		<div className="form-group">
                            <label>Education : </label>
                           <select value={this.props.profile_details.education} onChange={(e) => {
                            	this.setState({
                            	
                            			education : e.target.value
                            	
                            	})
                            }}  className="form-control">
                           	  <option>--Select--</option>
							  <option>School</option>
							  <option>High-School</option>
							  <option>Under-Graduate</option>
							  <option>Graduate</option>
							  <option>Post-Graduate</option>
							</select>
                  		</div>
                  	</div>
                    </div>
                    
                    
                    <div className="row">
                  		<div className="col-md-12">
                  		<div className="form-group">
                            <label>Profession : </label>
                            <select value={this.props.profile_details.profession} onChange={(e) => {
                            	this.setState({
                            		
                            			profession : e.target.value
                            		
                            	})
                            }}  className="form-control">
                              <option>--Select--</option>
							  <option>Service</option>
							  <option>Business</option>
							  <option>Engineer</option>
							  <option>Scientist</option>
							  <option>Doctor</option>
							</select>
                  		</div>
                  	</div>
                    </div>
                    
                    
                    <div className="row">
                  		<div className="col-md-12">
                  		<div className="form-group">
                            <label>Life Events : </label>
                          <textarea value={this.props.profile_details.lifeevents} onChange={(e) => {
                            	this.setState({
                            		
                            			lifeevents : e.target.value
                            		
                            	})
                            }} className="form-control textarea" rows="3" name="Message" id="Message" placeholder="Life Events"></textarea>
                  		</div>
                  	</div>
                    </div>
                    
                   
                  	
                    
                    
                    <div className="row">
                    <div className="col-md-12">
                       
                     
                          <button onClick={() => {
                            this.props.updateProfile(this.state.email , this.state.profile.about , this.state.profile.education , 
                            this.state.profile.profession , this.state.profile.lifeevents ) ;
                            this.props.history.push('/home')
                          }} className="btn main-btn pull-right">Update</button>
                      
                       


                          
                  </div>
                  </div>
               
	</div>
							

			)
	}


}

function mapDispatchToProps(dispatch){
	return {
		viewFile : (filename) => dispatch(viewFile(filename)),
		starItems : (item) => dispatch(starItems(item)),
		deleteFile : (email , filename ) => dispatch(deleteFile(email , filename )),
		submitProfile : (email , about , education , profession, lifeevents) => dispatch(submitProfile(email , about , education , profession, lifeevents)),
    checkProfileExist : (email) => dispatch(checkProfileExist(email)),
    updateProfile : (email , about , education , profession, lifeevents) => dispatch(updateProfile(email , about , education , profession, lifeevents)),
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
        Heading : state.HomeReducer.Heading,
        AllUsers : state.HomeReducer.getAllUsers,
        profileExist : state.profileReducer.profileExist,
        profile_details : state.profileReducer.profile_details
    };
}



export default connect(mapStateToProps , mapDispatchToProps)(EditProfile) ;