import * as actions from './Actions';
import * as profileActions from '../Profile/Actions';
import * as reloadActions from '../../Hoc/Actions';
import * as clearActions from '../../components/Menu/Actions';

const initialState = {
    logged: false
}

const reducer = (state = initialState, action) => {
    let nextState;
    switch(action.type) {
        case actions.LOGIN:
            nextState = { ...state,
                        token: action.data.token,
                        user: action.data.user, logged: true };
            break ;
        case clearActions.CLEAR_STORE:
            nextState = initialState;
            break ;
        case actions.LOGIN_FAIL:
            nextState = { ...state,
                token: null };     
            break ;
        case profileActions.UPDATE_USER_PROFILE:
       
            const user_updated ={
                login: action.data.login,
                user_id: action.data.user_id,
                lastName: action.data.last_name,
                firstName: action.data.first_name,
                email: action.data.email,
                last_visit: action.data.last_visit,
                share_location: action.data.share_location,
                gender: action.data.gender,
                orientation: action.data.orientation,
                bio: action.data.bio,
                birthdate: action.data.birthdate,
                popularity: action.data.popularity,
                latitude: action.data.latitude,
                longitude: action.data.longitude
            }
               nextState = {...state, user: user_updated}
            break ;
        case profileActions.UPDATE_USER_LOCATION:
            nextState = {...state, user: {...state.user, share_location: action.data.location, address: action.data.address}}
            break ;
        case reloadActions.RESTORE_STORE_FROM_SESSION_STORAGE:
            nextState = {...state, user: action.data.user, logged: action.data.logged}
            break ;
        default: return state;
    }
    return nextState;
}

export default reducer;