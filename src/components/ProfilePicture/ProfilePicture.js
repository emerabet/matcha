import React, { Component } from 'react';
import { Range } from 'rc-slider';
import Slider from 'rc-slider';
import { Button, Form, Dropdown, Modal, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as styles  from './Styles';
import axios from 'axios';

class ProfilePicture extends Component {
    
    handleUpload = async (e) => {
        console.log("name", e.target.name);
        console.log("file", e.target.value);
        console.log("F", e.target.files[0]);
        console.log("KEY", e.target.key);

        const data = new FormData();
        data.append('filename', "test.png");
        data.append('token', sessionStorage.getItem("token"));
        data.append('type', e.target.name);
        data.append('picture_id', this.props.picture_id);
        data.append('src', this.props.picture_src);
        data.append('file', e.target.files[0], sessionStorage.getItem('token'));

        const res = await axios.post('/upload_picture', data);
        console.log("res", res);
        console.log("INSERT ID", res.insertId);
        console.log("UPLOADED");
        console.log("SIZE", res.data.pictures.length);

        this.props.handleRefresh(res.data.pictures);
        /*
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
        }*/
    }
 
    render () {
        return (
            <Modal trigger={<div style={{marginLeft: "10px"}} >
                                <label style={{display: "flex", flexDirection: "column"}} className="ui huge red left floated button">
                                    <Image name="profile_picture" style={{marginBottom: "5px"}} src={this.props.picture_src} size='medium' rounded />
                                        {` ${this.props.old_login} (${ this.props.popularity } pts)`}
                                </label>                            
                            </div>}>
                            <Modal.Header>Display picture</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='massive' src={this.props.picture_src} rounded/>
                                    <Modal.Description>            
                                        <input type="file" style={styles.hiddenInput} onChange={this.handleUpload} name="profile_picture" className="inputfile" onChange={this.handleUpload} id="upload_other_picture" />
                                        <label style={{width: "350px"}}  className="ui huge gray right floated button" htmlFor="upload_other_picture">
                                            Upload an other picture
                                        </label>
                                        <label style={{width: "350px"}} className="ui huge red right floated button" htmlFor="delete_picture">
                                            Delete this picture
                                        </label>
                                    </Modal.Description>
                                </Modal.Content>
            </Modal>
        );
    }
}

export default ProfilePicture;