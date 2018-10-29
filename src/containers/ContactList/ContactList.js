import React from 'react'
import { List } from 'semantic-ui-react'
import Contact from '../../components/Contact/Contact';

//const displ

const ContactList = ({selectContact, contacts = [], pos, connectedList = []}) => (
  <List animated celled>
    { contacts.map((contact) => {
        return (
          <Contact user_id_sender={contact.user_id_sender} connected={connectedList.includes(contact.contact_id)} read_date={contact.read_date} isTyping={contact.isTyping} pos={pos} key={contact.chat_id} chat_id={contact.chat_id} selectContact={selectContact} user_id={contact.contact_id} profile_picture={contact.contact_src} user_name={contact.contact_login} last_message={contact.message} />
        )
    }) }
  </List>
)

export default ContactList;
