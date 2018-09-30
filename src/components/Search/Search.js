import React, { Component } from 'react';
import { Range } from 'rc-slider';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';

class Search extends Component {

    state = {
        age: {min: 18, max: 100},
        popularity: { min: 0, max: 5},
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
            popularity: { ...this.state.popularity },
            age: { min: minA, max: maxA },
            tag: [ ...this.state.tag ] 
        });

        this.props.handleFilter(this.state);

        //  const newUsers = this.state.users.filter(user => user.age >= min && user.age <= max );
        
        //  console.log(newUsers);

        //this.setState( { users: newUsers });
    }

    handleChangePopularity = async (values) => {

        const minA = values[0];
        const maxA = values[1];

        await this.setState({ 
            popularity: { min: minA, max: maxA },
            age: { ...this.state.age },
            tag: [ ...this.state.tag ] 
        });

        this.props.handleFilter(this.state);
    }

    handleChangeTag = async (e, data) => {
        console.log(data);
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
                    <label>Tag</label>
                    <Dropdown onChange = { this.handleChangeTag } placeholder='Tags' fluid multiple search selection options={ this.getTags() } />
                </Form.Field>
                <Button fluid>Search</Button>
            </Form>
        );
    }
}

export default connect(null, null)(Search);