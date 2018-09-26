import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {

    render() {
        console.log("home", this.props.token);
        return(
            <h1> Home </h1>
        )};

}

const mapStateToProps = state => {
    return {
        token: state.token
    }
};

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(Home);