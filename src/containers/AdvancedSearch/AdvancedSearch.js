import React, { Component } from 'react';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';

import { buffer, point, polygon, pointsWithinPolygon, points } from '@turf/turf';


class AdvancedSearch extends Component {

    state = {
        users: null,
        filteredUsers: null,
        tags: null
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
        this.withinArea(this.state.users, 200);
    }

    withinArea = (users, distance = 5) => {
        const pt = point([+48.8966021, +2.3189172]);
        const buffered = buffer(pt, distance, {units: 'kilometers'});
/*
        var searchWithin = polygon(buffered);
        var ptsWithin = pointsWithinPolygon([pt], searchWithin.geometry.coordinates);
*/
        var pts = points([[48.8966021, 2.3189172]]);
        var searchWithin = polygon(buffered.geometry.coordinates);
        var ptsWithin = pointsWithinPolygon(pts, searchWithin);

        console.log("   -----   BUFFER   -----   ");
    //  console.log(buffered);
        console.log(ptsWithin);
    }

    handleFilter = (filters) => {
        const filtered = this.state.users.filter((itm) => {
            if ((itm.age >= filters.age.min && itm.age <= filters.age.max)
            && (itm.popularity >= filters.popularity.min && itm.popularity <= filters.popularity.max)
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

export default AdvancedSearch;