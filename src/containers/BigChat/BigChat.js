import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import { connect } from 'react-redux';
import * as actions from '../SuperChat/Actions';
import { Button } from 'semantic-ui-react';
import Aux from '../../Hoc/Aux/Aux';
import SimplePeer from 'simple-peer';
import withSocket from '../../Hoc/Socket/SocketHOC';
let p = null;

class BigChat extends Component {

    state = {
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: "",
        active_chat_messages: [{chat_id: 0, messages: []}],
        textarea: "",
        initiator: true,
        accepted: false,
        started: false,
        video_chat_contact_id: 0
    }

    selectContact = async (user_id, user_name, chat_id, src) => {
        console.log("user id", user_id);
        console.log("user name", user_name);
        console.log("CHAT ID", chat_id, this.props.chats.filter(chat => {
            return (chat.chat_id === chat_id)
        }));
        this.setState({active_chat_id: chat_id,
                        active_chat_contact_login: user_name,
                        active_chat_contact_id: user_id,
                        active_chat_contact_src: src,
                        active_chat_messages: this.props.chats.filter(chat => {
                            return (chat.chat_id === chat_id)
                        })});
        console.log("STATE", this.state);
        // AXIOS UPDATE READ STATUS MESSAGE
        await this.props.contacts.map(async c => {
            console.log("in map", c.chat_id, chat_id, c.user_id_sender, localStorage.getItem("user_id"), c.read_date);
            if (c.chat_id === chat_id && c.user_id_sender !== parseInt(localStorage.getItem("user_id"), 10) && c.read_date === null) {
                console.log("dispatching");
                await this.props.onOpenChat(this.props.nb_unread_chats, chat_id, this.props.contacts);
            }
            return null;
        })
    }

    handleAddMessage = async (chat_id, to, message) => {
        this.props.handleAddMessage(chat_id, to, message);
    }

    // STARTING VIDEO CHAT
    bindEvents = (p) => {
        p.on('signal', data => {
            const initiator = this.props.videoChats.length > 0 && this.props.videoChats.filter(video => {
                return video.from === this.state.video_chat_contact_id && video.offer === "initiated";
            }).length === 1;
            if (!initiator) {
                this.props.socket.emit('initiateVideoChat', {
                                                        to: this.state.video_chat_contact_id,
                                                        data: JSON.stringify(data)});
            } else if (data.renegotiate === undefined){
                this.props.socket.emit('acceptVideoChat', {
                    to: this.state.video_chat_contact_id,
                    data: JSON.stringify(data)});
            }
        })

        p.on('stream', stream => {
            this.refs.yourvideo.src = window.URL.createObjectURL(stream);
            this.refs.yourvideo.play();
        })

        p.on('error', () => {
            console.log("ERROR IN STREAM");
        })
    }

    startPeer = async (initiator, videoChat) => {
        navigator.getUserMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        await navigator.getUserMedia({
            video: true,
            audio: true
        }, /*SUCCESS*/ async stream => {
            p = await new SimplePeer({
                initiator: initiator,
                stream: stream,
                trickle: false/*,
                config: ALREADY SET BY DEFAULT BUT NOT ENOUGH TO PASS FIREWALL */
            })
            await this.bindEvents(p);
            //this.refs.myvideo.volume = 0
            this.refs.myvideo.src = await window.URL.createObjectURL(stream);
            await this.refs.myvideo.play();
            if (videoChat !== null) {
                this.handleOffer(videoChat.data);
            }
        }, /*ERROR*/ error => {
            console.log("STREAM ERROR")
        }
        )
    }

    handleStartVideo = (e) => {
        this.startPeer(false)
    }

    handleStopVideo = (e) => {
        this.refs.myvideo.pause();
    }

    handleReceiveVideo = async (e) => {
        window.addEventListener('beforeunload', this.handleLeavePage);
        let videoChat = null;
        if (this.props.videoChats.length > 0) {
            const videoChats  = this.props.videoChats.filter(video => {
                return video.from === this.state.active_chat_contact_id && video.offer === "initiated";
            })
            if (videoChats.length === 1)
                videoChat = videoChats[0]
        }
        const initiator = videoChat !== null;
        await this.startPeer(!initiator, videoChat); //by default true to initiate if not in the array
        this.setState({started: true, video_chat_contact_id: this.state.active_chat_contact_id})
    }

    handleChange = async (e) => { 
        this.setState({ [e.target.name]: e.target.value });
    }

    handleOffer = (data) => {
        p.signal(JSON.parse(data));
    }

    handleLeavePage(e) {
        const confirmationMessage = '';
        e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34
    }

    componentDidUpdate() {
        if (this.state.accepted === false) {
            if (this.props.videoChats.length > 0) {
                const videoChats  = this.props.videoChats.filter(video => {
                    return video.from === this.state.video_chat_contact_id && video.offer === "accepted";
                })
                if (videoChats.length === 1) {
                    const videoChat = videoChats[0]
                    this.handleOffer(videoChat.data);
                    this.setState({accepted: true});
                }    
            }
        }
    }

    componentWillUnmount() {
        if (p)
            this.handleStopVideo();
            window.removeEventListener('beforeunload', this.handleLeavePage);
    }

    handleStopVideo = () => {
        window.removeEventListener('beforeunload', this.handleLeavePage)
        p.destroy();
        this.props.onCloseVideoChat(this.props.videoChats, this.state.video_chat_contact_id)
        this.setState({initiator: true,
            accepted: false,
            started: false,
            video_chat_contact_id: 0})
    }

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                {
                    this.state.active_chat_id !== 0
                &&
                    <Aux>
                        <div>
                            <h2> Video chat </h2>
                            <video ref="yourvideo"  height="200px"> </video>
                            <video controls ref="myvideo"  height="40px"> </video>
                            {
                                this.state.started === false
                                ? 
                                    <Aux>
                                        {
                                            this.props.videoChats.length > 0 && this.props.videoChats.filter(video => {
                                            return video.from === this.state.active_chat_contact_id;
                                            }).length === 1
                                        ? 
                                            <div>
                                                <Button onClick={this.handleReceiveVideo} > Accept Video Call </Button>
                                            </div>
                                        :
                                            <Button onClick={this.handleReceiveVideo} > Initiate Video Call </Button>
                                        }
                                    </Aux>
                                :
                                    <Button onClick={this.handleStopVideo} > Stop Video Call </Button>
                            }
                        </div>
                    {false && <div>
                            <h2> Sending </h2>
                            <video controls ref="myvideo"  height="40px"> </video>
                            <Button onClick={this.handleStartVideo} > Start video </Button>
                            <Button onClick={this.handleStopVideo} > Stop video </Button>
                        </div>}
                        
                        <div>
                        </div>
                    </Aux>
                }
                    <ContactList pos="main" connectedList={this.props.connectedList} selectContact={this.selectContact} contacts={this.props.contacts}/>    
                </div>
                <div className="big-chat">
                    <Chat contacts={this.props.contacts} pos="main" addMessage={this.handleAddMessage} chat_id={this.state.active_chat_id} messages={this.state.active_chat_messages} contact_login={this.state.active_chat_contact_login} contact_id={this.state.active_chat_contact_id} contact_src={this.state.active_chat_contact_src} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        nb_unread_chats: state.chat.nb_unread_chats,
        videoChats: state.chat.videoChats
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOpenChat: (nb_unread_chats, chat_id, contacts) => dispatch(actions.openChat(nb_unread_chats, chat_id, contacts)),
        onCloseVideoChat: (videoChats, contact_id) => dispatch(actions.closeVideoChat(videoChats, contact_id)) 
    }
}

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(BigChat));