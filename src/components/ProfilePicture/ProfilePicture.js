import React, { Component } from 'react';
import { Modal, Image, Button, Icon } from 'semantic-ui-react';
import * as styles  from './Styles';
import axios from 'axios';
import * as headers from '../../Tools/Header';
import { toast } from 'react-toastify';

class ProfilePicture extends Component {
    
    handleUpload = async (e) => {
        const data = new FormData();
        data.append('filename', "test.png");
        data.append('type', e.target.name);
        data.append('picture_id', this.props.picture_id);
        data.append('src', this.props.picture_src);
        data.append('file', e.target.files[0], localStorage.getItem('token'));
        
        const res = await axios.post('/upload_picture', data, headers.headers());
        if (res)
            this.props.handleRefresh(res.data.pictures);
        else
            toast("Somethign went wrong, maybe the picture has a wrong format", {type: toast.TYPE.ERROR});
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

        this.props.handleRefresh(result.data.data.deletePicture);
    }
 
    render () {
        return (
            <div >
                                <span style={{fontSize: "3em", fontWeight: "bold", margin: "5px"}}>
            {` ${this.props.old_login} (${ this.props.popularity } pts)`} </span>
                                <label style={{display: "flex", flexDirection: "column", padding: "10px"}}>

            <Modal centered basic size='small' trigger= { <Image name="profile_picture" style={{marginBottom: "5px"}} src={this.props.picture_src} size='medium' rounded /> }>
                            <Modal.Content image>
                                <Image wrapped size='medium' src={this.props.picture_src} rounded/>
                            </Modal.Content>
                            <Modal.Actions>
                            {
                                    this.props.picture_src !== "/pictures/smoke_by.png"
                                        &&
                                    <Button basic color='red' inverted onClick={this.handleDelete}>
                                        <Icon name='remove' /> Delete
                                    </Button>
                            }
                            <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" style={styles.hiddenInput} onChange={this.handleUpload} name="profile_picture" className="inputfile" id="upload_other_picture" />
                                <label className="ui green inverted button" htmlFor="upload_other_picture">
                                <Icon name='checkmark' /> Upload
                            </label>
                            </Modal.Actions>
            </Modal> 
                                </label>                            
                            </div>
        );
    }
}

export default ProfilePicture;