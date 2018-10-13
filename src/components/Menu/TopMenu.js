import React, { Component } from 'react';
import './TopMenu.css';
import { withRouter } from 'react-router-dom';
import { Menu, Icon, Label, Dropdown } from 'semantic-ui-react';
import Activity from '../Activity/Activity';

class TopMenu extends Component {

    state = {
      activeItem: 'home',
      notificationOpen: false
    }

    handleItemClick = (e, data) => {
      if (e.target.id == 'chk')
        return ;
      if (data.name && data.name == 'ddNotification') {
        
          const n = this.state.notificationOpen;

          console.log("ici ", n, !n);
          this.setState({
            notificationOpen: !n
          })
      }
      else if (data.name) {
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

            <Dropdown onClick={this.handleItemClick} 
                      item name="ddNotification"
                      icon='bell outline'
                      open={this.state.notificationOpen}
                      >
                      
                <Dropdown.Menu>
                  <Dropdown.Header>Text Size</Dropdown.Header>
                  <Activity size='small'></Activity>
                </Dropdown.Menu>
            </Dropdown>

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
            <Icon.Group size="large">
            <Icon size="large" name='wechat'> </Icon>
            <Label size="small" color='blue' horizontal circular >
            22
          </Label>
          </Icon.Group>
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