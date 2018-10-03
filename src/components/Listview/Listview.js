import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'

class Listview extends Component {

    state = {
        totalPerPage: 20
    }

    FillUsers = (users) => {

        const extra = (
            <a>
              16 Friends
            </a>
          );

        const array = users.map(user => {
            const meta = `${user.age} ans`;
            return <Card key={ user.user_id } raised header={user.first_name } 
                         meta = {meta}
                         description='Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat.'
                         extra={extra}
                    />
        });
       return (<Card.Group itemsPerRow={4} stackable> { array } </Card.Group>);
    };

    render () {
        console.log("count:", this.props.users.length);
        return (
            <div>
                { this.FillUsers(this.props.users) }
            </div>
        );
    }
}



export default Listview;