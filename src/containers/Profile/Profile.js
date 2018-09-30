import React, { Component } from 'react';
import axios from 'axios';
import { Checkbox, Card, Input, Select, Form, Button, TextArea } from 'semantic-ui-react';
import * as styles  from './Styles';
import ip from 'ip';
import TopMenu from '../../components/Menu/TopMenu';

class Profile extends Component{

    state = {
        login: "",
        first_name: "",
        last_name: "",
        email: "",
        old_password: "",
        password1: "",
        password2: "",
        share_location: false,
        gender: "",
        orientation: "",
        bio: "",
        birthdate: "",
        current_location: "",
        last_visit: "",
        latitude: "",
        longitude: ""
    }
    
    handleChange = async (e, data) => {
        if (data.name === "share_location") {
            const { name, checked } = data;    
            this.setState({ [name]: checked });
            const geolocation = navigator.geolocation;
            await geolocation.getCurrentPosition((position) => {
                console.log(position);
                console.log(ip.address());
            });
            console.log(ip.address());
        } else if (data.name === "gender" || data.name === "orientation") {
            const { name, value } = data;    
            this.setState({ [name]: value });
        }else {
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
                                insertId,
                                share_location,
                                last_visit,
                                latitude,
                                longitude,
                                gender,
                                orientation,
                                bio,
                                birthdate,
                                popularity
                            }
                        }
                    `;

        const token = sessionStorage.getItem("token");

        axios.post(`/api`,
            {
                query: query,
                variables: {
                    token: token
                }
            })
            .then( response => {
                console.log('response', response);
                if (!response.data.errors) {
                    // format birtdate to fit the form format
                    const bday = new Date(response.data.data.getUser.birthdate / 1);
                    let bday_string = `${bday.getFullYear()}-${(bday.getMonth() + 1) <10 ? '0' + (bday.getMonth() + 1) : (bday.getMonth() + 1)}-${(bday.getDate() + 1) <10 ? '0' + (bday.getDate() + 1) : (bday.getDate() + 1)}`;
                    this.setState({...this.state,
                        login: response.data.data.getUser.login,
                        first_name: response.data.data.getUser.first_name,
                        last_name :response.data.data.getUser.last_name,
                        email: response.data.data.getUser.email,
                        share_location: response.data.data.getUser.share_location,
                        last_visit: response.data.data.getUser.last_visit,
                        gender: response.data.data.getUser.gender,
                        orientation: response.data.data.getUser.orientation,
                        bio: response.data.data.getUser.bio,
                        birthdate: bday_string,
                        popularity: response.data.data.getUser.popularity
                });
                }
                else
                    console.log("TOAST", response.data.errors[0].statusCode, response.data.errors[0].message);
                return response.data.data;
            });
    }

    handleUpdate = async (e) => {
        e.preventDefault();
        console.log('in handle register');
        const query = `
                        mutation updateUser($token: String, $user: AddUserInput!, $profile: AddProfileInput!) {
                            updateUser(token: $token, user: $user, profile: $profile)
                        }
                    `;

        const user = {
            user_name: this.state.login,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password1
        }

        const profile = {
            gender: this.state.gender,
            orientation: this.state.orientation,
            bio: this.state.bio,
            popularity: 5000,
            birthdate: this.state.birthdate,
            old_password: this.state.old_password,
            share_location: this.state.share_location
        }

        const result = await axios.post(`/api`, {   query: query,
            variables: { 
            token: sessionStorage.getItem("token"), 
            user: user,
            profile: profile
            }
});
console.log("RES", result.data.errors);
console.log('data', result.data.data);
if (!result.data.errors)
    console.log("TOAST", "update successfully");
else
console.log("TOAST", result.data.errors[0].statusCode, result.data.errors[0].message);

    }

    render () {
        const gender_options = [
            { key: 'male', text: 'Male', value: 'male' },
            { key: 'female', text: 'Female', value: 'female' },
            { key: 'other', text: 'Other', value: 'other' }
          ]
        
        const orientation_options = [
            { key: 'male', text: 'Male', value: 'male' },
            { key: 'female', text: 'Female', value: 'female' },
            { key: 'both', text: 'Both', value: 'both' },
            { key: 'other', text: 'Other', value: 'other' }
        ]

        console.log(localStorage.getItem("token"));
       return (
            <div className="Profile_Container">
                <TopMenu />
                <Card style={styles.card} centered>
                    <Card.Content header={this.state.login} />
                    <Card.Content description={
                         <Form onSubmit= {this.handleUpdate}>
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
                                <label htmlFor="old_password">Old password</label>
                                <Input type="password" onChange={this.handleChange} name="old_password" value={ this.state.old_password } placeholder="Old password" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="password1">New password</label>
                                <Input type="password" onChange={this.handleChange} name="password1" value={ this.state.password1 } placeholder="New password" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="password2">New password confirmation</label>
                                <Input type="password" onChange={this.handleChange} name="password2" value={ this.state.password2 } placeholder="New password confirmation" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="share_location">Share current location?</label>
                                <Checkbox toggle onChange={this.handleChange} name="share_location" checked={this.state.location_check}/>
                            </Form.Field>
                            {this.state.share_location &&
                            <Form.Field>
                                <label htmlFor="current_location">Current location</label>
                                <Input type="text" onChange={this.handleChange} name="current_location" value={ this.state.current_location } placeholder="Current location"></Input>
                            </Form.Field>
                            }
                            <Form.Field>
                                <label htmlFor="Latitude">Latitude</label>
                                <Input type="number" onChange={this.handleChange} name="latitude" value={ this.state.latitude } placeholder="Latitude" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Longitude">Longitude</label>
                                <Input type="number" onChange={this.handleChange} name="longitude" value={ this.state.longitude } placeholder="Longitude" required></Input>                   
                            </Form.Field>
                            
                            
                            <Form.Field>
                                <label htmlFor="gender">Gender</label>
                                <Select compact options={gender_options} defaultValue='Please choose a gender' onChange={this.handleChange} name="gender" value={ this.state.gender } required></Select>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Orientation">Orientation</label>
                                <Select compact options={orientation_options} defaultValue='Please choose an orientation' onChange={this.handleChange} name="orientation" value={ this.state.orientation } required></Select>                   
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