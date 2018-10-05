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
        console.log("ACTIVE", this.state.activeItem);
        this.props.history.push(`/${data.name}`);
      }
    }

    handleLogOut = (e, data) => {
      localStorage.clear();
      this.props.history.push('/login');
    }

    render (){
      return (
      
        

        <Menu stackable icon='labeled' className='test' >
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
            <Icon name='search' />
            Search
          </Menu.Item>

          <Menu.Item
            name='log_out'
            active={this.state.activeItem === 'log_out'}
            onClick={this.handleLogOut}
          >
            <Icon name='log out' />
            Log out
          </Menu.Item>
          
        </Menu>


      
    )
  }
}

export default withRouter(TopMenu);