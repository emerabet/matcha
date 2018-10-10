import React from 'react'
import { Image, List } from 'semantic-ui-react'
import styles from './Styles';

const Contact = ({chat_id, user_id, selectContact, pos, profile_picture="/pictures/smoke_by.png", user_name, last_message = "onversation"}) => (
  
    <List.Item onClick={() => selectContact(user_id, user_name, chat_id, profile_picture)} style={{cursor: "pointer"}}>
      <Image avatar src={profile_picture} />
      <List.Content>
        <List.Header>{ user_name }</List.Header>
            {pos === "main" && 
                <span style={styles.contact_item}>
                    { last_message != null 
                        ? last_message.length > 20 
                            ? `${last_message.substr(0, 18)} ...` 
                            : last_message 
                        : "Start a conversation" }</span>}
        </List.Content>
    </List.Item>
    
)

export default Contact;
