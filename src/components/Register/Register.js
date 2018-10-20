import React, { Component } from 'react';
import classes from './Register.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Input, Form, Button } from 'semantic-ui-react';
import * as styles  from './Styles';
import publicIp from 'public-ip';
import { handleBlur } from '../../Tools/Form';

class Register extends Component{

    state = {
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password1: '',
        password2: '',
        userNameAlreadyTaken: false,
        emailAlreadyTaken: false
    }

    handleRegister = async (e) => {
        e.preventDefault();
        const ip = await publicIp.v4();
        const query = `
                        mutation addUser($user: AddUserInput!, $address: AddAddressInput!) {
                            addUser(user: $user, address: $address)
                        }
                    `;

        const user = {
            user_name: this.state.userName,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
            password: this.state.password1
        }

        const address = {
            latitude: 0,
            longitude: 0,
            ip: ip
        }
        
            const result = await axios.post(`/api`, {   query: query,
                                                        variables: { user: user, address: address }
                                            });
            if (!result.data.errors)
                this.props.history.push('/login');
            else
                console.log("TOAST", result.data.errors[0].statusCode, result.data.errors[0].message);
    }

    handleChange = (e, data) => {
        this.setState({ [data.name]: data.value });
    }

    handleBlur = async (e, data) => {
        this.setState(await handleBlur(e, data));
    }

    render () {
        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        const passOK = (this.state.password1 === this.state.password2) && passwordRegex.test(this.state.password1);
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailOK = emailRegex.test(String(this.state.email).toLowerCase()) && this.state.email !== "";

       return (
            <div className="Register_Container">
            <Card style={styles.card} centered>
                    <Card.Content header={`Register`} />
                    <Card.Content description={
                <Form className={classes.Register} onSubmit={this.handleRegister}>
                    <Form.Field>
                    <label style={this.state.userNameAlreadyTaken ? styles.nok : null} htmlFor='userName'>Username {this.state.userNameAlreadyTaken && `(This user name is already in use, please choose another user name)`}</label>
                        <Input type='text' onChange={this.handleChange} onBlur={this.handleBlur} name='userName' value={ this.state.userName } placeholder='User name' required></Input>
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor='firstName'>First name</label>
                        <Input type='text' onChange={this.handleChange} name='firstName' value={ this.state.firstName } placeholder='First name' required></Input>
                        </Form.Field>
                    <Form.Field>
                        <label htmlFor='lastName'>Last name</label>
                        <Input type='text' onChange={this.handleChange} name='lastName' value={ this.state.lastName } placeholder='Last name' required></Input>
                    </Form.Field>
                    <Form.Field>
                        <label style={(emailOK && !this.state.emailAlreadyTaken) ? styles.ok : styles.nok} htmlFor='email'>Email {this.state.emailAlreadyTaken && `(This user name is already in use, please choose another user name)`}</label>
                        <Input type='email' onChange={this.handleChange} onBlur={this.handleBlur} name='email' value={ this.state.email } placeholder='Email' required></Input>
                    </Form.Field>
                    <Form.Field>
                        <label style={(this.state.password1 !== "" && this.state.password2 !== "") ? (passOK ? styles.ok : styles.nok) : null} htmlFor='password1'>Password</label>
                        <Input type='password' onChange={this.handleChange} name='password1' value={ this.state.password1 } placeholder='Password' required></Input>
                    </Form.Field>
                    <Form.Field>
                        <label style={(this.state.password1 !== "" && this.state.password2 !== "") ? (passOK ? styles.ok : styles.nok) : null} htmlFor='password2'>Confirm password</label>
                        <Input type='password' onChange={this.handleChange} name='password2' value={ this.state.password2 } placeholder='Confirm password' required></Input>
                    </Form.Field>
                    <Button type='submit' disabled = {this.state.userNameAlreadyTaken || this.state.emailAlreadyTaken || (!((passOK || (this.state.password1 === "" && this.state.password2 === "")) && emailOK))}>Register</Button>
                </Form>
                } />
                <Card.Content extra>
                <Link to='/login'> Login </Link>
                </Card.Content>
            </Card>
                
            </div>
        )
    }
}

export default Register;