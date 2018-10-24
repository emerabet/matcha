import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Aux from '../../Hoc/Aux/Aux';
import withSocket from '../../Hoc/Socket/SocketHOC';
import { Link } from 'react-router-dom';

class Listview extends Component {

    state = {
        totalPerPage: 20
    }

    handleClick = (e, data) => {
        console.log(this.props.history);
        this.props.history.push(`/stalk/${data.id}`);
    }

    FillUsers = (users) => {
        const array = users.map(user => {
            const status = this.props.socket.connectedUsersMatcha.includes(user.user_id) ? 'Online' : 'Offline';
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
        console.log("count:", this.props.users.length);
        console.log("sockett:", this.props.socket);
        return (
            <Aux>
                { this.FillUsers(this.props.users) }
            </Aux>
        );
    }
}



export default withSocket(Listview);