import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import axios from 'axios';
import * as headers from '../../Tools/Header';
import { connect } from 'react-redux';
import * as actions from '../SuperChat/Actions';

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

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList pos="main" selectContact={this.selectContact} contacts={this.props.contacts}/>    
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
        nb_unread_chats: state.chat.nb_unread_chats
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOpenChat: (nb_unread_chats, chat_id, contacts) => dispatch(actions.openChat(nb_unread_chats, chat_id, contacts))
   //     onAddChats: () => dispatch(actions.addChats()),
     //   onAddMessage: (chat_id, login, from, to, message, chats, socket, contacts) => dispatch(actions.addMessage(chat_id, login, from, to, message, chats, socket, contacts))
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BigChat);