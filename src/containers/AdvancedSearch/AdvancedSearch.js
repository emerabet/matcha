import React, { Component } from 'react';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';


class AdvancedSearch extends Component {

    state = {
        users: null,
        filteredUsers: null
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
                                age
                            }
                        }
                    `;

        const results = await axios.post(`/api`, { query: query });
        await this.setState({ users : results.data.data.getUsers, filteredUsers : results.data.data.getUsers });
    }

    handleFilter = (filters) => {
        console.log("On filtre: ", filters);
    }

    render() {
        return (
            <div>
                { this.state.users && <Search handleFilter={ this.handleFilter }/> }
                <Divider horizontal>Results</Divider>
                { this.state.users && <Listview users={ this.state.filteredUsers }/> }
            </div>
        );
    }
}

export default AdvancedSearch;