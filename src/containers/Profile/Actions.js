import axios from 'axios';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const UPDATE_USER_LOCATION = 'UPDATE_USER_LOCATION';


export const updateProfile =(profileState) => {
    return async dispatch => {
        try {
            //const res = await axios.post('/connect', { login: userName, password: password });
            console.log("actions update");
            //console.log('data update', res.data);
            //localStorage.setItem('token', res.data.token);
            console.log("PROFILE STATE", profileState);
            localStorage.setItem('last_name', profileState.last_name);
            localStorage.setItem('first_name', profileState.first_name);
            localStorage.setItem('email', profileState.email);
            localStorage.setItem('last_visit', profileState.last_visit);
            localStorage.setItem('share_location', profileState.share_location);
            localStorage.setItem('gender', profileState.gender);
            localStorage.setItem('orientation', profileState.orientation);
            localStorage.setItem('bio', profileState.bio);
            localStorage.setItem('birthdate', profileState.birthdate);
            localStorage.setItem('popularity', profileState.popularity);
            localStorage.setItem('latitude', profileState.latitude);
            localStorage.setItem('longitude', profileState.longitude);
            localStorage.setItem('login', profileState.login);
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

export const updateLocation =(location, address) => {
    return async dispatch => {
        try {
            localStorage.setItem('share_location', location);
            localStorage.setItem('address', address);
            dispatch({ type: UPDATE_USER_LOCATION, data: {location: location, address: address} });
        } catch (err) {
         /*   dispatch({
                type: LOGIN_FAIL,
                data: null
            })*/
            console.log("FAIL");
        }
    }
}