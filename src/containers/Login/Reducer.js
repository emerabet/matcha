import * as actionTypes from './ActionTypes';

const initialState = {
    logged: false
}

const reducer = (state=initialState, action) => {
    let nextState;
        switch(action.type) {
            case actionTypes.LOGIN:
                console.log(action);
                nextState = state;
                break ;
                default:
                    return state;
        }
    return nextState;
}

export default reducer;