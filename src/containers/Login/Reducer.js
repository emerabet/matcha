import * as actions from './Actions';

const initialState = {
    logged: false
}

const reducer = (state = initialState, action) => {
    let nextState;
    console.log('in login reducer');
    switch(action.type) {
        case actions.LOGIN:
            console.log("from reducer", action);
            console.log("token", action.data.token);
            console.log("user", action.data.user);
            nextState = { ...state,
                        token: action.data.token,
                        user: action.data.user };
            break ;
        case actions.LOGIN_FAIL:
            nextState = { ...state,
                token: null };     
            break ;
        default: return state;
    }
    console.log(nextState);
    return nextState;
}

export default reducer;