import React from 'react';
import { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import { handleBlur } from '../../Tools/Form';
import * as headers from '../../Tools/Header';
import toast from 'react-toastify';

class  ResetPassword extends Component {
   
    state = {
        login: "",
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

        await axios.post(`/api`, {   query: query,
        variables: { 
        login: this.state.login
        }
        }, headers.headers());
        this.setState({sent: true});
        toast("An email has been sent to you", {type: toast.TYPE.SUCCESS});
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
                        <input name="login" onBlur={this.handleBlur} onChange={this.handleChange} placeholder='Username' required />
                    </Form.Field>
                    {this.state.sent && <span> An email has been sent to you </span>}
                    <Button primary fluid type='submit' disabled={this.state.login !== "" && this.state.userNameAlreadyTaken ? false : true}>Reset Password</Button>
                </Form>
            </div>
        );
    }
}

export default ResetPassword;