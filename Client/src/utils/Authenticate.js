import React, { Component } from 'react';
import { connect } from 'react-redux' ; 

export default function(InnerComponent){
	



   class Authenticate extends Component{

	componentWillMount() {
      if(!this.props.isAuthenticated){
      	this.props.history.push('/login');
      }
  	 }



   componentDidUpdate(prevProps, prevState) {
   	console.log('COmponent Updated with Authenticate') ; 
      if(!this.props.isAuthenticated){
      	this.props.history.push('/login');
      }
  	}

  


 	
   render(){
		return(
			<InnerComponent {...this.props}></InnerComponent>
			)
		}
	}



	function mapStateToProps(state) {
	    return {
	        isAuthenticated : state.AuthReducer.isAuthenticated
	    };
	}

	return connect(mapStateToProps)(Authenticate) ; 


}


