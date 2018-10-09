import React, { Component } from 'react';
import ContactList from '../ContactList/ContactList';
import Chat from '../Chat/Chat';
import './BigChat.css';

class BigChat extends Component {

    state = {
        current_chat_id: 0
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