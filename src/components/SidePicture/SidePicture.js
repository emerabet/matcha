import React, { Component } from 'react';
import { Range } from 'rc-slider';
import Slider from 'rc-slider';
import { Button, Form, Dropdown, Modal, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as styles  from './Styles';
import axios from 'axios';

class SidePicture extends Component {
    
    handleUpload = async (e) => {
        console.log("name", e.target.name);
        console.log("file", e.target.value);
        console.log("F", e.target.files[0]);
        console.log("KEY", e.target.key);

        const data = new FormData();
        data.append('filename', "test.png");
        data.append('token', localStorage.getItem("token"));
        data.append('type', e.target.name);
        data.append('picture_id', this.props.pic.picture_id);
        data.append('src', this.props.pic.src);
        data.append('file', e.target.files[0], localStorage.getItem('token'));
        const headers = {
            headers: {
            authorization: localStorage.getItem("token")
            }
        }
        const res = await axios.post('/upload_picture', data, headers);
        console.log("res", res);
        console.log("INSERT ID", res.insertId);
        console.log("UPLOADED");
        console.log("SIZE", res.data.pictures.length);
        if (res)
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
                    const headers = {
                        headers: {
                        authorization: localStorage.getItem("token")
                        }
                    }
        const result = await axios.post(`/api`, {   query: query,
            variables: { 
            token: localStorage.getItem("token"), 
            picture_id: this.props.pic.picture_id,
            picture_src: this.props.pic.src
            }
        }, headers);

        console.log("RESDDD", result);
        console.log(result.data.data.deletePicture);
        this.props.handleRefresh(result.data.data.deletePicture);
    }
 
    render () {
        return (
            <Modal trigger={<div >
                                <Image  id={this.props.pic.picture_id} onClick={this.handleClickedPhoto} name="side_picture" style={styles.picture} src={this.props.pic.src} size='tiny' rounded />
                            </div>}>
                            <Modal.Header>Display picture</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='massive' src={this.props.pic.src} rounded/>
                                    <Modal.Description>            
                                        <input type="file" style={styles.hiddenInput} onChange={this.handleUpload} name="side_picture" className="inputfile" onChange={this.handleUpload} id="upload_other_picture" />
                                        <label style={{width: "350px"}}  className="ui huge gray right floated button" htmlFor="upload_other_picture">
                                            Upload an other picture
                                        </label>
                                        <label style={{width: "350px"}} onClick={this.handleDelete} className="ui huge red right floated button" htmlFor="delete_picture">
                                            Delete this picture
                                        </label>
                                    </Modal.Description>
                                </Modal.Content>
            </Modal>
        );
    }
}

export default SidePicture;