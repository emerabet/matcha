import React from 'react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Component } from 'react';
import { Divider, Form, Button } from 'semantic-ui-react';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { toast } from 'react-toastify';

class  Login extends Component {
   
    state = {
        username: '',
        password: ''
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state !== undefined && this.props.location.state.validated) {
            if (this.props.location.state.validated === "validated")
                toast("Your account has been successfully validated", {type: toast.TYPE.SUCCESS});
            else if (this.props.location.state.validated === "reset")
                toast("Your password has been successfully changed", {type: toast.TYPE.SUCCESS});
            else
                toast("This link has already been used or it is invalid", {type: toast.TYPE.ERROR});
            this.props.history.push('/login');
        }
    }

    callBackLogin = (res) => {
        toast(res, {type: toast.TYPE.ERROR});
    }

    handleLogin = async (e) => {
        e.preventDefault();
        await this.props.onLogin(this.state.username, this.state.password, this.props.socket, this.callBackLogin);
        this.props.history.push('/home');
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleRegister = () => {
        this.props.history.push('/register');
    }

    resetPassword = (e) => {
        e.preventDefault();
        this.props.history.push('/reset_password');
    }

    render (){
        return (
            <div className='Login_Register__Container'>
                <span className='Login__Title'>MATCHA</span>
                <Form className='Login_Register__Form' onSubmit={this.handleLogin}>
                    <Form.Field>
                        <label>Username</label>
                        <input name="username" onChange={this.handleChange} placeholder='Username' required />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name="password" type='password' onChange={this.handleChange} placeholder='Password' required />
                    </Form.Field>

                    <Button fluid color='pink' type='submit'>Login</Button>
                    <Divider horizontal>Or</Divider>
                    <Button type="button" secondary fluid onClick={this.handleRegister}>Register</Button>
                    <Divider horizontal></Divider>
                    <Button type="button" basic fluid color='pink' onClick={this.resetPassword}>
                        Password forgotten
                    </Button>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (userName, password, socket, callBackLogin) => dispatch(actions.login(userName, password, socket, callBackLogin))
    }
}

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Login));