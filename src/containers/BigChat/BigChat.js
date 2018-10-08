import React, { Component } from 'react';
import ContactList from '../../components/ContactList/ContactList';
import Chat from '../../components/Chat/Chat';
import './BigChat.css';

class BigChat extends Component {
    render() {
        return (
            <div className="big-chat-container">
                <div className="contact-list">
                    <ContactList />    
                </div>
                <div className="big-chat">
                    <Chat />
                </div>
                
            </div>
        )
    }
}

export default BigChat;