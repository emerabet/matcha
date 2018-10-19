import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import TopMenu from '../../components/Menu/TopMenu';
import SuperChat from '../../containers/SuperChat/SuperChat';
import withSocket from '../Socket/SocketHOC';

import * as actionsActivity from '../../components/Activity/Actions';

import './Layout.css';


class Layout extends Component {

    componentDidMount() {

        this.props.socket.on('visited', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });

        this.props.socket.on('liked', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });

        this.props.socket.on('unliked', (data) => {

            console.log(data);
            this.props.onLoadNotifications('all');
        });


    }

    render() {
        return (
            <Aux>
                <TopMenu/>
                <main>
                    {this.props.children}
                </main>
                {localStorage.getItem("logged") === null ? null : <SuperChat type="bottom" />}
            </Aux>
        );
    }

}


const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadNotifications: (type) => dispatch(actionsActivity.load(type)),
    }
}


export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Layout));