import React, { Component } from 'react';
import axios from 'axios';
import { Checkbox, Card, Input, Select, Form, Button, TextArea, Image, Modal, Header } from 'semantic-ui-react';
import * as styles  from './Styles';
import TopMenu from '../../components/Menu/TopMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import publicIp from 'public-ip';
import Chips from 'react-chips';
import './Profile.css';
import { handleBlur } from '../../Tools/Form';
import SidePicture from '../../components/SidePicture/SidePicture';
import ProfilePicture from '../../components/ProfilePicture/ProfilePicture';

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
        emailAlreadyTaken: false,
        pictures: [],
        profile_picture: "/pictures/smoke_by.png",
        profile_picture_id: 0
    }
    
    handleChange = async (e, data) => {
        if (data.name === "share_location")
            this.setState({ [data.name]: data.checked ? 1 : 0 });
        else if (data.name === "gender" || data.name === "orientation") 
            this.setState({ [data.name]: data.value });
        else 
            this.setState({ [e.target.name]: e.target.value });
    }

    haveProfilePicture = (pictures, get = 0) => {
        if (pictures.length > 0) {
            const profilePic = pictures.filter(pic => Number.parseInt(pic.priority, 10) === 1);
            if (profilePic.length > 0)
                return get === 0 ? true : profilePic[0];
            else
                return false;
        } else
            return false;
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
                                tags {tag},
                                pictures {picture_id, user_id, src, priority}
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
                    console.log(response.data.data.getUser.pictures);
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
                        }),
                        pictures: response.data.data.getUser.pictures,
                        profile_picture: this.haveProfilePicture(response.data.data.getUser.pictures) ? this.haveProfilePicture(response.data.data.getUser.pictures, 1).src : '/pictures/smoke_by.png',
                        profile_picture_id: this.haveProfilePicture(response.data.data.getUser.pictures) ? this.haveProfilePicture(response.data.data.getUser.pictures, 1).picture_id : 0
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
        switch (e.target.name) {
            case 'login':
                if (this.state.oldLogin !== this.state.login) {
                    this.setState(await handleBlur(e, data));        
                } else {
                    console.log("ok");
                    this.setState({userNameAlreadyTaken: false});
                }
                break ;
            case 'email':
                if (this.state.oldEmail !== this.state.email) {
                    this.setState(await handleBlur(e, data));        
                } else {
                    this.setState({emailAlreadyTaken: false});
                }
                break ;
            default:
                break ;
        }
    }

    handleClickedPhoto = async (e) => {
        console.log(e.target.id);
        //console.log("priority", this.state.pictures.filter(pic => Number.parseInt(pic.priority, 10) === 1)[0].src);
        //console.log("CLICKED", this.state.pictures.filter(pic => pic.picture_id === Number.parseInt(e.target.id, 10)));
        //this.setState({picture_id_clicked: e.target.id, picture_src_clicked: this.state.pictures.filter(pic => pic.picture_id === Number.parseInt(e.target.id, 10))[0].src});
    }

    handleUpload = async (e) => {
        console.log("name", e.target.name);
        console.log("file", e.target.value);
        console.log("F", e.target.files[0]);
        console.log("KEY", e.target.key);

        const data = new FormData();
        data.append('filename', "test.png");
        data.append('token', sessionStorage.getItem("token"));
        data.append('type', e.target.name);
      //  data.append('picture_id', this.state.picture_id_clicked);
       // data.append('src', this.state.picture_src_clicked);
        data.append('file', e.target.files[0], sessionStorage.getItem('token'));

        const res = await axios.post('/upload_picture', data);
        console.log("res", res);
        console.log("UPLOADED");
        console.log("SIZE", res.data.pictures.length);
        if (res.data.pictures.length > 0){
            if (res.data.pictures.filter(pic => Number.parseInt(pic.priority, 10) === 1).length > 0) {
                this.setState({pictures: res.data.pictures, profile_picture: res.data.pictures.filter(pic => Number.parseInt(pic.priority, 10) === 1)[0].src,
                    profile_picture_id: res.data.pictures.filter(pic => Number.parseInt(pic.priority, 10) === 1)[0].picture_id}
                    );
            }
            else {
                this.setState({pictures: res.data.pictures, profile_picture: "/pictures/smoke_by.png",
                    profile_picture_id: 0}
                    );
            }
        } else {
            this.setState({pictures: [], profile_picture: "/pictures/smoke_by.png",
                    profile_picture_id: 0}
                    );
        }
    }

    handleRefresh = (pictures) => {
        this.setState(
            {pictures: pictures,
            profile_picture: this.haveProfilePicture(pictures) ? this.haveProfilePicture(pictures, 1).src : '/pictures/smoke_by.png',
            profile_picture_id: this.haveProfilePicture(pictures) ? this.haveProfilePicture(pictures, 1).picture_id : 0
            }
        );
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
                    <Card.Content header={ <div style={{display: "flex"}}>
                        <div style={{width: "60px"}}>
                            {
                                this.state.pictures.map((pic) => {
                                    if (pic.priority === 0){
                                        return (
                                            <SidePicture pic={pic} key={pic.picture_id} handleRefresh={this.handleRefresh} />
                                        );
                                    }
                                    })
                            }
                            {this.state.pictures.reduce(function (n, pic) {
                                    return n + (pic.priority === 0);
                                }, 0) < 4 && <div>
                                <input type="file" style={styles.hiddenInput} name="side_picture" className="inputfile" onChange={this.handleUpload} id="empty_picture" />
                                    <label htmlFor="empty_picture">
                                        <Image id={0} name="empty_picture" style={styles.picture} src="/pictures/upload.png" size='tiny' rounded />
                                    </label>
                            </div>}
                            

  </div>
                                                        <ProfilePicture picture_src={this.state.profile_picture} picture_id={this.state.profile_picture_id} old_login={this.state.oldLogin} popularity={this.state.popularity} handleRefresh={this.handleRefresh} />
                                                        
                                            </div>} />
                    <Card.Content description={
                         <Form onSubmit= {this.handleUpdate}>
                            <Form.Field>
                                <label style={this.state.userNameAlreadyTaken ? styles.nok : null} htmlFor="login">User name {this.state.userNameAlreadyTaken && `(This user name is already in use, please choose another user name)`}</label>
                                <Input type="text" onChange={this.handleChange} onBlur={this.handleBlur} name="login" value={ this.state.login } placeholder="User name" required></Input>
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
                                <label style={!this.state.emailAlreadyTaken && emailOK ? styles.ok : styles.nok} htmlFor="email">Email {this.emailAlreadyTaken && `(An account has already been created with this email)`}</label>
                                <Input type="email" onChange={this.handleChange} onBlur={this.handleBlur} name="email" value={ this.state.email } placeholder="Email" required></Input>
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
                            
                            <Button type='submit' disabled = {!((passOK || (this.state.password1 === "" && this.state.password2 === "")) && !this.state.userNameAlreadyTaken && !this.emailAlreadyTaken && emailOK && oldPassOK)}>Update profile information</Button>
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