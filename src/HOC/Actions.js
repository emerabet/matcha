import axios from 'axios';

export const RESTORE_STORE_FROM_SESSION_STORAGE = 'RESTORE_STORE_FROM_SESSION_STORAGE';

export const restoreStore =() => {
    return async dispatch => {
        try {
            //const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions restore");
            //console.log('data update', res.data);
            //sessionStorage.setItem('token', res.data.token);
            const user = {
                lastName: sessionStorage.getItem('last_name'),
                firstName: sessionStorage.getItem('first_name'),    
                email: sessionStorage.getItem('email'),
                last_visit: sessionStorage.getItem('last_visit'),
                share_location: sessionStorage.getItem('share_location'),
                gender: sessionStorage.getItem('gender'),
                orientation: sessionStorage.getItem('orientation'),
                bio: sessionStorage.getItem('bio'),
                birthdate: sessionStorage.getItem('birthdate'),
                popularity: sessionStorage.getItem('popularity'),
                latitude: sessionStorage.getItem('latitude'),
                longitude: sessionStorage.getItem('longitude'),
                login: sessionStorage.getItem('login')
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