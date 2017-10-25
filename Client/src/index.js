import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter ,   Switch, Route  } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import {Provider } from 'react-redux'
import store  from './store'
import  setAuthorizationToken from './utils/setAuthorizationToken'
import jwtDecode from 'jwt-decode' ;
import {checkIfAldreadyLoggedIn} from './actions/authAction'
//Pages
import Home from './components/LoggedIn/Home'
import Registration from './components/BeforeLoggedIn/Registration'
import Login from './components/BeforeLoggedIn/Login'
import AuthenticateRouth from './utils/Authenticate'
import FolderPage from './components/LoggedIn/FolderPage'
import HomeComponent from './components/LoggedIn/HomeComponent'
import SharedComponent from './components/LoggedIn/SharedFiles'
import MainFilesComponent from './components/LoggedIn/MainFilesComponent'
import Groups from './components/LoggedIn/Groups'
import GroupsContent from './components/LoggedIn/GroupsContent'
import profile from './components/LoggedIn/profile'
import SubmitProfile from './components/LoggedIn/submitProfile'
import Landing2 from './components/BeforeLoggedIn/Menu'
import FileHistory from './components/LoggedIn/FileHistory'
import EditProfile from './components/LoggedIn/EditProfile'
import SharedSubFolderComponents from './components/LoggedIn/SharedSubFolderComponents'
import SharedSubFolderIndividualComponents from './components/LoggedIn/SharedSubFolderIndividualComponents'


const Main = () => (
  
    <Switch>
          <Route path="/profile_details" component={AuthenticateRouth(Home(SubmitProfile))}/>
          <Route path="/edit_details" component={AuthenticateRouth(Home(EditProfile))}/>
          <Route exact path='/login' component={Landing2(Login)}/>
        	<Route exact path='/' component={Landing2(Registration)}/>
          <Route exact path='/home' component={AuthenticateRouth(Home(HomeComponent))}/>
          <Route path="/home/:term" component={AuthenticateRouth(Home(FolderPage))}/>
          <Route path="/shared" component={AuthenticateRouth(Home(SharedComponent))}/>
          <Route path="/files" component={AuthenticateRouth(Home(MainFilesComponent))}/>
          <Route path="/groups" exact component={AuthenticateRouth(Home(Groups))}/>
          <Route path="/groups/:groupname" component={AuthenticateRouth(Home(GroupsContent))}/>
          <Route path="/file_activity" component={AuthenticateRouth(Home(FileHistory))}/>
          <Route path="/sharedFolderInGroup/:foldername" component={AuthenticateRouth(Home(SharedSubFolderComponents))}/>
          <Route path="/sharedFolderInIndividual/:foldername" component={AuthenticateRouth(Home(SharedSubFolderIndividualComponents))}/>
    </Switch>
  
)




store.dispatch(checkIfAldreadyLoggedIn()) ; 

  

ReactDOM.render(

	<Provider store={store}>
       <BrowserRouter >
        <Main />
        </BrowserRouter>
       
	 </Provider>
	, document.getElementById('root'));



registerServiceWorker();




