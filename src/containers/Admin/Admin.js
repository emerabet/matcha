import React from 'react';
import { connect } from 'react-redux';
import { Component } from 'react';
import { Divider, Input, Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { toast } from 'react-toastify';

class  Admin extends Component {
   
    state = {
        username: '',
        password: '',
        logged: false
    }

    handleLogin = async (e) => {
        e.preventDefault();
       // await this.props.onAdminLogin(this.state.username, this.state.password, this.props.socket, this.callBackLogin);
        //this.props.history.push('/home');
    }

    callBackLogin = () => {

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render (){

        return ( 
            <div className='Login_Register__Container'>
                <h2> Login as an admin </h2>
                <Form className='Login_Register__Form' onSubmit={this.handleLogin}>
                    <Form.Field>
                        <label>Username</label>
                        <input name="username" onChange={this.handleChange} placeholder='Username' required />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name="password" type='password' onChange={this.handleChange} placeholder='Password' required />
                    </Form.Field>

                    <Button primary fluid type='submit'>Login</Button>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = null /*(dispatch) => {
    return {
        onAdminLogin: (userName, password, socket, callBackLogin) => dispatch(actions.adminLogin(userName, password, socket, callBackLogin))
    }
}*/

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Admin));