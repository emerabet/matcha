import React, { Component } from 'react';
import { Range } from 'rc-slider';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';

const Handle = Slider.Handle;

class Search extends Component {
    state = {
        age: { min: 26, max: 38 },
        popularity: { min: 60, max: 85 },
        distance: 100,
        tag: []
    }

    componentDidMount() {
        this.props.handleFilter(this.state);
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

        this.props.handleFilter(this.state);
    }

    handleOrdering = async (e, data) => {
        this.props.handleSort(data.name);
    }

    handleTooltip = (data) => {
        const { value, dragging, index, ...restProps } = data;
            return (
                <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
                >
                <Handle value={value} {...restProps} />
                </Tooltip>
            );
    }

    render () {
        return (
            <Form>
                <Form.Field>
                    <label>Age</label>
                    <Range onChange = { this.handleChangeAge } min={ 18 } max={ 100 } defaultValue={[26, 38]} handle={this.handleTooltip} />
                </Form.Field>
                <Form.Field>
                    <label>Popularity</label>
                    <Range onChange = { this.handleChangePopularity } min={ 0 } max={ 100 } defaultValue={[60, 85]} handle={this.handleTooltip} />
                </Form.Field>
                <Form.Field>
                    <label>Distance</label>
                    <Slider onChange = { this.handleChangeDistance } min={ 5 } max={ 500 } defaultValue={ 100 } handle={this.handleTooltip} />
                </Form.Field>
                <Form.Field>
                    <label>Tag</label>
                    <Dropdown onChange = { this.handleChangeTag } placeholder='Tags' fluid multiple search selection options={ this.getTags() } />
                </Form.Field>
                <Form.Field>
                    <label>Order By</label>
                    <Button name='age' onClick={this.handleOrdering}>Age</Button>
                    <Button name='popularity' onClick={this.handleOrdering}>Popularity</Button>
                </Form.Field>
            </Form>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.login.token,
        user: state.login.user
    }
};

export default connect(mapStateToProps, null)(Search);