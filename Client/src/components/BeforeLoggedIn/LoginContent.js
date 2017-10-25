import React, { Component } from 'react';
import {checkUser} from '../../actions/authAction'
import { connect } from 'react-redux' ; 
import { Link } from 'react-router-dom'

class LoginContent  extends Component{


	constructor(props){
		super(props);
		this.state = {
			email : '',
			password : ''
		}
	}


	changePasswordState = (event) =>{
		
		this.setState({
			password: event.target.value 

		})
	}

	changeUsernameState = (event) =>{
		
		this.setState({
			email : event.target.value 

		})
	}




	render(){
		
		const styleColor = {
			color: "red"
		}

		const textAlignRight = {
			textAlign: "right"
		}

		const paddingTop = {
			paddingTop: "40px"
		}
			
		const sharpCorner = {
			borderRadius : "0"
		}

		return(
			
				<div  className="row  col-sm-12 col-lg-12 col-md-12 " style={paddingTop}>
										
										<div className="row padd">
												<div className='col-lg-12 col-md-12 col-sm-12'>
													<h2>Sign in</h2>		
												</div>
												<div className='col-lg-12 col-md-12 col-sm-12'>
													or <Link to="/">create an account</Link>		
												</div>
										</div>

										<div className='row padd' >
											
											<div className='col-sm-12 col-lg-12 col-md-12' >
												<input style={sharpCorner} onChange={this.changeUsernameState.bind(this)}  type="text" name='username' id='username'   className="form-control"  placeholder="Username..." aria-describedby="basic-addon1" required />
											</div>
											
										</div>
										
										<div className='row padd'>
											
											<div className='col-sm-12 col-lg-12 col-md-12 '>
												<input style={sharpCorner} onChange={this.changePasswordState.bind(this)}  type="password" name='password' id='pwd'   className="form-control"  placeholder="Password..." aria-describedby="basic-addon1"  required/>
											</div>
											
										</div>
										
										<div className='row padd'>
											<div className='col-sm-12 col-lg-12 col-md-12'>
												<button style={sharpCorner}
												  className="btn btn-info btn-block" onClick={ () => this.props.checkUser(this.state.email , this.state.password)}>Submit </button>
												
											</div>
										</div>

										<div className='row padd'>
											<div className='col-sm-12 col-lg-12 col-md-12'>
												{
													this.props.error === true ?
													<h4 style={styleColor}>Username or Password is Incorrect</h4>
													:
													<p></p>
												}
											</div>
										</div>
									
								
				</div>
								
							
					



			)
	}
}






function mapDispatchToProps(dispatch) {
    return {
        checkUser : (username , password ) => dispatch(checkUser(username , password ))
    };
}


function mapStateToProps(state) {
    return {
        userFound : state.AuthReducer.userFound,
        error : state.AuthReducer.error
    };
}





export default connect(mapStateToProps , mapDispatchToProps )(LoginContent) ; 