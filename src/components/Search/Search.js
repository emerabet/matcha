import React, { Component } from 'react';
import { Range } from 'rc-slider';
import Slider from 'rc-slider';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';

class Search extends Component {

    state = {
        age: { min: 26, max: 38 },
        popularity: { min: 60, max: 85 },
        distance: 30,
        tag: []
    }

    componentDidMount() {
        console.log("Component Search Did Mount");
    }

    getTags = () => {
        return this.props.tags.map((itm, index) => {
            return { key: index, text: itm.tag, value: itm.tag };
        });
    }

    handleChangeAge = async (values) => {

        const minA = values[0];
        const maxA = values[1];

        await this.setState({ 
            age: { min: minA, max: maxA }
        });

        this.props.handleFilter(this.state);
    }

    handleChangePopularity = async (values) => {

        const minA = values[0];
        const maxA = values[1];

        await this.setState({ 
            popularity: { min: minA, max: maxA }
        });

        this.props.handleFilter(this.state);
    }

    handleChangeTag = async (e, data) => {
        const tag = data.value.slice();
        await this.setState({ 
            tag: tag
        });

        this.props.handleFilter(this.state);
    }

    handleChangeDistance = async (value) => {
        await this.setState({ 
            distance: value
        });
        
    }

    render () {
        return (
            <Form>
                <Form.Field>
                    <label>Age</label>
                    <Range onChange = { this.handleChangeAge } min={ 18 } max={ 100 } defaultValue={[26, 38]} />
                </Form.Field>
                <Form.Field>
                    <label>Popularity</label>
                    <Range onChange = { this.handleChangePopularity } min={ 0 } max={ 100 } defaultValue={[60, 85]} />
                </Form.Field>
                <Form.Field>
                    <label>Distance</label>
                    <Slider onChange = { this.handleChangeDistance } min={ 5 } max={ 100 } defaultValue={ 30 } />
                </Form.Field>
                <Form.Field>
                    <label>Tag</label>
                    <Dropdown onChange = { this.handleChangeTag } placeholder='Tags' fluid multiple search selection options={ this.getTags() } />
                </Form.Field>
                <Button fluid>Search</Button>
            </Form>
        );
    }
}

export default connect(null, null)(Search);