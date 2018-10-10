import React, { Component } from 'react'
import { Card, Icon, Button } from 'semantic-ui-react'
import ContactList from '../ContactList/ContactList';
import axios from 'axios';
import * as headers from '../../Tools/Header';

const description = [
  'Amy is a violinist with 2 years experience in the wedding industry.',
  'She enjoys the outdoors and currently resides in upstate New York.',
].join(' ')

const open_style = {
    position: "absolute",
    bottom: "0",
    right: "5%"
}

const closed_style = {
    display: "none"
}

const no_button = {
    display: "none"
}

const display_button = {
    position: "absolute",
    bottom: "0",
    right: "5%"
}

class ChatBottom extends Component {

    state = {
        open: false,
        contacts: [],
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: "",
        active_chat_messages: [],
        active_chat_selected: false
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



    selectContact = async (user_id, user_name, chat_id, src) => {
        console.log("user id", user_id);
        console.log("user name", user_name);
        console.log("CHAT ID", chat_id);
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
        console.log("MESSAGES", response.data.data.getMessages);
        this.setState({active_chat_id: chat_id,
                        active_chat_contact_login: user_name,
                        active_chat_contact_id: user_id,
                        active_chat_contact_src: src,
                        active_chat_messages: response.data.data.getMessages,
                        active_chat_selected: true});
        console.log("STATE", this.state);
    }


    handleClickOpenClose = (e) => {
        this.setState({open: !this.state.open});
    }

    render () {
        return (
            <div>
                <Card style={open_style}>
                    <Card.Content onClick={this.handleClickOpenClose} header={<div>User Name <Icon /><Icon onClick={this.handleClickOpenClose} style={{position: "absolute", right: "5px"}} name="window close"/></div>} />
                    <Card.Content style={this.state.open ? null : closed_style} description={<ContactList pos="bottom" selectContact={this.selectContact} contacts={this.state.contacts}/>} />
                    <Card.Content extra style={this.state.open ? null : closed_style}>
                    <Icon name='user' style={this.state.open ? null : closed_style} />
                    4 Friends
                    </Card.Content>
                   
                </Card>
            </div>
)
    }}

export default ChatBottom