import React, { Component } from 'react';
import {register , setBackRegistered} from '../../actions/registrationAction'
import { connect } from 'react-redux' ; 
import { Link } from 'react-router-dom'



class RegistrationContent extends Component{
	
	constructor(props){
		super(props) ;

		this.state = {
			email : '' , 
			password : '' ,
			fname : '' ,
			lname : '',
			dob : '' ,
			gender : '',
			error : ''
		}
	}

	componentWillMount(){
		
	}


   componentDidUpdate(prevProps, prevState) {
   	if(this.props.registered){
   		this.props.setBackRegistered();
      	this.props.history.push('/login');
      }


  	}


	onChangeEmail(e){
		this.setState({
			email : e.target.value
		})
	}
	onChangePassword(e){
		this.setState({
			password : e.target.value
		})
	}
	onChangeFname(e){
		this.setState({
			fname : e.target.value
		})
	}
	onChangeLname(e){
		this.setState({
			lname : e.target.value
		})
	}
	onChangeDOB(e){
		this.setState({
			dob : e.target.value
		})
	}
	onChangeGender(e){
		console.log('gender ' , e.target.value)
		this.setState({
			gender : e.target.value
		})
	}

	handleSubmit(e) {
	    e.preventDefault()
    }
	

	render(){
		console.log('Registration success : ' , this.props.registered) ; 
		
		const styleColor = {
			color: "red"
		}


		const sharpCorner = {
			borderRadius : "0"
		}

		const paddingTop = {
			paddingTop: "40px"
		}
		
		return (
			
		
				 <form onSubmit={this.handleSubmit} encType="multipart/form-data">
					<div>
					
						<div  className="row  col-sm-12 col-lg-12 col-md-12 " style={paddingTop}>
					
							
							<div className="row padd">
									<div className='col-lg-12 col-md-12 col-sm-12'>
										<h2>Sign up</h2>		
									</div>
									<div className='col-lg-12 col-md-12 col-sm-12'>
										or <Link to="/login">sign in to your account</Link>		
									</div>
							</div>

							<div className="row padd">
									<div className='col-lg-12 col-md-12 col-sm-12'>
											<input style={sharpCorner} type="email"  onChange={this.onChangeEmail.bind(this)} name='email' id='email'   className="form-control"  placeholder="Email..." aria-describedby="basic-addon1"  required />
										</div>
							</div>
							
							<div className="row padd">
									<div className='col-lg-12 col-md-12 col-sm-12'>
											<input style={sharpCorner} type="password" onChange={this.onChangePassword.bind(this)} name='password' id='password'   className="form-control"  placeholder="Password..." aria-describedby="basic-addon1"  required />
										</div>
							</div>
								
							<div className="row padd">
								<div className='col-lg-12 col-md-12 col-sm-12'>
											<input style={sharpCorner} type="text" onChange={this.onChangeFname.bind(this)} name='fname' id='fname'   className="form-control"  placeholder="First Name..." aria-describedby="basic-addon1"  required />
								</div>
							</div>
								
							<div className="row padd">
								<div className='col-lg-12 col-md-12 col-sm-12'>
										<input style={sharpCorner} type="text" onChange={this.onChangeLname.bind(this)} name='lname' id='lname'   className="form-control"  placeholder="Last Name..." aria-describedby="basic-addon1"  required />
								</div>
							</div>
								
							<div className="row padd">
								<div className='col-lg-12 col-md-12 col-sm-12'>
										<input style={sharpCorner} type="date" name='dob' id='dob' onChange={this.onChangeDOB.bind(this)}  className="form-control"  placeholder="DOB..." aria-describedby="basic-addon1"  required />
								</div>
							</div>
								
							<div className="row padd">
								<div className='col-lg-12 col-md-12 col-sm-12' >
										<div className="radio-group" >
											<div className="radio">

											  <label ><input type="radio" name="optradio" required value='Male' onChange={this.onChangeGender.bind(this)}/>Male </label>
											  <label><input type="radio" name="optradio" required value='Female' onChange={this.onChangeGender.bind(this)}/>Female </label>
											  <label><input type="radio" name="optradio" required value='Other' onChange={this.onChangeGender.bind(this)}/>Other </label>
										 	</div >
										</div>
								</div>
							</div>
								
								
							<div className="row padd">
								
									<div className='col-lg-12 col-md-12 col-sm-12'>
										<button  style={sharpCorner} className='btn btn-info btn-block' onClick={() => {
											console.log('DOB ' , this.state.dob)
											console.log('DOB ' , this.state.gender)
											var email_regex = /^[a-z0-9]{3,20}@[a-z]+\.[a-z]+$/i ; 
											var name_regex = /^[a-z]{5,20}$/i ;
											var lname_regex = /^[a-z]{5,20}$/i ;
											var password_regex = /^[a-z0-9]{5,20}$/i ; 

											if(!email_regex.test(this.state.email)){
												this.setState({
													error : 'Enter proper email format'
												})
												return ;
											}
											if(!password_regex.test(this.state.password)){
												this.setState({
													error : 'Password should be alpha-numeric and 5-20 characters'
												})
												return ;
											}
											if(!name_regex.test(this.state.fname)){
												this.setState({
													error : 'First Name should contain only letters and 5-10 characters only'
												})
												return ;
											}
											if(!lname_regex.test(this.state.lname)){
												this.setState({
													error : 'Last Name should contain only letters and 5-10 characters only'
												})
												return ;
											}
											if(this.state.dob === ''){
												this.setState({
													error : 'Select Date of Birth'
												})
												return ;
											}
											if(this.state.gender === ''){
												this.setState({
													error : 'Select Gender'
												})
												return ;
											}

											
											this.props.register(this.state.email,
																this.state.password,
																this.state.fname,
																this.state.lname,
																this.state.dob,
																this.state.gender)


										}} >Submit</button>
									</div>
									
							</div>
							
							<div className="row padd">
								<div className='col-lg-12 col-md-12 col-sm-12' >
										{ 
											this.state.error === '' ? <b></b> :
											<h4 style={styleColor}>{this.state.error}</h4>
										}
										{
											this.props.error === false ? <b></b> :
											<h4 style={styleColor}>Email is already taken, please try with a different one</h4>
										}
								</div>
							</div>
							
							
						</div>


					
					
					</div>
					
				</form>
				


			)

	}


}





function mapDispatchToProps(dispatch) {
    return {
        register : (data1 , data2 , data3, data4, data5, data6 ) => dispatch(register( 
        									data1 , data2 , data3, data4, data5, data6 )),
        setBackRegistered : () => dispatch(setBackRegistered())
    };
}

function mapStateToProps(state) {
    return {
        registered : state.registerReducer.registered ,
        error : state.registerReducer.error 
    };
}



export default connect(mapStateToProps , mapDispatchToProps )(RegistrationContent) ; 