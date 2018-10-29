import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Popup } from 'semantic-ui-react';
import { toast } from 'react-toastify';

class NewPassword extends Component {

    state = {
        newPassword: "",
        newPasswordConfirmation: "",
        reset_token: ""
    }

    async componentDidMount() {
        
        //const status = result.data.data.confirmAccount === true ? "validated" : "nok";
        //this.props.history.push({
          //  pathname: '/login',
            //  search: '?query=abc',
           // state: { validated: status }
            //})
    }

    handleNewPassword = async (e) => {
        e.preventDefault();
        const reset_token = this.props.match.params.reset_token;
        const query = `
            mutation checkResetToken($reset_token: String!, $password: String!) {
                checkResetToken(reset_token: $reset_token, password: $password)
            }
            `;

        const result = await axios.post(`/api`, {   query: query,
            variables: { reset_token: reset_token, password: this.state.newPassword }
        });
        if (result.data.data.checkResetToken) {
            this.props.history.push({
                pathname: '/login',
                //  search: '?query=abc',
                state: { validated: "reset" }
                })
        }
        else
            toast("Something went wrong, your link may not be valid", {type: toast.TYPE.ERROR});
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        const passOK = (this.state.newPassword === this.state.newPasswordConfirmation) && passwordRegex.test(this.state.newPassword);

        return (
            <div className='Login_Register__Container'>
                <Form className='Login_Register__Form' onSubmit={this.handleNewPassword}>
                    <Popup trigger={
                        <Form.Field>
                            <label style={(this.state.newPassword !== "" && this.state.newPasswordConfirmation !== "") ? (passOK ? null : {color: "red"}) : null}>New password</label>
                            <input name="newPassword" type='password' onChange={this.handleChange} placeholder='New password' required />
                        </Form.Field>}
                        header="Password requirement"
                        content="must contains at least 8 characters including a lower letter, a capital letter and a number"
                    />
                    <Form.Field>
                        <label style={(this.state.newPassword !== "" && this.state.newPasswordConfirmation !== "") ? (passOK ? null : {color: "red"}) : null}>New password confirmation</label>
                        <input name="newPasswordConfirmation" type='password' onChange={this.handleChange} placeholder='New password confirmation' required />
                    </Form.Field>

                    <Button disabled={ (this.state.newPassword !== "" && this.state.newPasswordConfirmation !== "") ? (passOK ? false : true) : false } primary fluid type='submit'> Update my password </Button>
                </Form>
            </div>
        )
    }
}

export default NewPassword;