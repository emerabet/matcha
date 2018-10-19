import React, { Component } from 'react';
import { TextArea, Button, Form, Header, Image, Segment } from 'semantic-ui-react';
import './Chat.css';
import Message from '../../components/Message/Message';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { connect } from 'react-redux';

class Chat extends Component {

    state = {
        message: "",
        isTyping: false,
        contactIsTyping: false
    }

    handleSubmit = async () => {
        console.log("SUBMIOT ", this.state.message);
        await this.props.addMessage(this.props.chat_id, this.props.contact_id, this.state.message);
        this.setState({message: "", isTyping: false});
    }

    handleChange = async (e, data) => {
        console.log(this.state);
            this.setState({ [e.target.name]: e.target.value });
            console.log("TYPING", this.state.isTyping);
        if (!this.state.isTyping) {
            this.setState({isTyping: true});
            console.log("EMITTING TYPING", this.props.socket);
            this.props.socket.emit('isTyping', {contact_id: this.props.contact_id, chat_id: this.props.chat_id});
        }
    }
    

    render () {
        console.log("ICI", this.props.contacts);
        if (this.props.messages[0])
        console.log("TEST", this.props.messages[0].messages);
        const contact = this.props.contacts.filter(contact => {
            console.log(contact.contact_id, this.props.contact_id);
            return contact.contact_id === this.props.contact_id;
        });
        console.log("C", contact);
        return (

            <div>
                {this.props.pos === "main" &&
                    <div className="chat-container">
                        <div className="contact-avatar">
                            <Image avatar size="tiny" src={this.props.contact_src} />
                        </div>
                        <div className="contact-name">
                            <Header as='h2'> {this.props.contact_login} </Header>
                        </div>
                    </div>
                }
                <div className="chat-messages">
                {
                    this.props.messages[0].messages.map((message) => {
                    return ( 
                        <Message key={message.message_id} pos={this.props.pos} type={this.props.contact_id === message.user_id_sender ? "message-from-contact" : "message-from-user"} msg={message.message} from={this.props.contact_id === message.user_id_sender ? message.login : "Me"} date={message.date}/>
                    )
                })
                }
                </div>
                <Form onSubmit={this.handleSubmit}>

                    {
                        contact && contact.isTyping &&
                    <p> is typing ... </p>}
                    <TextArea onChange={this.handleChange} value={this.state.message} name="message" type="textarea" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}} autoHeight placeholder='Write your message here...' required />
                    

                    <Button style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px", width: "100%"}} type='submit' >Send</Button>

                
                    
                </Form>
            </div>
            

        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.chat.contacts
    }
};

const mapDispatchToProps = null;

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Chat));