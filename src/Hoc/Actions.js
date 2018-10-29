export const RESTORE_STORE_FROM_SESSION_STORAGE = 'RESTORE_STORE_FROM_SESSION_STORAGE';

export const restoreStore =() => {
    return async dispatch => {
        try {
            const user = {
                user_id: parseInt(localStorage.getItem('user_id'), 10),
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
                login: localStorage.getItem('login'),
                address: localStorage.getItem('address'),
                role: localStorage.getItem('role')
            }
            const logged = localStorage.getItem("logged");
            dispatch({ type: RESTORE_STORE_FROM_SESSION_STORAGE, data: {user: user, logged: logged }});
        } catch (err) {

        }
    }
}