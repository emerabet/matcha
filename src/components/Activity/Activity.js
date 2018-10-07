import React, { Component } from 'react';
import { Feed, Card } from 'semantic-ui-react';

class Activity extends Component {


    render() {

        return (
            <Card>
                <Card.Content>
                    <Card.Header>Recent Activity</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label image='/images/avatar/small/laura.jpg' />
                            <Feed.Content>
                                <Feed.Date>3 days ago</Feed.Date>
                                <Feed.Summary>
                                <a>Laura Faucet</a> created a post
                                </Feed.Summary>
                                <Feed.Extra text>Have you seen what's going on in Israel? Can you believe it.</Feed.Extra>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Card>
        );
        
    }


}

export default Activity;