import React from 'react'
import { Image, List } from 'semantic-ui-react'
import styles from './Styles';


const Contact = ({user_id, selectContact, profile_picture="/pictures/smoke_by.png", user_name, last_message = "Start a conversation"}) => (
  
    <List.Item>
      <Image avatar src={profile_picture} />
      <List.Content onClick={() => selectContact(user_id, user_name)}>
        <List.Header>{ user_name }</List.Header>
            <span style={styles.contact_item}>{ last_message.length > 20 ? `${last_message.substr(0, 18)} ...` : last_message }</span>
        </List.Content>
    </List.Item>
    
)

export default Contact;
