import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import Register from './components/Register/Register';
import Profile from './containers/Profile/Profile';
import Stalk from './containers/Stalk/Stalk';
import BigChat from './containers/BigChat/BigChat';
import ChatBottom from './containers/ChatBottom/ChatBottom';
import Notification from './containers/Notification/Notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdvancedSearch from './containers/AdvancedSearch/AdvancedSearch';
import Layout from './Hoc/Layout/Layout'

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

    if (localStorage.getItem('logged')) {
      routes = (
      <Switch>
        <Route path="/home" exact component={ Home }/>
        <Route path="/profile" exact component={ Profile }/>
        <Route path="/search" exact component={ AdvancedSearch }/>
        <Route path="/notifications" exact component={ Notification }/>
        <Route path="/stalk/:id(\d+)" exact component={ Stalk }/>
        <Route path="/chat" exact component={BigChat}/>
        <Route path="/chatb" exact component={ChatBottom}/>
        <Redirect from="/" to="/home"/>
      </Switch>
      )
    }

    return (
        <Layout>
          { routes }
          <ToastContainer />
        </Layout>
    );
  }
}

export default App;
