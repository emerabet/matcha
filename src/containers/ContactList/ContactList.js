import React from 'react'
import { Image, List } from 'semantic-ui-react'
import Contact from '../../components/Contact/Contact';

//const displ

const ContactList = ({selectContact, contacts = [], pos}) => (
  <List animated celled>
    { contacts.map((contact) => {
        return (
          <Contact pos={pos} key={contact.chat_id} chat_id={contact.chat_id} selectContact={selectContact} user_id={contact.contact_id} profile_picture={contact.contact_src} user_name={contact.contact_login} last_message={contact.message} />
        )
    }) }
  </List>
)

export default ContactList;
