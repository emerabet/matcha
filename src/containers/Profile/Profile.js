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
                        query getUser ($id: Int) {
                            getUser(id: $id){
                                login
                            }
                        }
                    `;

        
        axios.post(`/api`,
            {
                query: query,
                variables: {
                    id: 5
                }
            })
            .then( response => {
                this.setState({...this.state, userName: response.data.data.getUser.login});
                console.log("response", response.data.data.getUser.login);   
                return response.data.data;
            });
    }


    render () {
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