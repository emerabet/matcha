import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Register from './components/Register/Register';

class App extends Component {

  render() {

    let routes = (
       <Switch>
        <Route path="/login" exact component={ Login }/>
        <Route path="/register" exact component={ Register }/>
        <Redirect from="/" to="/login"/>
      </Switch>
    );

    if (localStorage.getItem('token')) {
      routes = (
      <Switch>
        <Route path="/home" exact component={ Home }/>
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
