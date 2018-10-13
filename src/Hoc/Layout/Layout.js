import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import TopMenu from '../../components/Menu/TopMenu';
import SuperChat from '../../containers/SuperChat/SuperChat';
import './Layout.css';


class Stalk extends Component {

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

export default Stalk;