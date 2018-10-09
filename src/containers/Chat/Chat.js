import React, { Component } from 'react';
import { TextArea, Button, Form, Header, Image, Segment } from 'semantic-ui-react';
import './Chat.css';
import Message from '../../components/Message/Message';

class Chat extends Component {

    componentDidMount(){
        // get the list of messages
    }

    render () {
        return (

            <div>
                
                <div className="chat-container">
                    <div className="contact-avatar">
                        <Image avatar size="tiny" src={this.props.contact_src} />
                    </div>
                    <div className="contact-name">
                        <Header as='h2'> {this.props.contact_login} </Header>
                    </div>
                </div>
                <div className="chat-messages">
                {
                    this.props.messages.map((message) => {
                    return (
                        <Message key={message.message_id} type="message-from-contact" msg={message.message} from={message.login} date={message.date}/>
                    )
                })
                }
                    <Message type="message-from-contact" msg="hello wheu whor eoir eowhr oewrh eowroewri er" from="User Name" date="1507476561000"/>
                    <Message type="message-from-user" msg="hello wheu whor eoir eowhr oewrh eowroewri er" from="Me" date="1539012561000"/>
                    
                </div>
                <Form>

                
                    <TextArea type="textarea" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}} autoHeight placeholder='Write your message here...' />
                    

                    <Button style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px", width: "100%"}} type='submit' >Send</Button>

                
                    
                </Form>
            </div>
            

        )
    }
}

export default Chat;