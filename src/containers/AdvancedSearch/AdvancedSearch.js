import React, { Component } from 'react';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';


class AdvancedSearch extends Component {

    state = {
        users: null,
        filteredUsers: null,
        tags: null
    }

    async componentDidMount () {
        const query = `
                        query getUsers {
                            getUsers{
                                user_id,
                                login,
                                first_name,
                                last_name,
                                email,
                                age,
                                popularity
                            }
                        }
                    `;

        const results = await axios.post(`/api`, { query: query });
        const res = await axios.post('/api', { query: `query getTags { getTags { tag } }`});
        await this.setState({ 
            users : results.data.data.getUsers, 
            filteredUsers : results.data.data.getUsers,
            tags: res.data.data.getTags
        });
    }

    handleFilter = (filters) => {
        const filtered = this.state.users.filter((itm) => {
            if ((itm.age >= filters.age.min && itm.age <= filters.age.max)
            && (itm.popularity >= filters.popularity.min && itm.popularity <= filters.popularity.max))
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