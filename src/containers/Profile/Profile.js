import React, { Component } from 'react';
import classes from './Profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-ui/core';

class Profile extends Component{

    state = {
        userName: "",
        firstName: "",
        lastName: "",
        email: ""
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        const query = `
                        query getUser ($token: String) {
                            getUser(token: $token){
                                login,
                                first_name,
                                last_name,
                                email
                            }
                        }
                    `;

        const token = localStorage.getItem("token");

        axios.post(`/api`,
            {
                query: query,
                variables: {
                    token: token
                }
            })
            .then( response => {
                console.log('response', response);
                if (!response.data.errors)
                    this.setState({...this.state,
                        userName: response.data.data.getUser.login,
                        firstName: response.data.data.getUser.first_name,
                        lastName :response.data.data.getUser.last_name,
                        email: response.data.data.getUser.email
                });
                else
                    console.log("TOAST", response.data.errors[0].statusCode, response.data.errors[0].message);
                return response.data.data;
            });
    }


    render () {
        console.log(localStorage.getItem("token"));
       return (
            <div className={classes.Container}>
                <form className={classes.Profile} onSubmit={this.handleRegister}>
                    <label htmlFor="userName">Username</label>
                    <input type="text" onChange={this.handleChange} name="userName" value={ this.state.userName } placeholder="User name" required></input>
                    
                    <label htmlFor="firstName">First name</label>
                    <input type="text" onChange={this.handleChange} name="firstName" value={ this.state.firstName } placeholder="First name" required></input>
                    
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" onChange={this.handleChange} name="lastName" value={ this.state.lastName } placeholder="Last name" required></input>
                    
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={this.handleChange} name="email" value={ this.state.email } placeholder="Email" required></input>
                    
                    <button type="submit">Update profile information</button>
                </form>
            </div>
        )
    }
}

export default Profile;