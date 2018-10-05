import React, { Component } from 'react';
import { Range } from 'rc-slider';
import Slider from 'rc-slider';
import { Button, Form, Dropdown, Modal, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as styles  from './Styles';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class ProfilePicture extends Component {
    
    handleUpload = async (e) => {
        console.log("name", e.target.name);
        console.log("file", e.target.value);
        console.log("F", e.target.files[0]);
        console.log("KEY", e.target.key);

        const data = new FormData();
        data.append('filename', "test.png");
       // data.append('token', localStorage.getItem("token"));
        data.append('type', e.target.name);
        data.append('picture_id', this.props.picture_id);
        data.append('src', this.props.picture_src);
        data.append('file', e.target.files[0], localStorage.getItem('token'));
        
        const res = await axios.post('/upload_picture', data, headers.headers());
        console.log("res", res);
        console.log("INSERT ID", res.insertId);
        console.log("UPLOADED");
        console.log("SIZE", res.data.pictures.length);
        if (res)
            this.props.handleRefresh(res.data.pictures);
    }

    handleDelete = async (e) => {
        const query = `
                        mutation deletePicture($picture_id: Int!, $picture_src: String!) {
                            deletePicture(picture_id: $picture_id, picture_src: $picture_src) {
                                
                                    picture_id,
                                    user_id,
                                    src,
                                    priority
                                
                            }
                        }
                    `;

        const result = await axios.post(`/api`, {   query: query,
            variables: { 
            token: localStorage.getItem("token"), 
            picture_id: this.props.picture_id,
            picture_src: this.props.picture_src
            }
        }, headers.headers());

        console.log("RESDDD", result);
        console.log(result.data.data.deletePicture);
        this.props.handleRefresh(result.data.data.deletePicture);
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
                                        <label style={{width: "350px"}} className="ui huge red right floated button" onClick={this.handleDelete} htmlFor="delete_picture">
                                            Delete this picture
                                        </label>
                                    </Modal.Description>
                                </Modal.Content>
            </Modal>
        );
    }
}

export default ProfilePicture;