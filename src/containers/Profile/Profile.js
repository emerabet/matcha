import React, { Component } from 'react';
import classes from './Profile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Checkbox, Card, Input, Label, Form, Button, TextArea } from 'semantic-ui-react';
import * as styles  from './Styles';

class Profile extends Component{

    state = {
        login: "",
        first_name: "",
        last_name: "",
        email: "",
        share_location: false,
        gender: "",
        orientation: "",
        bio: "",
        birthdate: "",
        current_location: "",
        last_visit: ""
    }
    
    handleChange = (e, data) => {
        if (data.name == "share_location") {
            const { name, checked } = data;    
            this.setState({ [name]: checked });
            const geolocation = navigator.geolocation;
            geolocation.getCurrentPosition((position) => {
                console.log(position);
            });
        } else {
            const { name, value } = e.target;
            this.setState({ [name]: value });
        }
    }

    componentDidMount() {
        const query = `
                        query getUser ($token: String) {
                            getUser(token: $token){
                                login,
                                first_name,
                                last_name,
                                email,
                                share_location,
                                last_visit
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
                        login: response.data.data.getUser.login,
                        first_name: response.data.data.getUser.first_name,
                        last_name :response.data.data.getUser.last_name,
                        email: response.data.data.getUser.email,
                        share_location: response.data.data.getUser.share_location,
                        last_visit: response.data.data.getUser.last_visit
                });
                else
                    console.log("TOAST", response.data.errors[0].statusCode, response.data.errors[0].message);
                return response.data.data;
            });
    }




    render () {
        console.log(localStorage.getItem("token"));
       return (
            <div>
                <Card style={styles.card} centered>
                    <Card.Content header={this.state.login} />
                    <Card.Content description={
                         <Form>
                            <Form.Field>
                                <label htmlFor="login">User name</label>
                                <Input type="text" onChange={this.handleChange} name="login" value={ this.state.login } placeholder="User name" required></Input>
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="first_name">First name</label>
                                <Input type="text" onChange={this.handleChange} name="first_name" value={ this.state.first_name } placeholder="First name" required></Input>
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="last_name">Last name</label>
                                <Input type="text" onChange={this.handleChange} name="last_name" value={ this.state.last_name } placeholder="Last name" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="email">Email</label>
                                <Input type="email" onChange={this.handleChange} name="email" value={ this.state.email } placeholder="Email" required></Input>
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="share_location">Share current location?</label>
                                <Checkbox toggle onChange={this.handleChange} name="share_location" checked={this.state.location_check}/>
                            </Form.Field>
                            {this.state.share_location &&
                            <Form.Field>
                                <label htmlFor="current_location">Current location</label>
                                <Input type="text" onChange={this.handleChange} name="current_location" value={ this.state.current_location } placeholder="Current location" required></Input>
                            </Form.Field>
                            }
                            <Form.Field>
                                <label htmlFor="gender">Gender</label>
                                <Input type="text" onChange={this.handleChange} name="gender" value={ this.state.gender } placeholder="Gender" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Orientation">Orientation</label>
                                <Input type="text" onChange={this.handleChange} name="orientation" value={ this.state.orientation } placeholder="Orientation" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="bio">Bio</label>
                                <TextArea type="textArea" onChange={this.handleChange} name="bio" value={ this.state.bio } placeholder="Bio" required></TextArea>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="birthdate">Birthdate</label>
                                <Input type="date" onChange={this.handleChange} name="birthdate" value={ this.state.birthdate } placeholder="Birthdate" required></Input>                   
                            </Form.Field>
                            
                            <Button type='submit'>Update profile information</Button>
                       </Form>
                    } />
                    <Card.Content extra>
                        Last visit: {new Date(this.state.last_visit / 1).toDateString()}
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

export default Profile;