import axios from 'axios';
import * as headers from '../../Tools/Header';
export const CONTACTS = 'CONTACTS';
export const CHATS = 'CHATS';
export const MESSAGE = 'MESSAGE';
export const UNREAD_CHAT = 'UNREAD_CHAT';
export const READ_CHAT = 'READ_CHAT';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const CONTACT_CONNECTED = 'CONTACT_CONNECTED';
export const CONTACT_DISCONNECTED = 'CONTACT_DISCONNECTED';
export const START_VIDEO_CHAT = 'START_VIDEO_CHAT';
export const CLOSE_VIDEO_CHAT = 'CLOSE_VIDEO_CHAT';

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
            let nb_unread_chat = 0;
            await response.data.data.getContacts.forEach(contact => {
                if (contact.user_id_sender !== parseInt(localStorage.getItem("user_id"), 10) && contact.read_date === null){
                    nb_unread_chat++;
                }
            })
            dispatch({ type: CONTACTS, data: response.data.data.getContacts });
            dispatch({ type: UNREAD_CHAT, data: nb_unread_chat });
        } catch (err) { }
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
            dispatch({ type: CHATS, data: response_messages.data.data.getAllMessagesFromUser });
        } catch (err) { }
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
        const insertedId = response.data.data.addMessage;
        if (insertedId){
            const updatedChats = await chats.map(chat => {
                if (chat.chat_id === chat_id) {
                    chat.messages.push({message_id: insertedId, user_id_sender: from, login: login, message: message, date: `${Date.now()}`});
                }
                return chat;
            });
            let updatedContacts = await contacts.map(contact => {
                if (contact.chat_id === chat_id) {
                    contact.message_id = insertedId;
                    contact.user_id_sender = from;
                    contact.message = message;
                    contact.date = `${Date.now()}`;
                }
                return contact;
            });
            await updatedContacts.sort((a, b) => (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0)
            dispatch({ type: CONTACTS, data: updatedContacts });
            dispatch({ type: CHATS, data: updatedChats });
            socket.emit('newMessage', {chat_id: chat_id, login: login, to: to, message: message, messageId: insertedId});
            
        }
        } catch (err) { }
    }
}

export const receiveMessage =(chats, contacts, mes, nb_unread_chats) => {
    return async dispatch => {
        let nb_update = nb_unread_chats;
        const updatedChats = await chats.map(chat => {
            if (chat.chat_id === mes.chat_id) {
                chat.messages.push({message_id: mes.message_id, user_id_sender: mes.user_id_sender, login: mes.login, message: mes.message, date: mes.date});
            }
            return chat;
        });
        const updatedContacts = await contacts.map(contact => {
            if (contact.chat_id === mes.chat_id) {
                contact.message_id = mes.message_id;
                contact.user_id_sender = mes.user_id_sender;
                contact.message = mes.message;
                contact.date = mes.date;
                if (contact.read_date !== null) {
                    nb_update++;
                }
                contact.read_date = null;
            }
            return contact;
        });
        dispatch({ type: NEW_MESSAGE, data: {contacts: updatedContacts, chats: updatedChats, nb_unread_chats: nb_update }});
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

export const openChat = (nb_unread_chats, chat_id, contacts) => {
    return async dispatch => {
        const updatedContacts = await contacts.map(contact => {
            if (contact.chat_id === chat_id) {
                contact.read_date = Date.now();
            }
            return contact;
        });
        const nb_updated = nb_unread_chats - 1;
        dispatch({ type: READ_CHAT, data: {nb_unread_chats: nb_updated, contacts: updatedContacts} });
        try {
            const query = `
                        mutation readChat($chat_id: Int!) {
                            readChat(chat_id: $chat_id)
                        }
                    `;
        
        await axios.post(`/api`,
            {
                query: query,
                variables: {
                    chat_id: chat_id
                }
            }, headers.headers());
        } catch (err) {}
    }
}

export const contactConnected= (connectedList = [], contact_id) => {
    return async dispatch => {
        if (contact_id) {
            const updatedconnectedList = [...connectedList, contact_id];
            dispatch({ type: CONTACT_CONNECTED, data: updatedconnectedList });
        } else
        dispatch({ type: CONTACT_CONNECTED, data: connectedList });
    }
}

export const contactDisconnected= (connectedList, contact_id) => {
    return async dispatch => {
        const updatedconnectedList = await connectedList.filter(contact => {
            if (contact === contact_id)
                return false;
            else
                return true;
        });
        dispatch({ type: CONTACT_DISCONNECTED, data: updatedconnectedList });
    }
}

export const startVideoChat = (videoChats, from, data) => {
    return async dispatch => {
        const updatedVideoChats = [...videoChats, {from: from, offer: "initiated", data: data}];
        dispatch({ type: START_VIDEO_CHAT, data: updatedVideoChats})
    }
}

export const acceptVideoChat = (videoChats, from, data) => {
    return async dispatch => {
        const updatedVideoChats = [...videoChats, {from: from, offer: "accepted", data: data}];
        dispatch({ type: START_VIDEO_CHAT, data: updatedVideoChats})
    }
}

export const closeVideoChat = (videoChats, contact_id) => {
    return async dispatch => {
        const updatedVideoChats = videoChats.filter(videoChat => {
            return videoChat.from !== contact_id
        })
        dispatch({ type: START_VIDEO_CHAT, data: updatedVideoChats})
    }
}