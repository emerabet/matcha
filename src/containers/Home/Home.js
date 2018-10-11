import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import TopMenu from '../../components/Menu/TopMenu';
import classes from './Home.css';
import './Home.css';


class Home extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   render() {
    const { activeItem } = this.state

    return (
      <div>Empty</div>
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