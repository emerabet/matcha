import React, { Component } from 'react';
import Message from '../../components/Message/Message';

class Messages extends Component {
    
    scrollToBottom = () => {
        this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight;
    }
      
    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div className="chat-messages" ref={(el) => { this.messagesEnd = el; }}>
                    {
                        this.props.messages.messages.map((message) => {
                        return ( 
                            <Message key={message.message_id} pos={this.props.pos} type={this.props.contact_id === message.user_id_sender ? "message-from-contact" : "message-from-user"} msg={message.message} from={this.props.contact_id === message.user_id_sender ? message.login : "Me"} date={message.date}/>
                        )
                    })
                    }
            </div>
        )
    }
}

export default Messages;