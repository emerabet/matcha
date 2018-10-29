import React, { Component } from 'react'
import { Card, Icon, Image, Label } from 'semantic-ui-react'
import ContactList from '../ContactList/ContactList';
import Aux from '../../Hoc/Aux/Aux';
import Chat from '../Chat/Chat';
import { connect } from 'react-redux';
import * as actions from '../SuperChat/Actions';

const open_style = {
    position: "fixed",
    bottom: "0",
    right: "5%",
    zIndex: "80000"
}

const closed_style = {
    display: "none"
}

class ChatBottom extends Component {

    state = {
        open: false,
        active_chat_id: 0,
        active_chat_contact_login: "",
        active_chat_contact_id: 0,
        active_chat_contact_src: "",
        active_chat_messages: [{chat_id: 0, messages: []}],
        active_chat_selected: false,
        active_chat_list_display: false,
        active_chats: [],
        contacts_active_chats: []
    }

    selectContact = async (user_id, user_name, chat_id, src) => {
        const c = this.state.contacts_active_chats.map((contact) => {
            return contact.contact_id;
        }).indexOf(user_id);
        
        const cont = c === -1
        ? [...this.state.contacts_active_chats, this.props.contacts.filter((contact) => {
            
            return contact.contact_id === user_id;
        })[0]]
        : this.state.contacts_active_chats;
        
        this.setState({active_chat_id: chat_id,
            active_chat_contact_login: user_name,
            active_chat_contact_id: user_id,
            active_chat_contact_src: src,
            active_chat_messages: this.props.chats.filter(chat => {
                return (chat.chat_id === chat_id)
            }),
            active_chat_selected: true,
            contacts_active_chats: cont});
        await this.props.contacts.map(async c => {
            if (c.chat_id === chat_id && c.user_id_sender !== parseInt(localStorage.getItem("user_id"), 10) && c.read_date === null) {
                await this.props.onOpenChat(this.props.nb_unread_chats, chat_id, this.props.contacts);
            }
            return null;
        })
    }

    handleClickOpenClose = (e) => {
        this.setState({open: !this.state.open});
    }

    handleClickBackToContactList = (e, data) => {
        this.setState({active_chat_selected: false,
                        active_chat_list_display: false});
    }

    handleClickCloseCurrentChat = () => {
        const new_list = this.state.contacts_active_chats.filter(chat => {
            return chat.chat_id !== this.state.active_chat_id
        })
        this.setState({active_chat_selected: false,
                        contacts_active_chats: new_list});
    }
    
    handleClickActiveChats = () => {
        this.setState({active_chat_selected: false,
                        active_chat_list_display: true,
                        open: true});
    }

    handleAddMessage = async (chat_id, to, message) => {
        this.props.handleAddMessage(chat_id, to, message);
    }

    render () {
        const header = () => {
            return (
                <div style={{display: "grid"}}>
                    <div style={{gridColumn: "1 / span 4", cursor: "pointer"}} onClick={this.handleClickOpenClose}>
                        {this.state.active_chat_selected ? 
                            <Aux>
                                <Image  avatar src={this.state.active_chat_contact_src}/>
                                {this.state.active_chat_contact_login}
                            </Aux> 
                        : 
                            <Aux>
                                <Icon name="users"/>
                                Chat 
                      
                                <Label color="pink" circular> {this.props.nb_unread_chats} </Label>
                                
                            </Aux> }
                    </div>
                    <div style={{gridColumn: "5"}}>
                            {this.state.contacts_active_chats.length > 0 &&
                            <Icon onClick={this.handleClickActiveChats} name="wechat" style={{position: "absolute", right: "45px", cursor: "pointer"}}/>}
                            {(this.state.active_chat_list_display || this.state.active_chat_selected) && this.state.open && 
                                <Icon onClick={this.handleClickBackToContactList} name="caret square left" style={{position: "absolute", right: "25px", cursor: "pointer"}}/>}
                            {this.state.active_chat_selected && this.state.open &&
                                    <Icon onClick={this.handleClickCloseCurrentChat} style={{position: "absolute", right: "5px", cursor: "pointer"}} name="window close"/>
                        }
                    </div>
                </div>
            )
        }

        const main = () => {
            return (<Aux>
                {this.state.active_chat_selected === false
                ?
                    this.state.active_chat_list_display === false
                        ?
                            <ContactList pos="bottom" connectedList={this.props.connectedList} selectContact={this.selectContact} contacts={this.props.contacts}/>
                        :
                            <ContactList pos="main" connectedList={this.props.connectedList} selectContact={this.selectContact} contacts={this.state.contacts_active_chats}/>
                :
                    <Chat contacts={this.props.contacts} pos="bottom" addMessage={this.handleAddMessage} chat_id={this.state.active_chat_id} messages={this.state.active_chat_messages} contact_login={this.state.active_chat_contact_login} contact_id={this.state.active_chat_contact_id} contact_src={this.state.active_chat_contact_src} />
                }
                </Aux>
            )
        }
        return (
            <div>
                <Card style={open_style}>
                    <Card.Content header={header()} />
                    <Card.Content style={this.state.open ? null : closed_style} description={main()} />
                    <Card.Content extra style={this.state.open ? null : closed_style}>
                        <Icon name='user' style={this.state.open ? null : closed_style} />
                        {this.props.contacts.length > 0 && `${this.props.contacts.length} friends`}
                    </Card.Content>
                </Card>
            </div>
)
    }}

    const mapStateToProps = state => {
        return {
            nb_unread_chats: state.chat.nb_unread_chats
        }
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {
            onOpenChat: (nb_unread_chats, chat_id, contacts) => dispatch(actions.openChat(nb_unread_chats, chat_id, contacts))
       //     onAddChats: () => dispatch(actions.addChats()),
         //   onAddMessage: (chat_id, login, from, to, message, chats, socket, contacts) => dispatch(actions.addMessage(chat_id, login, from, to, message, chats, socket, contacts))
            
        }
    }

export default connect(mapStateToProps, mapDispatchToProps)(ChatBottom);