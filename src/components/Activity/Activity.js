import React, { Component } from 'react';
import { Feed, Card, Icon } from 'semantic-ui-react';
import * as actions from './Actions';
import { connect } from 'react-redux';

class Activity extends Component {

    state = {
        isRead: false,
    }

    componentDidMount() {
        console.log("Activity mount");
        console.log(this.props);
        console.log("mounted");
    }

    handleNotificationClicked = (id) => {
        console.log(id);
        this.props.onRemoveNotification(id);
    }


    loadActivities = () => {

        if (!this.props.notifications || this.props.notifications.length === 0) {
            return (<Feed.Summary>
                    Nothing to show.
            </Feed.Summary>)
        }

        const obj = {
            visit: "viewed",
            liked: "liked"
        }

        const loaded = this.props.notifications.map(itm => {           

            const date = new Date(itm.date / 1);
            return (
                <Feed.Summary key= { itm.notification_id }>
                    <Feed.Date>{ date.toDateString() }</Feed.Date> <a>{itm.login}</a> {obj[itm.type]} your profile.<Icon onClick={() => this.handleNotificationClicked(itm.notification_id)}name='close' />
                </Feed.Summary>
            );
        });

        return loaded;
    }



    render() {
        return (
            <Card>
                <Card.Content>
                    <Card.Header>Recent Activity</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Content>
                                { this.loadActivities() }
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Card>
        );
    }
}

const mapStateToProps = state => {

    console.log("state");
    console.log(state);

    return {
        user: state.login.user,
        notifications: state.notifications.notifications
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRemoveNotification: (id) => dispatch(actions.remove(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);