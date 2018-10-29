import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Register from './components/Register/Register';
import Profile from './containers/Profile/Profile';
import Stalk from './containers/Stalk/Stalk';
import SuperChat from './containers/SuperChat/SuperChat';
import Notification from './containers/Notification/Notification';
import Verif from './components/Verif/Verif';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './containers/Admin/Admin';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AdvancedSearch from './containers/AdvancedSearch/AdvancedSearch';
import Layout from './Hoc/Layout/Layout';
import Aux from './Hoc/Aux/Aux';
import NewPassword from './components/NewPassword/NewPassword';

class App extends Component {

  render() {

    let routes = (
       <Switch>
        <Route path="/login" exact component={ Login }/>
        <Route path="/register" exact component={ Register }/>
        <Route path="/reset_password" exact component={ ResetPassword }/>
        <Route path="/verif/:registration_token" component={Verif}/>
        <Route path="/new_password/:reset_token" component={NewPassword}/>
        <Redirect from="/" to="/login"/>
      </Switch>
    );

    if (localStorage.getItem('logged')) {
      routes = (
        <Layout>
          <Switch>
            <Route path="/home" exact component={ Home }/>
            <Route path="/profile" exact component={ Profile }/>
            <Route path="/verif/:registration_token" component={Verif}/>
            <Route path="/search" exact render={(props) => <AdvancedSearch history={props.history} mode='map' />}/>
            <Route path="/notifications" exact component={ Notification }/>
            <Route path="/stalk/:id(\d+)" exact component={ Stalk }/>
            <Route path="/chat" exact component={SuperChat}/>
            <Route path="/admin" exact component={ Admin }/>
            <Redirect from="/" to="/home"/>
          </Switch>
        </Layout>
      )
    }

    return (
        <Aux>
          { routes }
          <ToastContainer
            className='toast-container'
            toastClassName="dark-toast"
            progressClassName="dark-toast"
          />
        </Aux>
    );
  }
}

export default App;
