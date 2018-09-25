import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Login from './containers/Login/Login';

class App extends Component {
  render() {
    return (
      <Route path="/login" exact component={ Login }/>
    );
  }
}

export default App;
