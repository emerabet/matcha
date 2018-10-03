import React, { Component } from 'react';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import { Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';

import { buffer, point, polygon, pointsWithinPolygon, points } from '@turf/turf';


class AdvancedSearch extends Component {

    state = {
        users: null,
        filteredUsers: null,
        tags: null,
        lastDistanceChecked: 50
    }

    async componentDidMount () {
        const query = `
                        query getUsers($extended: Boolean) {
                            getUsers(extended:$extended){
                                user_id,
                                login,
                                first_name,
                                last_name,
                                email,
                                age,
                                popularity,
                                latitude,
                                longitude,
                                tags { 
                                    tag
                                }
                            }
                        }
                    `;

        const users = await axios.post(`/api`, { query: query, variables: { extended: true } });
        const tags = await axios.post('/api', { query: `query getTags { getTags { tag } }`});
        await this.setState({ 
            users : users.data.data.getUsers, 
            filteredUsers : users.data.data.getUsers,
            tags: tags.data.data.getTags
        });

        this.withinArea(this.state.lastDistanceChecked);
    }

    withinArea = async (distance = 5) => {
        if (!this.props.user || !this.props.user.latitude || !this.props.user.longitude)
            return ;

        const pt = point([this.props.user.latitude, this.props.user.longitude]);
        const buffered = buffer(pt, distance, {units: 'kilometers'});

        /* Copie en profondeur du tableau d'objets */
        const newUsers = JSON.parse(JSON.stringify(this.state.users));

        newUsers.forEach(element => {
            if (element.latitude && element.longitude) {
                const pts = points([[element.latitude, element.longitude]]);
                const searchWithin = polygon(buffered.geometry.coordinates);
                const ptsWithin = pointsWithinPolygon(pts, searchWithin);

                if (ptsWithin.features.length > 0) {
                    element.inArea = true;
                }
            } else {
                element.inArea = false;
            }
        });

        await this.setState({
                                users: newUsers,
                                lastDistanceChecked: distance
                    });
    }

    handleFilter = (filters) => {

        if (filters.distance !== this.state.lastDistanceChecked) {
            this.withinArea(filters.distance);
        }

        const filtered = this.state.users.filter((itm) => {
            if ((itm.age >= filters.age.min && itm.age <= filters.age.max)
            && (itm.popularity >= filters.popularity.min && itm.popularity <= filters.popularity.max)
            && (itm.inArea === true)
            && (filters.tag.every((value) => {
                return itm.tags.some((v) => v.tag == value);
            })))
            
            return true;
        });

        this.setState({ filteredUsers: filtered });
    }

    render() {
        return (
            <div>
                { this.state.users && <Search tags={ this.state.tags } handleFilter={ this.handleFilter }/> }
                <Divider horizontal>Results</Divider>
                { this.state.users && <Listview users={ this.state.filteredUsers }/> }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
}

export default connect(mapStateToProps, null)(AdvancedSearch);