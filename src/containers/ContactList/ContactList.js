import React from 'react'
import { Image, List } from 'semantic-ui-react'
import Contact from '../../components/Contact/Contact';

const ContactList = ({selectContact}) => (
  <List animated celled>
    <Contact selectContact={selectContact} user_id={1} user_name="Simone" last_message="" />
    <Contact selectContact={selectContact} user_id={2} profile_picture="" user_name="Jose" last_message="hello" />
    <Contact selectContact={selectContact} user_id={3} user_name="Roseline" last_message="" />
    <Contact selectContact={selectContact} user_id={4} profile_picture="" user_name="Martin" last_message="yo" />
    <Contact selectContact={selectContact} user_id={5} profile_picture="" user_name="User Name" last_message="ud ojd oeghureoifjewp fewof jeof e" />
  </List>
)

export default ContactList;
