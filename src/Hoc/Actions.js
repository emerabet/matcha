import axios from 'axios';

export const RESTORE_STORE_FROM_SESSION_STORAGE = 'RESTORE_STORE_FROM_SESSION_STORAGE';

export const restoreStore =() => {
    return async dispatch => {
        try {
            //const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions restore");
            //console.log('data update', res.data);
            //localStorage.setItem('token', res.data.token);
            const user = {
                lastName: localStorage.getItem('last_name'),
                firstName: localStorage.getItem('first_name'),    
                email: localStorage.getItem('email'),
                last_visit: localStorage.getItem('last_visit'),
                share_location: localStorage.getItem('share_location'),
                gender: localStorage.getItem('gender'),
                orientation: localStorage.getItem('orientation'),
                bio: localStorage.getItem('bio'),
                birthdate: localStorage.getItem('birthdate'),
                popularity: localStorage.getItem('popularity'),
                latitude: localStorage.getItem('latitude'),
                longitude: localStorage.getItem('longitude'),
                login: localStorage.getItem('login')
            }
            
            dispatch({ type: RESTORE_STORE_FROM_SESSION_STORAGE, data: user });
        } catch (err) {
         /*   dispatch({
                type: LOGIN_FAIL,
                data: null
            })*/
            console.log("FAIL RESTORE");
        }
    }
}