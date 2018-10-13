import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class BigChat extends Component {

    state = {
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: "",
        active_chat_messages: [{chat_id: 0, messages: []}]
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
    }

    handleAddMessage = async (chat_id, message) => {
        this.props.handleAddMessage(chat_id, message);
    }

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList pos="main" selectContact={this.selectContact} contacts={this.props.contacts}/>    
                </div>
                <div className="big-chat">
                    <Chat pos="main" addMessage={this.handleAddMessage} chat_id={this.state.active_chat_id} messages={this.state.active_chat_messages} contact_login={this.state.active_chat_contact_login} contact_id={this.state.active_chat_contact_id} contact_src={this.state.active_chat_contact_src} />
                </div>
                
            </div>
        )
    }
}

export default BigChat;