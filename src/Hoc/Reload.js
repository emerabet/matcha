import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './Actions';
import axios from 'axios';
//import * as headers from '../Tools/Header';
import withSocket from '../Hoc/Socket/SocketHOC';
import Aux from './Aux/Aux';

export const headers = {
    headers: {
        authorization: localStorage.getItem("token")
    }
}


class Reload extends Component {

  

    constructor(props){
        super(props);
        this.check(props);   
    }

    check = async (props) => {
        console.log("IN HOC");
        if (localStorage.getItem('logged')) {
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
            // on se reconnecte a la socket
            if (localStorage.getItem('login') && localStorage.getItem('login') !== undefined) {
                this.props.socket.connect();
                this.props.socket.emit('login', localStorage.getItem('login'));
            }
        } catch (err) {
            console.log("EXPIRED TOKEN", err);
            localStorage.clear();
        }
    }
    } 

    render(){
        return(
            <Aux>{this.props.children}</Aux>
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

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Reload));