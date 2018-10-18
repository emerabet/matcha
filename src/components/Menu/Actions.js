import axios from 'axios';
import * as headers from '../../Tools/Header';

import * as actionsActivity from '../../components/Activity/Actions';

export const CLEAR_STORE = 'CLEAR_STORE';
//export const LOGIN_FAIL = 'LOGIN_FAIL';

export const clearStore =(userName, password, socket) => {
    return async dispatch => {
        try {
            

            //dispatch(actionsActivity.load('unread'));
            dispatch({ type: CLEAR_STORE});
        } catch (err) {
        }
    }
}