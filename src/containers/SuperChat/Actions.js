import axios from 'axios';
import * as headers from '../../Tools/Header';
import uniqid from 'uniqid';
export const CONTACTS = 'CONTACTS';
export const CHATS = 'CHATS';
export const MESSAGE = 'MESSAGE';


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
        console.log("ADD CHATS DISPTACH");
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

export const addMessage =(chat_id, login, from, to, message, chats, socket, contacts) => {
    return async dispatch => {
        try {
            const query = `
                        mutation addMessage($chat_id: Int!, $message: String!) {
                            addMessage(chat_id: $chat_id, message: $message)
                        }
                    `;
        
        const response = await axios.post(`/api`,
            {
                query: query,
                variables: {
                    chat_id: chat_id,
                    message: message
                }
            }, headers.headers());
        console.log("MESSAGES", response.data.data.addMessage);
        const insertedId = response.data.data.addMessage;
        if (insertedId){
            const updatedChats = chats.map(chat => {
                if (chat.chat_id === chat_id) {
                    chat.messages.push({message_id: insertedId, user_id_sender: from, login: login, message: message, date: `${Date.now()}`});
                }
                return chat;
            });
            const updatedContacts = contacts.map(contact => {
                if (contact.chat_id === chat_id) {
                    contact.message_id = insertedId;
                    contact.user_id_sender = from;
                    contact.message = message;
                    contact.date = `${Date.now()}`;
                }
                return contact;
            });
            dispatch({ type: CONTACTS, data: updatedContacts });
            dispatch({ type: CHATS, data: updatedChats });
            socket.emit('newMessage', {chat_id: chat_id, login: login, to: to, message: message, messageId: insertedId});
            
        }
        } catch (err) { console.log('Error in dispacth addChats'); }
    }
}

export const receiveMessage =(chats, contacts, mes) => {
    return async dispatch => {
        const updatedChats = chats.map(chat => {
            if (chat.chat_id === mes.chat_id) {
                chat.messages.push({message_id: mes.message_id, user_id_sender: mes.user_id_sender, login: mes.login, message: mes.message, date: mes.date});
            }
            return chat;
        });
        const updatedContacts = contacts.map(contact => {
            if (contact.chat_id === mes.chat_id) {
                contact.message_id = mes.message_id;
                contact.user_id_sender = mes.user_id_sender;
                contact.message = mes.message;
                contact.date = mes.date;
            }
            return contact;
        });
        dispatch({ type: CONTACTS, data: updatedContacts });
        
        dispatch({ type: CHATS, data: updatedChats });
       
    }
}

export const contactIsTyping = (contacts, contact_id) => {
    return async dispatch => {
        const updatedContacts = await contacts.map(contact => {
            if (contact.contact_id === contact_id) {
                contact.isTyping = true;
            }
            return contact;
        });
        dispatch({ type: CONTACTS, data: updatedContacts });
    }
}

export const contactStopTyping = (contacts, contact_id) => {
    return async dispatch => {
        const updatedContacts = await contacts.map(contact => {
            if (contact.contact_id === contact_id) {
                contact.isTyping = false;
            }
            return contact;
        });
        dispatch({ type: CONTACTS, data: updatedContacts });
    }
}
