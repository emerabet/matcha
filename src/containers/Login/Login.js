import React from 'react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Component } from 'react';
import classes from './Login.css';
import { Link } from 'react-router-dom';
import { Divider, Input, Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';

class  Login extends Component {
   
    state = {
        username: '',
        password: ''
    }

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('in handle login');
        await this.props.onLogin(this.state.username, this.state.password, this.props.socket);
       
        this.props.history.push('/home');
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleRegister = () => {
        this.props.history.push('/register');
    }

    render (){
        return (
            <div className='Login__Container'>
                <Form className='Login__Form' onSubmit={this.handleLogin}>
                    <Form.Field>
                        <label>Username</label>
                        <input name="username" onChange={this.handleChange} placeholder='Username' />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name="password" type='password' onChange={this.handleChange} placeholder='Password' />
                    </Form.Field>

                    <Button primary fluid type='submit'>Login</Button>
                    <Divider horizontal>Or</Divider>
                    <Button secondary fluid onClick={this.handleRegister}>Register</Button>
                    
                </Form>
            </div>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (userName, password, socket) => dispatch(actions.login(userName, password, socket))
    }
}

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Login));