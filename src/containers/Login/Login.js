import React from 'react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Component } from 'react';
import { Divider, Input, Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { toast } from 'react-toastify';

class  Login extends Component {
   
    state = {
        username: '',
        password: ''/*,
        validated: 'log'*/
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state !== undefined && this.props.location.state.validated) {
            console.log("DIDMOINT", this.props.location.state.validated);
            //this.setState({validated: this.props.location.state.validated})
            if (this.props.location.state.validated === "validated")
                toast("Your account has been successfully validated", {type: toast.TYPE.SUCCESS});
            else
                toast("This link has already been used or it is invalid", {type: toast.TYPE.ERROR});
            this.props.history.push('/login');
        }
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
            <div className='Login_Register__Container'>
                
                <Form className='Login_Register__Form' onSubmit={this.handleLogin}>
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