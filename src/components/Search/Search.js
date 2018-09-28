import React, { Component } from 'react';
import { Range } from 'rc-slider';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';

class Search extends Component {

    getTags = () => {
        console.log("sdfsdfds");
        return [
            { key: 'angular', text: 'Angular', value: 'angular' },
            { key: 'css', text: 'CSS', value: 'css' },
            { key: 'design', text: 'Graphic Design', value: 'design' },
            { key: 'ember', text: 'Ember', value: 'ember' },
            { key: 'html', text: 'HTML', value: 'html' }
        ]
    }

    render () {
        return (
            <Form>
                <Form.Field>
                    <label>Age</label>
                    <Range min={ 0 } max={ 20 } defaultValue={[3, 10]} />
                </Form.Field>
                <Form.Field>
                    <label>Popularity</label>
                    <Range min={ 0 } max={ 20 } defaultValue={[3, 10]} />
                </Form.Field>
                <Form.Field>
                    <label>Tag</label>
                    <Dropdown placeholder='Tags' fluid multiple selection options={this.getTags()} />
                </Form.Field>
                <Button fluid>Search</Button>
            </Form>
        );
    }
}

/*const mapStateToProps = state => {
    return {
        users: state.users
    }
};*/

export default connect(null, null)(Search);