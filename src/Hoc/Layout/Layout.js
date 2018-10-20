import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import TopMenu from '../../components/Menu/TopMenu';
import SuperChat from '../../containers/SuperChat/SuperChat';
import withSocket from '../Socket/SocketHOC';

import * as actionsActivity from '../../components/Activity/Actions';
import * as actionsChat from '../../containers/SuperChat/Actions';

import './Layout.css';


class Layout extends Component {

    componentDidMount() {

        this.props.socket.on('visited', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });

        this.props.socket.on('liked', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });

        this.props.socket.on('unliked', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });

        this.props.socket.on('newMessage', (mes) => {
            console.log("NEW MESSAGE", mes);
            this.props.onReceiveMessage(this.props.chats, this.props.contacts, mes, this.props.nb_unread_chats);    
        });

        this.props.socket.on('isTyping', (contact_id) => {
            console.log("CONTACT IS TYPING", contact_id);
            this.props.onContactIsTyping(this.props.contacts, contact_id);
            //this.props.onReceiveMessage(this.props.chats, this.props.contacts, mes);    
        });

        this.props.socket.on('stopTyping', (contact_id) => {
            console.log("CONTACT HAS STOPPED TYPING", contact_id);
            this.props.onContactStopTyping(this.props.contacts, contact_id);
            //this.props.onReceiveMessage(this.props.chats, this.props.contacts, mes);    
        });

    }

    render() {
        return (
            <Aux>
                {this.props.logged && <TopMenu/>}
                <main>
                    {this.props.children}
                </main>
                {this.props.logged && <SuperChat type="bottom" />}
            </Aux>
        );
    }

}


const mapStateToProps = state => {
    return {
        chats: state.chat.chats,
        contacts: state.chat.contacts,
        nb_unread_chats: state.chat.nb_unread_chats,
        logged: state.login.logged
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadNotifications: (type) => dispatch(actionsActivity.load(type)),
        onReceiveMessage: (chats, contacts, mes, nb_unread_chats) => dispatch(actionsChat.receiveMessage(chats, contacts, mes, nb_unread_chats)),
        onContactIsTyping: (contacts, contact_id) => dispatch(actionsChat.contactIsTyping(contacts, contact_id)),
        onContactStopTyping: (contacts, contact_id) => dispatch(actionsChat.contactStopTyping(contacts, contact_id))
    }
}


export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Layout));