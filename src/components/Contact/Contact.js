import React from 'react'
import { Image, List, Icon } from 'semantic-ui-react'
import styles from './Styles';

const Contact = ({isTyping, connected, read_date, chat_id, user_id, user_id_sender, selectContact, pos, profile_picture="/pictures/smoke_by.png", user_name, last_message = "onversation"}) => (
    <List.Item onClick={() => selectContact(user_id, user_name, chat_id, profile_picture)} style={{cursor: "pointer"}}>
      <Image avatar src={profile_picture} />
      <List.Content>
        <List.Header>{ user_name } <Icon name="circle" color={connected ? "green" : "red"} /></List.Header>
            {pos === "main" && 
                <span style={styles.contact_item}>
                    {   isTyping && isTyping !== undefined
                        ?
                            "is typing ..."
                        :
                            last_message != null 
                            ? last_message.length > 20 
                                ? `${last_message.substr(0, 18)} ...` 
                                : last_message 
                            : "Start a conversation" }</span>}
                {
                    read_date === null && user_id_sender !== parseInt(localStorage.getItem("user_id"), 10) && <span> unread{user_id} {read_date}</span>

                }
        </List.Content>
    </List.Item>
    
)

export default Contact;
