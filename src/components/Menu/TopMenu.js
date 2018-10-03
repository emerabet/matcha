import React, { Component } from 'react';
import './TopMenu.css';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';

class TopMenu extends Component {

    state = {
      activeItem: 'home'
    }

    handleItemClick = (e, data) => {
      if (data.name) {
        this.setState(...this.state, { activeItem: data.name })
        console.log(data.name);
        this.props.history.push(`/${data.name}`);
      }
    }

    render (){
      return (
      
        

        <Menu icon='labeled'>
          <Menu.Item name='home' active={this.state.activeItem === 'home'} onClick={this.handleItemClick}>
            <Icon name='home' />
            Home
          </Menu.Item>

          <Menu.Item
            name='profile'
            active={this.state.activeItem === 'profile'}
            onClick={this.handleItemClick}
          >
            <Icon name='user secret' />
            Profile
          </Menu.Item>

          <Menu.Item
            name='notifications'
            active={this.state.activeItem === 'notifications'}
            onClick={this.handleItemClick}
          >
            <Icon name='bell outline' />
            Notifications
          </Menu.Item>

          <Menu.Item
            name='chat'
            active={this.state.activeItem === 'chat'}
            onClick={this.handleItemClick}
          >
            <Icon name='wechat' />
            Chat
          </Menu.Item>

          <Menu.Item
            name='search'
            active={this.state.activeItem === 'search'}
            onClick={this.handleItemClick}
          >
            Search
          </Menu.Item>
        </Menu>


      
    )
  }
}

export default withRouter(TopMenu);