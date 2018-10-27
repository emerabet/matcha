import * as actions from './Actions';
import * as clearActions from '../../components/Menu/Actions';

const initialState = {
    contacts: [],
    chats: [],
    connectedList: [],
    videoChats: []
}

const reducer = (state = initialState, action) => {
    let nextState;
    switch(action.type) {
        case clearActions.CLEAR_STORE:
            nextState = initialState;
            break ;
        case actions.CONTACTS:
            nextState = { ...state,
                        contacts: action.data};
            break ;
        case actions.UNREAD_CHAT:
            nextState = { ...state,
                        nb_unread_chats: action.data};
            break ;
        case actions.READ_CHAT:
            nextState = { ...state,
                        nb_unread_chats: action.data.nb_unread_chats, contacts: action.data.contacts};
            break ;
        case actions.NEW_MESSAGE:
            nextState = { ...state,
                        nb_unread_chats: action.data.nb_unread_chats, contacts: action.data.contacts, chats: action.data.chats};
            break ;
        case actions.CHATS:
            nextState = { ...state,
                chats: action.data };     
            break ;
        case actions.CONTACT_CONNECTED:
                nextState = { ...state,
                    connectedList: action.data };     
            break ;
        case actions.CONTACT_DISCONNECTED:
                nextState = { ...state,
                    connectedList: action.data };     
            break ;
        case actions.START_VIDEO_CHAT:
                nextState = { ...state,
                    videoChats: action.data };     
            break ;
        default: return state;
    }
    return nextState;
}

export default reducer;