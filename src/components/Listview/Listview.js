import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react'

class Listview extends Component {

    getColumns = () => {
        let columns = [];
        for (let i = 0; i < 50; i++) {
            columns.push(
                <Grid.Column key={i}>
                    <h4>Image</h4>
                    <h3>Name</h3>
                </Grid.Column>
            );
        }
        return columns;
    }

    render () {

        return (
            <Grid>{ this.getColumns() }</Grid>
        );
    }
}


export default connect(null, null)(Listview);