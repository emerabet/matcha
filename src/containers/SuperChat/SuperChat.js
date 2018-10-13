import React, { Component } from 'react';
import axios from 'axios';
import * as headers from '../../Tools/Header';
import Aux from '../../Hoc/Aux/Aux';
import ChatBottom from '../ChatBottom/ChatBottom';
import BigChat from '../BigChat/BigChat';
import { connect } from 'react-redux';
import * as actions from './Actions';

class SuperChat extends Component {

    async componentDidMount() {
        if (this.props.contacts.length === 0) {
            this.props.onAddContacts();
        }
        if (this.props.chats.length === 0) {
            this.props.onAddChats();
        }
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
            <Aux>
                {this.props.type === "bottom"
                ?
                    <ChatBottom handleAddMessage={this.handleAddMessage} contacts={this.props.contacts} chats={this.props.chats}/>
                :
                    <BigChat handleAddMessage={this.handleAddMessage} contacts={this.props.contacts} chats={this.props.chats} />
                }
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.chat.contacts,
        chats: state.chat.chats
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddContacts: () => dispatch(actions.addContacts()),
        onAddChats: () => dispatch(actions.addChats())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperChat);