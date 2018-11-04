import React, { Component } from 'react';
import Message from '../../components/Message/Message';
import Aux from '../../Hoc/Aux/Aux';

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
            <Aux>
                
                <div className={this.props.pos === "main" ? "chat-messages" : "chat-messages_s"} ref={(el) => { this.messagesEnd = el; }}>
                    <div>
                    {
                        this.props.messages.messages.map((message) => {
                        return ( 

                                <Aux key={message.message_id}>{ message.message_id !== null && <Message key={message.message_id} pos={this.props.pos} type={this.props.contact_id === message.user_id_sender ? "message-from-contact" : "message-from-user"} msg={message.message} from={this.props.contact_id === message.user_id_sender ? message.login : "Me"} date={message.date}/> }</Aux>
                        )
                    })
                    }
                    </div>
                </div>
            </Aux>
        )
    }
}

export default Messages;