import * as actions from './Actions';
import axios from 'axios';

const initialState = {
    logged: false
}

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }
};


const reducer = (state=initialState, action) => {
    let nextState;
        switch(action.type) {
            case actions.LOGIN:
                console.log("from reducer", action);
                console.log("token", action.data);
                nextState = {...state,
                            token: action.data};
                break ;
                default:
                    return state;
        }
    return nextState;
}

export default reducer;