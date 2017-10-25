import React, { Component } from 'react';
import Menu from './Menu'
import RegistrationContent from './RegistrationContent'


export default class Registration extends Component{
	render(){

		console.log(this.props);
		return (
	
				<RegistrationContent {...this.props}></RegistrationContent>
					
			)

	}


}