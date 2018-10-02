import React, { Component } from 'react';
import axios from 'axios';
import { Checkbox, Card, Input, Select, Form, Button, TextArea, Image } from 'semantic-ui-react';
import * as styles  from './Styles';
import ip from 'ip';
import TopMenu from '../../components/Menu/TopMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import publicIp from 'public-ip';
import Chips from 'react-chips';
import './Profile.css';
import { handleBlur } from '../../Tools/Form';

let geolocation;

class Profile extends Component{

    state = {
        oldLogin: "",
        login: "",
        first_name: "",
        last_name: "",
        oldEmail: "",
        email: "",
        old_password: "",
        password1: "",
        password2: "",
        share_location: 0,
        gender: "",
        orientation: "",
        bio: "",
        birthdate: "",
        current_location: "",
        last_visit: "",
        latitude: 0,
        longitude: 0,
        tags: [],
        new_tags: [],
        delete_tags: [],
        all_tags: [],
        popularity: "",
        tag : "",
        ip: "0",
        userNameAlreadyTaken: false,
        emailAlreadyTaken: false
    }
    
    handleChange = async (e, data) => {
        if (data.name === "share_location")
            this.setState({ [data.name]: data.checked ? 1 : 0 });
        else if (data.name === "gender" || data.name === "orientation") 
            this.setState({ [data.name]: data.value });
        else 
            this.setState({ [e.target.name]: e.target.value });
    }

    async componentDidMount() {
        const query_tags = `query getTags{
                                getTags{
                                   tag
                                }                   
                            }`;
        // getting the list of all tags from the api
        const res = await axios.post(`/api`,
        {
            query: query_tags
        });
        
        const query = `
                        query getUser ($token: String!, $extended: Boolean) {
                            getUser(token: $token, extended: $extended){
                                user_id,
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
                                popularity,
                                tags {tag}
                            }
                        }
                    `;

        const token = sessionStorage.getItem("token");

        axios.post(`/api`,
            {
                query: query,
                variables: {
                    token: token,
                    extended: true
                }
            })
            .then( response => {
                console.log('response', response);
                if (!response.data.errors) {
                    // formating birthdate to fit the form format
                    const bday = new Date(response.data.data.getUser.birthdate / 1);
                    let bday_string = `${bday.getFullYear()}-${(bday.getMonth() + 1) <10 ? '0' + (bday.getMonth() + 1) : (bday.getMonth() + 1)}-${(bday.getDate() + 1) <10 ? '0' + (bday.getDate() + 1) : (bday.getDate() + 1)}`;
                    this.setState({...this.state,
                        oldLogin: response.data.data.getUser.login,
                        login: response.data.data.getUser.login,
                        first_name: response.data.data.getUser.first_name,
                        last_name :response.data.data.getUser.last_name,
                        oldEmail: response.data.data.getUser.email,
                        email: response.data.data.getUser.email,
                        share_location: response.data.data.getUser.share_location,
                        last_visit: response.data.data.getUser.last_visit,
                        gender: response.data.data.getUser.gender,
                        orientation: response.data.data.getUser.orientation,
                        bio: response.data.data.getUser.bio,
                        birthdate: bday_string,
                        popularity: response.data.data.getUser.popularity,
                        tags: response.data.data.getUser.tags.map(elem => {
                            return elem.tag;
                        }),
                        all_tags: res.data.data.getTags.map((element) => {
                            return element.tag;
                        })
                });
                    
                }
                else
                    toast("Error while getting your profile. Please try to unlog and the relog !", {type: toast.TYPE.ERROR});
                return response.data.data;
            });
    }

    updateUserInfo = async (ip, latitude = 0, longitude = 0) => {
        const query = `
                        mutation updateUser($token: String!, $user: AddUserInput!, $profile: AddProfileInput!, $address: AddAddressInput!) {
                            updateUser(token: $token, user: $user, profile: $profile, address: $address)
                        }
                    `;

        const user = {
            user_name: this.state.login,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password1,
            old_password: this.state.old_password
        }

        const profile = {
            gender: this.state.gender,
            orientation: this.state.orientation,
            bio: this.state.bio,
            popularity: 5000,
            birthdate: this.state.birthdate,
            old_password: this.state.old_password,
            share_location: this.state.share_location,
            new_tags: this.state.new_tags,
            delete_tags: this.state.delete_tags
        }

        const address = {
            latitude: latitude,
            longitude: longitude,
            ip: ip
        }

        const result = await axios.post(`/api`, {   query: query,
            variables: { 
            token: sessionStorage.getItem("token"), 
            user: user,
            profile: profile,
            address: address
            }
        });

        if (!result.data.errors)
            toast("Profile updated successfully", {type: toast.TYPE.SUCCESS});
        else
            toast("Error updating your profile information, please check that the password you put is correct !", {type: toast.TYPE.ERROR});
    }

    handleUpdate = async (e) => {
        e.preventDefault();
        const ip = await publicIp.v4();
        console.log("V4", ip);
            
        if (this.state.share_location === 1) {
            geolocation = navigator.geolocation;
            geolocation.getCurrentPosition((position) => {
                this.updateUserInfo(ip, position.coords.latitude, position.coords.longitude);  
            });
        } else
            this.updateUserInfo(ip);
    }

    handleAddChip = (chip) => {
        const chips = [...this.state.tags, chip];
        this.setState({tags: chips});
    }

