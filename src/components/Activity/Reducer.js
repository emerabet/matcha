import * as actions from './Actions';

const initialState = {
    notifications: []
}


const reducer = (state = initialState, action) => {
    let nextState;
    switch(action.type) {
        case actions.NOTIFICATION_LOADED:
            nextState = { ...state,
                notifications: action.data };
            break ;
        case actions.LOAD_FAILED:
            nextState = { ...state,
                notifications: [] };
            break ;
        case actions.NOTIFICATION_DELETED_SUCCESS:
            console.log("data: ", action.data);
            const array = state.notifications.filter(itm => {
                if (itm.notification_id === action.data)
                    return false;
                return true;
            });

            nextState = { ...state,
                notifications: array };
            break ;
        case actions.NOTIFICATION_READ_SUCCESS:
            nextState = { ...state,
                notifications: action.data };
            break ;
        case actions.NOTIFICATION_READ_FAIL:
            nextState = { ...state,
                token: null };     
            break 
        default: return state;
    }
    return nextState;
}

export default reducer;