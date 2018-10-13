import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class BigChat extends Component {

    state = {
        contacts: [],
        chats: [],
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: "",
        active_chat_messages: [{chat_id: 0, messages: []}]
    }

    async componentDidMount() {
        const query = `
                        query getContacts {
                            getContacts {
                                chat_id,
                                message_id,
                                user_id_sender,
                                message,
                                date,
                                read_date,
                                contact_id,
                                contact_login,
                                contact_src
                            }
                        }
                    `;

        
        const response = await axios.post(`/api`,
            {
                query: query
            }, headers.headers());
        console.log("CONTACTS", response.data.data.getContacts);
        const query_messages = `
        query getAllMessagesFromUser {
            getAllMessagesFromUser {
                chat_id,
                messages{
                    message_id,
                    user_id_sender,
                    login,
                    message,
                    date,
                    read_date
                }
            }
        }
    `;

        const response_messages = await axios.post(`/api`,
        {
             query: query_messages
        }, headers.headers());
        console.log("MESSAGES", response_messages.data.data.getAllMessagesFromUser);
               
        this.setState({ contacts: response.data.data.getContacts,
                        chats: response_messages.data.data.getAllMessagesFromUser });
    }



    selectContact = async (user_id, user_name, chat_id, src) => {
        console.log("user id", user_id);
        console.log("user name", user_name);
        console.log("CHAT ID", chat_id, this.state.chats.filter(chat => {
            return (chat.chat_id === chat_id)
        }));/*
        const query = `
                        query getMessages($chat_id: Int!) {
                            getMessages(chat_id: $chat_id) {
                                message_id,
                                user_id_sender,
                                message,
                                date,
                                login
                            }
                        }
                    `;

        
        const response = await axios.post(`/api`,
            {
                query: query,
                variables: {
                    chat_id: chat_id
                }
            }, headers.headers());
        console.log("MESSAGES", response.data.data.getMessages);*/
        this.setState({active_chat_id: chat_id,
                        active_chat_contact_login: user_name,
                        active_chat_contact_id: user_id,
                        active_chat_contact_src: src,
                        active_chat_messages: this.state.chats.filter(chat => {
                            return (chat.chat_id === chat_id)
                        })});
        console.log("STATE", this.state);
    }

    handleAddMessage = async (chat_id, message) => {
        console.log("ADDING MESSAGE", chat_id, message);
        const query = `
                        mutation addMessage($chat_id: Int!, $message: String!) {
                            addMessage(chat_id: $chat_id, message: $message)
                        }
                    `;

        
        const response = await axios.post(`/api`,
            {
                query: query,
                variables: {
                    chat_id: chat_id,
                    message: message
                }
            }, headers.headers());
        console.log("MESSAGES", response.data.data.addMessage);
    }

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList pos="main" selectContact={this.selectContact} contacts={this.state.contacts}/>    
                </div>
                <div className="big-chat">
                    <Chat pos="main" addMessage={this.handleAddMessage} chat_id={this.state.active_chat_id} messages={this.state.active_chat_messages} contact_login={this.state.active_chat_contact_login} contact_id={this.state.active_chat_contact_id} contact_src={this.state.active_chat_contact_src} />
                </div>
                
            </div>
        )
    }
}

export default BigChat;