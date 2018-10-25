import * as actions from './Actions';
import * as clearActions from '../../components/Menu/Actions';

const initialState = {
    contacts: [],
    chats: [],
    connectedList: []
}

const reducer = (state = initialState, action) => {
    let nextState;
    console.log('in super chat reducer', action);
    switch(action.type) {
        case clearActions.CLEAR_STORE:
            nextState = initialState;
            break ;
        case actions.CONTACTS:
            console.log("from reducer contacts", action);
            nextState = { ...state,
                        contacts: action.data};
            break ;
        case actions.UNREAD_CHAT:
            console.log("from reducer unread chats", action);
            nextState = { ...state,
                        nb_unread_chats: action.data};
            break ;
        case actions.READ_CHAT:
            console.log("from reducer read chats", action);
            nextState = { ...state,
                        nb_unread_chats: action.data.nb_unread_chats, contacts: action.data.contacts};
            break ;
        case actions.NEW_MESSAGE:
            console.log("from reducer new message", action);
            nextState = { ...state,
                        nb_unread_chats: action.data.nb_unread_chats, contacts: action.data.contacts, chats: action.data.chats};
            break ;
        case actions.CHATS:
        console.log("from reducer chats", action);
            nextState = { ...state,
                chats: action.data };     
            break ;
        case actions.CONTACT_CONNECTED:
            console.log("from reducer chats connected", action);
                nextState = { ...state,
                    connectedList: action.data };     
            break ;
        case actions.CONTACT_DISCONNECTED:
            console.log("from reducer chats connected", action);
                nextState = { ...state,
                    connectedList: action.data };     
            break ;
        default: return state;
    }
    console.log("NEXT STATE", nextState);
    return nextState;
}

export default reducer;