import axios from 'axios';

export const RESTORE_STORE_FROM_SESSION_STORAGE = 'RESTORE_STORE_FROM_SESSION_STORAGE';

export const restoreStore =() => {
    return async dispatch => {
        try {
            console.log("actions restore");
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
            const logged = localStorage.getItem("logged");
            dispatch({ type: RESTORE_STORE_FROM_SESSION_STORAGE, data: {user: user, logged: logged }});
        } catch (err) {
         /*   dispatch({
                type: LOGIN_FAIL,
                data: null
            })*/
            console.log("FAIL RESTORE");
        }
    }
}