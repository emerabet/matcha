import React, { Component } from 'react';
import classes from './Register.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Register extends Component{

    state = {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password1: "",
        password2: ""
    }

    handleRegister = async (e) => {
        e.preventDefault();
        console.log('in handle register');
        const query = {
            query: `
            {

            }`            
        }
        axios.post('/api', query);
        //this.props.history.push('/home');
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render () {
       return (
            <div className={classes.Container}>
                <form className={classes.Register} onSubmit={this.handleRegister}>
                    <label htmlFor="userName">Username</label>
                    <input type="text" onChange={this.handleChange} name="userName" value={ this.state.userName } placeholder="User name" required></input>
                    
                    <label htmlFor="firstName">First name</label>
                    <input type="text" onChange={this.handleChange} name="fisrtName" value={ this.state.firstName } placeholder="First name" required></input>
                    
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" onChange={this.handleChange} name="lastName" value={ this.state.lastName } placeholder="Last name" required></input>
                    
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={this.handleChange} name="email" value={ this.state.email } placeholder="Email" required></input>
                    
                    <label htmlFor="password1">Password</label>
                    <input type="password" onChange={this.handleChange} name="password1" value={ this.state.password1 } placeholder="Password" required></input>
                    
                    <label htmlFor="password2">Confirm password</label>
                    <input type="password" onChange={this.handleChange} name="password2" value={ this.state.password2 } placeholder="Confirm password" required></input>
                    
                    <button type="submit">Register</button>
                </form>
                <Link to="/login"> Login </Link>
            </div>
        )
    }
}

export default Register;