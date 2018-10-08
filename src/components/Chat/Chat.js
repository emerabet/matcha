import React, { Component } from 'react';
import { TextArea, Button, Form, Header, Image, Segment } from 'semantic-ui-react';
import './Chat.css';
import Message from '../Message/Message';

class Chat extends Component {

    render () {
        return (

            <div>
                
                <div className="chat-container">
                    <div className="contact-avatar">
                        <Image avatar size="tiny" src="/pictures/smoke_by.png"/>
                    </div>
                    <div className="contact-name">
                        <Header as='h2'>User Name</Header>
                    </div>
                </div>
                <div className="chat-messages">
                    <Message type="message-from-contact" msg="hello wheu whor eoir eowhr oewrh eowroewri er" from="User Name" date="1507476561000"/>
                    <Message type="message-from-user" msg="hello wheu whor eoir eowhr oewrh eowroewri er" from="Me" date="1539012561000"/>
                    
                </div>
                <Form>

                
                    <TextArea type="textarea" style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px", borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px"}} focus autoHeight placeholder='Write your message here...' />
                    

                    <Button style={{borderTopLeftRadius: "0px", borderTopRightRadius: "0px", width: "100%"}} type='submit' >Send</Button>

                
                    
                </Form>
            </div>
            

        )
    }
}

export default Chat;