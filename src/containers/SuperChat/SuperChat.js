import React, { Component } from 'react';
import Aux from '../../Hoc/Aux/Aux';
import ChatBottom from '../ChatBottom/ChatBottom';
import BigChat from '../BigChat/BigChat';
import { connect } from 'react-redux';
import * as actions from './Actions';
import withSocket from '../../Hoc/Socket/SocketHOC';

class SuperChat extends Component {

    async componentDidMount() {
        if (this.props.contacts.length === 0) {
            this.props.onAddContacts();
        }
        if (this.props.chats.length === 0) {
            this.props.onAddChats();
        }
    }

    handleAddMessage = async (chat_id, to, message) => {
        this.props.onAddMessage(chat_id, this.props.user.login, this.props.user.user_id, to, message, this.props.chats, this.props.socket, this.props.contacts);
    }

    render() {
        return (
            <Aux>
                {this.props.type === "bottom"
                ?
                    <ChatBottom connectedList={this.props.connectedList} handleAddMessage={this.handleAddMessage} contacts={this.props.contacts} chats={this.props.chats}/>
                :
                    <BigChat connectedList={this.props.connectedList} handleAddMessage={this.handleAddMessage} contacts={this.props.contacts} chats={this.props.chats} />
                }
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.chat.contacts,
        chats: state.chat.chats,
        user: state.login.user,
        connectedList: state.chat.connectedList
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddContacts: () => dispatch(actions.addContacts()),
        onAddChats: () => dispatch(actions.addChats()),
        onAddMessage: (chat_id, login, from, to, message, chats, socket, contacts) => dispatch(actions.addMessage(chat_id, login, from, to, message, chats, socket, contacts))
        
    }
}

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(SuperChat));