    handleDeleteChip = (chip, index) => {
        const chips = this.state.tags.filter((element) => {
            return element !== chip;
        });
        this.setState({tags: chips});
    }

    handleUpdateInput = (searchText) => {
        this.setState({
          searchText: searchText,
        });
      };
    
    onTagChange = async tags => {
        const old_tags = this.state.tags;
        await this.setState({ new_tags: tags.filter(elem => {
                return old_tags.indexOf(elem) === -1;
            }) 
        });
        await this.setState({ delete_tags: old_tags.filter(elem => {
            return tags.indexOf(elem) === -1;
            }) 
        });
    }

    handleBlur = async (e, data) => {
        console.log("blur");
        this.setState(await handleBlur(e, data));
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

        const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        const passOK = (this.state.password1 === this.state.password2) && passwordRegex.test(this.state.password1);
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailOK = emailRegex.test(String(this.state.email).toLowerCase()) && this.state.email !== "";
        const oldPassOK = this.state.old_password !== "";

       return (
            <div className="Profile_Container">
                <ToastContainer />
                <TopMenu />
                <Card style={styles.card} centered>
                    <Card.Content header={ <div><Image src='/images/wireframe/square-image.png' size='medium' rounded /> <label className="login">{` ${this.state.login} (${ this.state.popularity } pts)`}</label> </div>} />
                    <Card.Content description={
                         <Form onSubmit= {this.handleUpdate}>
                            <Form.Field>
                                <label style={this.state.userNameAlreadyTaken ? styles.nok : null} htmlFor="login">User name {this.state.userNameAlreadyTaken && `(This user name is already in use, please choose another user name)`}</label>
                                <Input type="text" onChange={this.handleChange} onBlur={(this.state.oldLogin !== this.state.login) ? this.handleBlur : null} name="login" value={ this.state.login } placeholder="User name" required></Input>
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
                                <label style={emailOK ? styles.ok : styles.nok} htmlFor="email">Email</label>
                                <Input type="email" onChange={this.handleChange} name="email" value={ this.state.email } placeholder="Email" required></Input>
                            </Form.Field>
                            <Form.Field>
                                <label style={oldPassOK ? styles.ok : styles.nok} htmlFor="old_password">Current password (your must enter your current password to update your profile)</label>
                                <Input type="password" onChange={this.handleChange} name="old_password" value={ this.state.old_password } placeholder="Current password" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label style={(this.state.password1 !== "" && this.state.password2 !== "") ? (passOK ? styles.ok : styles.nok) : null} htmlFor="password1">New password (must contains at least 8 characters including a lower letter, a capital letter and a number)</label>
                                <Input type="password" onChange={this.handleChange} name="password1" value={ this.state.password1 } placeholder="New password"></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label style={(this.state.password1 !== "" && this.state.password2 !== "") ? (passOK ? styles.ok : styles.nok) : null} htmlFor="password2">New password confirmation</label>
                                <Input type="password" onChange={this.handleChange} name="password2" value={ this.state.password2 } placeholder="New password confirmation"></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="share_location">Share current location?</label>
                                <Checkbox toggle onChange={this.handleChange} name="share_location" checked={this.state.share_location === 1 ? true : false}/>
                            </Form.Field>
                            {this.state.share_location &&
                            <Form.Field>
                                <label htmlFor="current_location">Current location</label>
                                <Input type="text" onChange={this.handleChange} name="current_location" value={ this.state.current_location } placeholder="Current location"></Input>
                            </Form.Field>
                            }
                            <Form.Field>
                                <label htmlFor="Latitude">Latitude</label>
                                <Input type="text" onChange={this.handleChange} name="latitude" value={ this.state.latitude } placeholder="Latitude" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Longitude">Longitude</label>
                                <Input type="text" onChange={this.handleChange} name="longitude" value={ this.state.longitude } placeholder="Longitude" required></Input>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Ip">Ip</label>
                                <Input type="text" onChange={this.handleChange} name="ip" value={ this.state.ip } placeholder="Ip" required></Input>                   
                            </Form.Field>
                            
                            
                            <Form.Field>
                                <label htmlFor="gender">Gender</label>
                                <Select compact options={gender_options} onChange={this.handleChange} name="gender" value={ this.state.gender } required></Select>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="Orientation">Orientation</label>
                                <Select compact options={orientation_options} onChange={this.handleChange} name="orientation" value={ this.state.orientation } required></Select>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="bio">Bio</label>
                                <TextArea type="textArea" onChange={this.handleChange} name="bio" value={ this.state.bio } placeholder="Bio" required></TextArea>                   
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="interest">Interest (Please press tab to add an interest)</label>
                                
                                <Chips
                                    value={[...this.state.tags.filter(elem => {
                                        return this.state.delete_tags.indexOf(elem) === -1;
                                    }), ...this.state.new_tags]}
                                    
                                    onChange={this.onTagChange}
                                    suggestions={this.state.all_tags}
                            
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="birthdate">Birthdate</label>
                                <Input type="date" onChange={this.handleChange} name="birthdate" value={ this.state.birthdate } placeholder="Birthdate" required></Input>                   
                            </Form.Field>
                            
                            <Button type='submit' disabled = {!((passOK || (this.state.password1 === "" && this.state.password2 === "")) && emailOK && oldPassOK)}>Update profile information</Button>
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