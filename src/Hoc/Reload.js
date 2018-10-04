import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './Actions';
import axios from 'axios';

class Reload extends Component {

  

    constructor(props){
        super(props);
     /*   const res = await axios.post('/connect', { token: sessionStorage.getItem('token') });
            console.log("actions login");
            console.log('data login', res.data);*/
            console.log("PROPS", props);
            if (this.props.user === undefined){
            this.props.onRestoreStore();
        } else {
            console.log("NO NEED TO RESTORE");
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