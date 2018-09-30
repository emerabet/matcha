import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Register from './components/Register/Register';
import Profile from './containers/Profile/Profile';

class App extends Component {

  render() {

    let routes = (
       <Switch>
        <Route path="/login" exact component={ Login }/>
        <Route path="/register" exact component={ Register }/>
        <Redirect from="/" to="/login"/>
      </Switch>
    );

    if (sessionStorage.getItem('token')) {
      routes = (
      <Switch>
        <Route path="/home" exact component={ Home }/>
        <Route path="/profile" exact component={ Profile }/>
        <Redirect from="/" to="/home"/>
      </Switch>
      )
    }

    return (
      <div id="wrapRoute">
      { routes }
      </div>
    );
  }
}

export default App;
