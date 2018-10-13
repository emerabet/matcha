import * as actions from './Actions';

const initialState = {
    contacts: [],
    chats: []
}

const reducer = (state = initialState, action) => {
    let nextState;
    console.log('in super chat reducer', action);
    switch(action.type) {
        case actions.CONTACTS:
            console.log("from reducer contacts", action);
            nextState = { ...state,
                        contacts: action.data};
            break ;
        case actions.CHATS:
        console.log("from reducer chats", action);
            nextState = { ...state,
                chats: action.data };     
            break ;
        default: return state;
    }
    console.log("NEXT STATE", nextState);
    return nextState;
}

export default reducer;