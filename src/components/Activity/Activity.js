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

        if (this.props && this.props.notifications.length === 0) {
            console.log("On essaye de charger les notifications");
            this.props.onLoadNotification();
        }
    }

    handleRemoveNotificationClicked = (id) => {
        console.log(id);
        this.props.onRemoveNotification(id);
    }

    handleReadNotificationClicked = (id) => {
        console.log(id);
        this.props.onCheckNotification(id);
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
                    <Feed.Date>{ date.toDateString() }</Feed.Date> <a>{itm.login}</a> {obj[itm.type]} your profile.
                    <Icon onClick={() => this.handleRemoveNotificationClicked(itm.notification_id)} name='close' />
                    <Icon onClick={() => this.handleReadNotificationClicked(itm.notification_id)} name='check' />
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
        onRemoveNotification: (id) => dispatch(actions.remove(id)),
        onCheckNotification: (id) => dispatch(actions.check(id)),
        onLoadNotification: (id) => dispatch(actions.load()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);