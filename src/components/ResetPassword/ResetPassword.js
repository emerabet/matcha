import React from 'react';
import { Component } from 'react';
import { Divider, Input, Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { toast } from 'react-toastify';
import { handleBlur } from '../../Tools/Form';
import * as headers from '../../Tools/Header';

class  ResetPassword extends Component {
   
    state = {
        username: "",
        userNameAlreadyTaken: true,
        sent: false
    }

    handleReset = async (e) => {
        e.preventDefault();
        const query = `
            mutation resetPassword($login: String!) {
            resetPassword(login: $login)
        }
        `;

        const result = await axios.post(`/api`, {   query: query,
        variables: { 
        login: this.state.username
        }
        }, headers.headers());
        this.setState({sent: true});
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleBlur = async (e, data) => {
        this.setState(await handleBlur(e, data));
    }

    render (){
        return (
            <div className='Login_Register__Container'>
                
                <Form className='Login_Register__Form' onSubmit={this.handleReset}>
                    <Form.Field>
                        <label style={this.state.userNameAlreadyTaken ? null : {color: "red"}}>Username {!this.state.userNameAlreadyTaken && "this user name is unknown"}</label>
                        <input name="username" onBlur={this.handleBlur} onChange={this.handleChange} placeholder='Username' required />
                    </Form.Field>
                    {this.state.sent && <span> An email has been sent to you </span>}
                    <Button primary fluid type='submit' disabled={this.state.username !== "" && this.state.userNameAlreadyTaken ? false : true}>Reset Password</Button>
                </Form>
            </div>
        );
    }
}

export default ResetPassword;