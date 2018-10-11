import React, { Component } from 'react';
import { Feed, Card, Icon } from 'semantic-ui-react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

class Activity extends Component {

    componentDidMount() {
        console.log("Activity mount");
        console.log(this.props);
        console.log("mounted");
        const type = this.props.size == 'large' ? 'all' : 'unread';

        if (type == 'all' || (this.props && this.props.notifications.length === 0)) {
            this.props.onLoadNotification(type);
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

    Nothing = () => {
        return (<Feed.Summary>
            Nothing to show.
        </Feed.Summary>);
    }

    loadActivities = () => {

        if (!this.props.notifications || this.props.notifications.length === 0) {
            return this.Nothing();
        }

        const obj = {
            visit: "viewed",
            like: "liked",
            unlike: "unliked",
            black_list: "blacklisted",
            match: "matched",
            unmatch: "unmatched",
        }

        const mystyle = {
            color: '#d2d2d2'
        }
        
        let count = 0;

        const loaded = this.props.notifications.map(itm => {         

            if (this.props.size == 'small' && itm.is_read === true)
                return false;
            count++;
            const date = new Date(itm.date / 1);
            return (
                <Feed.Event key={ itm.notification_id }>
                <Feed.Label>
                             <img src={ itm.src } />
                        </Feed.Label>
                    <Feed.Content>
                        
                        <Feed.Summary style={ itm.is_read ? mystyle : null }>
                            <Feed.Date>{ date.toDateString() }</Feed.Date> <Link to={`/stalk/${itm.user_id_from}`}>{itm.login}</Link> {obj[itm.type]} your profile.
                            {itm.is_read === false && <Icon link onClick={() => this.handleReadNotificationClicked(itm.notification_id)} name='check' />}
                        </Feed.Summary>
                    </Feed.Content>
                </Feed.Event>
               // <Icon onClick={() => this.handleRemoveNotificationClicked(itm.notification_id)} name='close' />
            );
        });

        console.log("LENGHT: ", loaded.length);

        return count > 0 ? loaded : this.Nothing();;
    }

    render() {
        return (
            <Feed size={this.props.size}>            
                { this.loadActivities() }
            </Feed>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user,
        notifications: state.notifications.notifications
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRemoveNotification: (id) => dispatch(actions.remove(id)),
        onCheckNotification: (id) => dispatch(actions.check(id)),
        onLoadNotification: (type) => dispatch(actions.load(type)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);