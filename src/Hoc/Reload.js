import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './Actions';
import axios from 'axios';
//import * as headers from '../Tools/Header';
export const headers = {
    headers: {
    authorization: sessionStorage.getItem("token")
    }
}
class Reload extends Component {

  

    constructor(props){
        super(props);
        console.log("dlksdlds");
        this.check(props);
            
    }

    check = async (props) => {
        console.log("IN HOC");
        try {
            const res = await axios.get('/check', headers);

            console.log("FEF", res);
            console.log("actions login");
            // console.log('data login', res.data);
            console.log("PROPS", props);
            if (this.props.user === undefined){
                this.props.onRestoreStore();
            } else {
                    console.log("NO NEED TO RESTORE");
            }

        } catch (err) {
            console.log("EXPIRED TOKEN", err);
            // destroy local storage
            await sessionStorage.removeItem('token');
            sessionStorage.removeItem('last_name');
            sessionStorage.removeItem('first_name');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('last_visit');
            sessionStorage.removeItem('share_location');
            sessionStorage.removeItem('gender');
            sessionStorage.removeItem('orientation');
            sessionStorage.removeItem('bio');
            sessionStorage.removeItem('birthdate');
            sessionStorage.removeItem('popularity');
            sessionStorage.removeItem('latitude');
            sessionStorage.removeItem('longitude');
            sessionStorage.removeItem('login');
        }

    } 

    render(){
        return(
            <div>{this.props.children}</div>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRestoreStore: () => dispatch(actions.restoreStore())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reload);