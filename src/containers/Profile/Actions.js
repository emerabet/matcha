import axios from 'axios';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

export const updateProfile =(profileState) => {
    return async dispatch => {
        try {
            //const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions update");
            //console.log('data update', res.data);
            //sessionStorage.setItem('token', res.data.token);
            dispatch({ type: UPDATE_USER_PROFILE, data: profileState });
        } catch (err) {
         /*   dispatch({
                type: LOGIN_FAIL,
                data: null
            })*/
            console.log("FAIL");
        }
    }
}