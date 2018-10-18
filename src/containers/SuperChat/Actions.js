import axios from 'axios';
import * as headers from '../../Tools/Header';
export const CONTACTS = 'CONTACTS';
export const CHATS = 'CHATS';

export const addContacts = () => {
    return async dispatch => {
        try {
            const query = `
                query getContacts {
                    getContacts {
                        chat_id,
                        message_id,
                        user_id_sender,
                        message,
                        date,
                        read_date,
                        contact_id,
                        contact_login,
                        contact_src
                    }
                }`;

            const response = await axios.post(`/api`, { query: query }, headers.headers());
            console.log("CONTACTS", response.data.data.getContacts);

            dispatch({ type: CONTACTS, data: response.data.data.getContacts });
        } catch (err) { console.log('Erro in dispatch addContact'); }
    }
}

export const addChats =() => {
    return async dispatch => {
        try {
            const query_messages = `
            query getAllMessagesFromUser {
                getAllMessagesFromUser {
                    chat_id,
                    messages{
                        message_id,
                        user_id_sender,
                        login,
                        message,
                        date,
                        read_date
                    }
                }
            }`;

            const response_messages = await axios.post(`/api`, {
                 query: query_messages
            }, headers.headers());

            console.log("MESSAGES", response_messages.data.data.getAllMessagesFromUser);

            dispatch({ type: CHATS, data: response_messages.data.data.getAllMessagesFromUser });
        } catch (err) { console.log('Error in dispacth addChats'); }
    }
}