import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react'

class Home extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   render() {
    const { activeItem } = this.state

    return (
        <div>
      <Menu stackable>
        <Menu.Item>
          <img src='/logo.png' />
        </Menu.Item>

        <Menu.Item
          name='features'
          active={activeItem === 'features'}
          onClick={this.handleItemClick}
        >
          Features
        </Menu.Item>

        <Menu.Item
          name='testimonials'
          active={activeItem === 'testimonials'}
          onClick={this.handleItemClick}
        >
          Testimonials
        </Menu.Item>

        <Menu.Item name='sign-in' active={activeItem === 'sign-in'} onClick={this.handleItemClick}>
          Sign-in
        </Menu.Item>
      </Menu>
      <h1> { localStorage.getItem('token') } </h1>
      </div>
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