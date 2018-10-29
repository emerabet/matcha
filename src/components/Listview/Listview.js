import React, { Component } from 'react';
import { Card, List, Image } from 'semantic-ui-react';
import Aux from '../../Hoc/Aux/Aux';
import withSocket from '../../Hoc/Socket/SocketHOC';

class Listview extends Component {

    state = {
        totalPerPage: 20
    }

    handleClick = (e, data) => {
        this.props.history.push(`/stalk/${data.id}`);
    }

    interactiveView = (users) => {
        const array = users.map(user => {
        const status = this.props.socket.connectedUsersMatcha !== undefined && this.props.socket.connectedUsersMatcha.includes(user.user_id) ? 'Online' : 'Offline';
        const color = status === 'Online' ? 'Listview__Status__Online' : 'Listview__Status__Offline';
        const meta = `${user.age} ans - ${user.city} (${user.country})`;
        const extra = `${user.popularity} pts | ${parseInt(user.distance, 10)} km from you`;

        return  <List.Item key={ user.user_id } id={user.user_id} className={color} onClick={this.handleClick}>
                    <Image avatar src={ user.src != null ? user.src : "/pictures/smoke_by.png"} />
                    <List.Content>
                        <List.Header>{user.first_name }</List.Header>
                        <List.Description as='span'>{meta}</List.Description>
                        <List.Description as='span'>{extra}</List.Description>                        
                    </List.Content>
                </List.Item>
        });
        return (<List divided selection>{ array }</List>);
    }

    FillUsers = (users) => {
        const array = users.map(user => {

            const status = this.props.socket.connectedUsersMatcha !== undefined && this.props.socket.connectedUsersMatcha.includes(user.user_id) ? 'Online' : 'Offline';
            const color = status === 'Online' ? 'green' : 'red';
            const meta = `${user.age} ans - ${user.city} (${user.country}) : ${status}`;
            const extra = `${user.popularity} pts | ${parseInt(user.distance, 10)} km from you`;

            return <Card 
                        key={ user.user_id } raised header={user.first_name } 
                        meta = {meta}
                        image = { user.src != null && user.src }
                        description= {user.bio}
                        extra={extra}
                        id={user.user_id}
                        as='span'
                        onClick={ this.handleClick }
                        className='Listview__Card'
                        color={color}
                    />
        });
        return (<Card.Group className='Listview__Container' itemsPerRow={4} stackable> { array } </Card.Group>);
    };

    render () {
        return (
            <Aux>
                { this.props.mode === 'classic' && this.FillUsers(this.props.users) }
                { this.props.mode === 'map' && this.interactiveView(this.props.users) }
            </Aux>
        );
    }
}



export default withSocket(Listview);