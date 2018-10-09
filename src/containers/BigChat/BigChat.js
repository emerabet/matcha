import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';
import axios from 'axios';
import * as headers from '../../Tools/Header';

class BigChat extends Component {

    state = {
        current_chat_id: 0
    }

    async componentDidMount() {
        const query = `
                        query
                            getContacts(){
                                chat_id,
                                contact_id,
                                login,
                                src,
                                last_message,
                                last_message_date
                            }
                        
                    `;
console.log("HEADERS", headers.headers());
        
        const response = await axios.post(`/api`,
            {
                query: query
            }, headers.headers());

        console.log("CONTACTS", response);
    }



    selectContact = (user_id, user_name, chat_id) => {
        console.log("user id", user_id);
        console.log("user name", user_name);
        this.setState({ current_chat_id: chat_id });
    }

    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList selectContact={this.selectContact}/>    
                </div>
                <div className="big-chat">
                    <Chat chat_id={this.state.chat_id}/>
                </div>
                
            </div>
        )
    }
}

export default BigChat;