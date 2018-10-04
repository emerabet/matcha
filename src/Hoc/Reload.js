import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './Actions';

class Reload extends Component {

  

    componentDidMount(){
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