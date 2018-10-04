import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Register from './components/Register/Register';
import Profile from './containers/Profile/Profile';
import Stalk from './containers/Stalk/Stalk';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdvancedSearch from './containers/AdvancedSearch/AdvancedSearch';

class App extends Component {

  render() {

    let routes = (
       <Switch>
        <Route path="/login" exact component={ Login }/>
        <Route path="/register" exact component={ Register }/>

        <Route path="/search" exact component={ AdvancedSearch }/>
        <Redirect from="/" to="/login"/>
      </Switch>
    );

    if (sessionStorage.getItem('token')) {
      routes = (
      <Switch>
        <Route path="/home" exact component={ Home }/>
        <Route path="/profile" exact component={ Profile }/>
        <Route path="/search" exact component={ AdvancedSearch }/>
        <Route path="/stalk/:id(\d+)" exact component={ Stalk }/>
        <Redirect from="/" to="/home"/>
      </Switch>
      )
    }

    return (
      <div id="wrapRoute">
      
        { routes }
        <ToastContainer />
      </div>
    );
  }
}

export default App;
