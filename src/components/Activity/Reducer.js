import * as actions from './Actions';
import * as clearActions from '../Menu/Actions';

const initialState = {
    notifications: []
}


const reducer = (state = initialState, action) => {
    let nextState;
    switch(action.type) {
        case clearActions.CLEAR_STORE:
            nextState = initialState;
            break ;
        case actions.NOTIFICATION_LOADED:
            nextState = { ...state,
                notifications: action.data };
            break ;
        case actions.LOAD_FAILED:
            nextState = { ...state,
                notifications: [] };
            break ;
        case actions.NOTIFICATION_DELETED_SUCCESS:
            const array = state.notifications.filter(itm => {
                if (itm.notification_id === action.data)
                    return false;
                return true;
            });
            nextState = { ...state,
                notifications: array };
            break ;
        case actions.NOTIFICATION_READ_SUCCESS:
            const newstate = state.notifications.map(itm => {
                const obj = { ...itm };
                if (itm.notification_id === action.data) {
                    obj.is_read = true;
                }
                return obj;
            });
            nextState = { ...state,
                notifications: newstate };
            break ;
        case actions.NOTIFICATION_READ_FAIL:
            nextState = { ...state};     
            break 
        default: return state;
    }
    return nextState;
}

export default reducer;