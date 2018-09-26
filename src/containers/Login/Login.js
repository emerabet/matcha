import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Component } from 'react';

class  Login extends Component {
   
    state = {
        userName: "",
        password: ""
    }

    handleLogin = async (e, values) => {
        e.preventDefault();
        console.log('in handle login');
        await this.props.onLogin(this.state.userName, this.state.password);
        this.props.history.push('/home');
    }

    handleChange = (e, data) => {
        this.setState({[data.name]: data.value});
    }

    render (){
        return (
      <div>
          <Form onSubmit={this.handleLogin}>
            <Input icon="user" iconPosition="left" onChange={this.handleChange} name="userName" value={ this.state.userName } placeholder="User name" />
            <Input icon="lock" iconPosition="left" onChange={this.handleChange} name="password" placeholder="Password" />
            <Button primary> Login </Button>
          </Form>
      </div>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (userName, password) => dispatch(actions.login(userName, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);