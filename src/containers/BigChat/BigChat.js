import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class BigChat extends Component {

    state = {
        contacts: [],
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: ""
    }

    async componentDidMount() {
        const query = `
                        query getContacts {
                            getContacts {
                                chat_id,
                                contact_id,
                                login,
                                src,
                                last_message,
                                last_message_date
                            }
                        }
                    `;

        
        const response = await axios.post(`/api`,
            {
                query: query
            }, headers.headers());
        console.log("CONTACTS", response.data.data.getContacts);
        this.setState({ contacts: response.data.data.getContacts });
    }



    selectContact = (user_id, user_name, chat_id, src) => {
        console.log("user id", user_id);
        console.log("user name", user_name);
        console.log("CHAT ID", chat_id);
        this.setState({active_chat_id: chat_id,
                        active_chat_contact_login: user_name,
                        active_chat_contact_id: user_id,
                        active_chat_contact_src: src});
        console.log("STATE", this.state);
    }

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList selectContact={this.selectContact} contacts={this.state.contacts}/>    
                </div>
                <div className="big-chat">
                    <Chat chat_id={this.state.chat_id} contact_login={this.state.active_chat_contact_login} cotnact_id={this.active_chat_contact_id} contact_src={this.state.active_chat_contact_src} />
                </div>
                
            </div>
        )
    }
}

export default BigChat;