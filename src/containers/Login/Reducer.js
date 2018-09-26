import * as actionTypes from './ActionTypes';
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
            case actionTypes.LOGIN:
                console.log("from reducer", action);
                console.log("login", action.userName);
                console.log('password', action.password);
                axios.post('/connect', `login=${action.userName}&password=${action.password}`, config)
                .then ( response => {
                    console.log(response);
                });
                nextState = state;
                break ;
                default:
                    return state;
        }
    return nextState;
}

export default reducer;