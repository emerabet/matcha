import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import TopMenu from '../../components/Menu/TopMenu';
import SuperChat from '../../containers/SuperChat/SuperChat';
import withSocket from '../Socket/SocketHOC';
import { toast } from 'react-toastify';
import * as actionsActivity from '../../components/Activity/Actions';
import * as actionsChat from '../../containers/SuperChat/Actions';
import Footer from '../../components/Footer/Footer';
import './Layout.css';


class Layout extends Component {

    state = {
        width: 0
    }

    componentDidMount() {

        this.props.socket.on('visited', (data) => {
            this.props.onLoadNotifications('all');
            toast(data);
        });

        this.props.socket.on('liked', (data) => {
            this.props.onLoadNotifications('all');
            toast(data);
        });

        this.props.socket.on('unliked', (data) => {
            this.props.onLoadNotifications('all');
            toast(data);
        });

        this.props.socket.on('onlineChanged', (data) => {
            this.props.socket.connectedUsersMatcha = null;
            this.props.socket.connectedUsersMatcha = JSON.parse(data);
            if (this.props.connectedList.length === 0)
            this.props.onContactConnected(this.props.socket.connectedUsersMatcha, null);
        });

        this.props.socket.on('newMessage', (mes) => {
            this.props.onReceiveMessage(this.props.chats, this.props.contacts, mes, this.props.nb_unread_chats);    
        });

        this.props.socket.on('isTyping', (contact_id) => {
            this.props.onContactIsTyping(this.props.contacts, contact_id);   
        });

        this.props.socket.on('stopTyping', (contact_id) => {
            this.props.onContactStopTyping(this.props.contacts, contact_id);   
        });

        this.props.socket.on('disconnected', (user_id_disconnected, login) => {
            toast(`${login} has just disconnected`);
            this.props.onContactDisconnected(this.props.connectedList, user_id_disconnected);
        })

        this.props.socket.on('connected', (user_id_connected, login) => {
            toast(`${login} has just connected`);
            this.props.onContactConnected(this.props.connectedList, user_id_connected);
        })

        this.props.socket.on('initiateVideoChat', ({from, data}) => {
            this.props.onStartVideoChat(this.props.videoChats, from, data);
        })

        this.props.socket.on('acceptVideoChat', ({from, data}) => {
            this.props.onStartVideoChat(this.props.videoChats, from, data);
            this.props.onAcceptVideoChat(this.props.videoChats, from, data);
        })

        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({width: window.innerWidth});
    }

    render() {
        return (
            <Aux>
                {this.props.logged && <TopMenu/>}
                <main>
                    {this.props.children}
                </main>
                {this.props.logged && this.state.width > 540 && <SuperChat type="bottom" />}
                <Footer />
            </Aux>
        );
    }

}


const mapStateToProps = state => {
    return {
        chats: state.chat.chats,
        contacts: state.chat.contacts,
        nb_unread_chats: state.chat.nb_unread_chats,
        logged: state.login.logged,
        connectedList: state.chat.connectedList,
        videoChats: state.chat.videoChats
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadNotifications: (type) => dispatch(actionsActivity.load(type)),
        onReceiveMessage: (chats, contacts, mes, nb_unread_chats) => dispatch(actionsChat.receiveMessage(chats, contacts, mes, nb_unread_chats)),
        onContactIsTyping: (contacts, contact_id) => dispatch(actionsChat.contactIsTyping(contacts, contact_id)),
        onContactStopTyping: (contacts, contact_id) => dispatch(actionsChat.contactStopTyping(contacts, contact_id)),
        onContactConnected: (connectedList, contact_id) => dispatch(actionsChat.contactConnected(connectedList, contact_id)),
        onContactDisconnected: (connectedList, contact_id) => dispatch(actionsChat.contactDisconnected(connectedList, contact_id)),
        onStartVideoChat: (videoChats, from, data) => dispatch(actionsChat.startVideoChat(videoChats, from, data)),
        onAcceptVideoChat: (videoChats, from, data) => dispatch(actionsChat.acceptVideoChat(videoChats, from, data))
    }
}


export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Layout));