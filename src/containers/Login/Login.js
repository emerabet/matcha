import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import * as actionTypes from './ActionTypes';
import { connect } from 'react-redux';
import { Component } from 'react';

class  Login extends Component {
    render (){
        return (
      <div>
          <form onSubmit={this.props.handleLogin}>
            <Input placeholder="User name" />
            <Input placeholder="Password" />
            <Button primary> Login </Button>
            </form>
      </div>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (userName, password) => dispatch({type: actionTypes.LOGIN, userName: userName, password: password})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);