import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon, Label, Dropdown } from 'semantic-ui-react';
import Activity from '../Activity/Activity';
import { connect } from 'react-redux';
import * as actions from './Actions';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';

class TopMenu extends Component {

    state = {
      activeItem: 'home',
      notificationOpen: false
    }

    handleItemClick = (e, data) => {
      if (e.target.id === 'chk')
        return ;
      if (data.name && data.name === 'ddNotification') {
          const n = this.state.notificationOpen;
          this.setState({
            notificationOpen: !n
          });
      }
      else if (data.name) {
        this.setState({ activeItem: data.name });
        this.props.history.push(`/${data.name}`);
      }
    }

    handleLogOut = async (e, data) => {
      await localStorage.clear();
      await this.props.onClearStore();
      this.props.socket.disconnect();
      axios.post('/logout');
      this.props.history.push('/login');
    }

    handleViewAll = () => {
      this.props.history.push('/notifications');
    }

    render (){
      return (
        <div className='Menu__Container'>
          <Menu secondary borderless fluid stackable icon='labeled'>
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
                    <Dropdown.Header onClick={this.handleViewAll}>View all</Dropdown.Header>
                    <Activity size='small'></Activity>
                  </Dropdown.Menu>
              </Dropdown>

            <Menu.Item
              name='chat'
              active={this.state.activeItem === 'chat'}
              onClick={this.handleItemClick}
            >
              <Icon.Group size="large">
              <Icon size="large" name='wechat'> </Icon>
              <Label size="small" color='pink' horizontal circular >
              {this.props.nb_unread_chats}
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

            <Menu.Menu position='right'>
                {parseInt(this.props.user.role, 10) === 2
                &&
                <Menu.Item
                name='admin'
                active={this.state.activeItem === 'admin'}
                onClick={this.handleItemClick}
              >
                <Icon name='desktop' />
                Admin
              </Menu.Item>
                }

                <Menu.Item
                name='log_out'
                active={this.state.activeItem === 'log_out'}
                onClick={this.handleLogOut}
              >
                <Icon name='log out' />
                Log out
              </Menu.Item>
          </Menu.Menu>




          </Menu>
        </div>

      
    )
  }
}

const mapStateToProps = state => {
  return {
    nb_unread_chats: state.chat.nb_unread_chats,
    //role: state.login.user.role,
    user: state.login.user
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClearStore: () => dispatch(actions.clearStore())
    }
}
export default withSocket(withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu)));