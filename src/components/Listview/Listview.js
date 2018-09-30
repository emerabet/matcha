import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'

class Listview extends Component {

    handleClick = () => {
        console.log(this.props);
    }

    FillUsers = (users) => {

        const array = users.map(user => {
            return <Card key={ user.user_id } raised header={user.first_name } meta='Friend' description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.' />
        });
        
        console.log(array);
       return (<Card.Group itemsPerRow={6} stackable> { array } </Card.Group>);
    };

    render () {

        console.log("render listview:", this.props.users);
        return (
            <div>
                { this.FillUsers(this.props.users) };
                <button onClick= { this.handleClick } type="submit">Test</button>
            </div>
        );
    }
}

export default Listview;