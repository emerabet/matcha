import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" exact component={ Login }/>
        <Route path="/home" exact component={ Home }/>
      </Switch>
    );
  }
}

export default App;
