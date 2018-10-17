import React, { Component } from 'react';
import { TextArea, Button, Form, Header, Image, Segment } from 'semantic-ui-react';
import './Chat.css';
import Message from '../../components/Message/Message';

class Chat extends Component {

    state = {
        message: "",
        isTyping: false
    }

    handleSubmit = () => {
        this.props.addMessage(this.props.chat_id, this.state.message);
        this.setState({message: ""});
    }

    handleChange = async (e, data) => {
            this.setState({ [e.target.name]: e.target.value });
    }
    

    render () {
        console.log("ICI");
        if (this.props.messages[0])
        console.log("TEST", this.props.messages[0].messages);
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

                
                    <TextArea onChange={this.handleChange} value={this.state.message} name="message" type="textarea" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}} autoHeight placeholder='Write your message here...' required />
                    

                    <Button style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px", width: "100%"}} type='submit' >Send</Button>

                
                    
                </Form>
            </div>
            

        )
    }
}

export default Chat;