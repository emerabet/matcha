import axios from 'axios';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';

export const updateProfile =(profileState) => {
    return async dispatch => {
        try {
            //const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions update");
            //console.log('data update', res.data);
            //sessionStorage.setItem('token', res.data.token);
            console.log("PROFILE STATE", profileState);
            sessionStorage.setItem('last_name', profileState.last_name);
            sessionStorage.setItem('first_name', profileState.first_name);
            sessionStorage.setItem('email', profileState.email);
            sessionStorage.setItem('last_visit', profileState.last_visit);
            sessionStorage.setItem('share_location', profileState.share_location);
            sessionStorage.setItem('gender', profileState.gender);
            sessionStorage.setItem('orientation', profileState.orientation);
            sessionStorage.setItem('bio', profileState.bio);
            sessionStorage.setItem('birthdate', profileState.birthdate);
            sessionStorage.setItem('popularity', profileState.popularity);
            sessionStorage.setItem('latitude', profileState.latitude);
            sessionStorage.setItem('longitude', profileState.longitude);
            sessionStorage.setItem('login', profileState.login);
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