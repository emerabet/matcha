import React, { Component } from 'react';
import { TextArea, Button, Form, Header, Image } from 'semantic-ui-react';
import './Chat.css';
import Messages from '../Messages/Messages';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { connect } from 'react-redux';
import Aux from '../../Hoc/Aux/Aux';

class Chat extends Component {

    state = {
        message: "",
        isTyping: false,
        contactIsTyping: false
    }    

    handleSubmit = async () => {
        await this.props.addMessage(this.props.chat_id, this.props.contact_id, this.state.message);
        this.setState({message: "", isTyping: false});
        this.props.socket.emit('stopTyping', {contact_id: this.props.contact_id, chat_id: this.props.chat_id});
    }

    handleChange = async (e, data) => {
            this.setState({ [e.target.name]: e.target.value });
        if (!this.state.isTyping) {
            this.setState({isTyping: true});
            this.props.socket.emit('isTyping', {contact_id: this.props.contact_id, chat_id: this.props.chat_id});
        } else if (e.target.value === "") {
            this.props.socket.emit('stopTyping', {contact_id: this.props.contact_id, chat_id: this.props.chat_id});
            this.setState({isTyping: false});
        }
    }
    
    async componentDidUpdate(prevProps, prevState) {
        if (prevState.message === this.state.message && prevState.contactIsTyping === this.state.contactIsTyping
        && prevState.isTyping === this.state.isTyping) {
            const contact = await this.props.contacts.filter(contact => {
            return contact.contact_id === this.props.contact_id;
        });
        if (contact && contact !== undefined) {
            if (contact[0] && this.state.contactIsTyping !== contact[0].isTyping)
                this.setState({contactIsTyping: contact[0].isTyping});
        }
    }
    }

    render () {
        if (this.props.messages[0])

        return (

            <Aux>
                {this.props.chat_id === 0
                ?
                    <h2> Please select a contact to start chatting </h2>
                :
                    <Aux>
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
                        <Messages pos={this.props.pos} contact_id={this.props.contact_id} messages={this.props.messages[0]}/>
                        
                        <Form onSubmit={this.handleSubmit}>

                            {
                                this.state.contactIsTyping &&
                            <p> is typing ... </p>}
                            <TextArea onChange={this.handleChange} value={this.state.message} name="message" type="textarea" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}} autoHeight placeholder='Write your message here...' required />
                            <Button disabled={this.state.message === ""} style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px", width: "100%"}} type='submit' >Send</Button>

                        </Form>
                    </Aux>
                }
            </Aux>
            

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