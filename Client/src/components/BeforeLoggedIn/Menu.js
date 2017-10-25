import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux' ; 


export default function Landing2 (InnerComponent ){
	class Menu extends Component{

	componentWillMount(prevProps, prevState) {
    	console.log('Component will mount')
     if(this.props.isAuthenticated){
			this.props.history.push('/home') ; 
		}else{
			console.log('No TOken present')
		}
    }




  


   componentDidMount() {
      console.log('Component DID MOUNT!')
       if(this.props.isAuthenticated){
			this.props.history.push('/home') ; 
		}else{
			console.log('No TOken present')
		}
    }

  
  render(){


		const center = {
			align : "center"
		}
		 
		const height = {
			height: "100%",
			paddingLeft: "0px"
		}

		const paddleft = {
			paddingLeft: "40px"
		}

		const paddRight = {
			paddingRight: "20px"
		}

		const paddLeftDiv = {
			paddingLeft: "0px"
		}


		return(

			<div className="container-fluid" style={paddLeftDiv}>
				<div className="col-lg-12 " style={height}>
						<div className="col-lg-8 col-md-8 col-sm-8 " style={height}>
							<img alt="" src={require("../../fonts/Polbox_FrontPage.JPG")}/>
						</div>
						<div className="col-lg-4 col-md-4 col-sm-4 " style={paddleft}>
							
							<InnerComponent {...this.props}></InnerComponent>
						</div>
						
				</div>
			</div>


			)
		}

	}


	function mapStateToProps(state){
		return {
			isAuthenticated : state.AuthReducer.isAuthenticated
		}
	}


	return connect(mapStateToProps)(Menu) 

}
