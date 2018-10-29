import React, { Component } from 'react';
import { Modal, Image } from 'semantic-ui-react';
import * as styles  from './Styles';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class SidePicture extends Component {
    
    handleUpload = async (e) => {
        const data = new FormData();
        data.append('filename', "test.png");
        data.append('token', localStorage.getItem("token"));
        data.append('type', e.target.name);
        data.append('picture_id', this.props.pic.picture_id);
        data.append('src', this.props.pic.src);
        data.append('file', e.target.files[0], localStorage.getItem('token'));
        
        const res = await axios.post('/upload_picture', data, headers.headers());
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
            picture_id: this.props.pic.picture_id,
            picture_src: this.props.pic.src
            }
        }, headers.headers());

        this.props.handleRefresh(result.data.data.deletePicture);
    }
 
    render () {
        return (
            <Modal trigger={<div >
                                <Image  id={this.props.pic.picture_id} onClick={this.handleClickedPhoto} name="side_picture" style={styles.picture} src={this.props.pic.src} size='tiny' rounded />
                            </div>}>
                            <Modal.Header>Display picture</Modal.Header>
                                <Modal.Content image style={{display: "flex", flexDirection: "column"}}>
                                    <Image wrapped size='massive' src={this.props.pic.src} rounded/>
                                    <Modal.Description>            
                                        <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp" style={styles.hiddenInput} onChange={this.handleUpload} name="side_picture" className="inputfile" id="upload_other_picture" />
                                        <label style={{width: "100%"}}  className="ui huge gray button" htmlFor="upload_other_picture">
                                            Upload an other picture
                                        </label>
                                        <label style={{width: "100%"}} onClick={this.handleDelete} className="ui huge red button" htmlFor="delete_picture">
                                            Delete this picture
                                        </label>
                                    </Modal.Description>
                                </Modal.Content>
            </Modal>
        );
    }
}

export default SidePicture;