import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import './Home.css';
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch';


class Home extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   render() {
    return (
        <AdvancedSearch history={this.props.history} mode='classic'></AdvancedSearch>
    )
  }

}

const mapStateToProps = state => {
    return {
        token: state.login.token
    }
};

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(Home);