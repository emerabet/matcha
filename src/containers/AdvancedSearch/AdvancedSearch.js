import React, { Component } from 'react';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import Aux from '../../Hoc/Aux/Aux';
import { Divider, Icon, Pagination  } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as headers from '../../Tools/Header';

import { buffer, point, polygon, pointsWithinPolygon, points } from '@turf/turf';


class AdvancedSearch extends Component {

    state = {
        users: null,
        filteredUsers: null,
        pagedUsers: null,
        itemsPerPage: 12,
        activePage:1, 
        nbPages: 60,
        tags: null,
        lastDistanceChecked: 50,
        criteria: null
    }

    async componentDidMount () {
        console.log('ComponentDidMount AdvSearch');
        this.loadData();
    }

    loadData = async () => {

        console.log("test");
        console.log(this.props);

        const query = `
                        query getUsers($extended: Boolean, $orientation: String) {
                            getUsers(extended:$extended, orientation:$orientation){
                                user_id,
                                login,
                                first_name,
                                last_name,
                                email,
                                age,
                                popularity,
                                bio,
                                latitude,
                                longitude,
                                city,
                                country,
                                src, 
                                pictures {
                                    src
                                }
                                tags { 
                                    tag
                                }
                            }
                        }
                    `;

        const users = await axios.post(`/api`, { query: query, variables: { extended: true, orientation: localStorage.getItem('orientation') } }, headers.headers());

        if (users === undefined || users === null)
            return ;
        
        
        const tags = await axios.post('/api', { query: `query getTags { getTags { tag } }`}, headers.headers());

        const nbPages = this.calculPagination(users.data.data.getUsers.length, this.state.itemsPerPage);
        const paged = this.paginate(users.data.data.getUsers, this.state.itemsPerPage, this.state.activePage); 

        console.log("set state did update");
        await this.setState({ 
            users : users.data.data.getUsers, 
            filteredUsers : users.data.data.getUsers,
            pagedUsers: paged,
            tags: tags.data.data.getTags,
            nbPages: nbPages,
        }); 
        console.log(users.data.data.getUsers);
        console.log("------------");
        console.log(this.state.users);

        this.withinArea(this.state.lastDistanceChecked);
    }

    withinArea = async (distance = 5) => {
        if (!this.props.user || !this.props.user.latitude || !this.props.user.longitude)
            return ;

        const pt = point([parseFloat(this.props.user.latitude), parseFloat(this.props.user.longitude)]);
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmm");
        console.log(pt);
        console.log(distance);


        console.log(pt);

        const buffered = buffer(pt, parseInt(distance, 10), {units: 'kilometers'});

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

        console.log("set state within area");
        await this.setState({
                        users: newUsers,
                        lastDistanceChecked: distance
                    });
    }

    handleFilter = (filters) => {

        if (filters.distance !== this.state.lastDistanceChecked) {
            this.withinArea(filters.distance);
        }

        let filtered = this.state.users.filter((itm) => {
            if ((itm.age >= filters.age.min && itm.age <= filters.age.max)
            && (itm.popularity >= filters.popularity.min && itm.popularity <= filters.popularity.max)
            && (itm.inArea === true)
            && (filters.tag.every((value) => {
                return itm.tags.some((v) => v.tag === value);})))
                return true;
            return false;
        });

        console.log(filtered);
        const nbPages = this.calculPagination(filtered.length, this.state.itemsPerPage);
        const paged = this.paginate(filtered, this.state.itemsPerPage, 1);


        console.log("Handle filter");
        this.setState({ 
            filteredUsers: filtered,
            pagedUsers: paged,
            nbPages: nbPages,
            activePage: 1
         });
    }

    handleOrder = (name) => {
        let filtered = JSON.parse(JSON.stringify(this.state.filteredUsers));
        if (name === 'age') {
            filtered.sort(function(a, b){
                return a.age-b.age
            });
        }
        else if (name === 'popularity') {
            filtered.sort(function(a, b){
                return b.popularity-a.popularity
            });
        }
        else if (name === 'popularity') {
            filtered.sort(function(a, b){
                return b.popularity-a.popularity
            });
        }


        const paged = this.paginate(filtered, this.state.itemsPerPage, 1);

        this.setState({ 
            filteredUsers: filtered,
            pagedUsers: paged,
            activePage: 1
         });
    }

    calculPagination = (itemsTotal, itemsPerPage) => {
        const count = itemsTotal;
        const totalPages = Math.ceil(count / itemsPerPage);
        return totalPages;
    }

    paginate = (array, itemsPerPage, activePage) => {
        console.log("paginate");
        //const copy = JSON.parse(JSON.stringify(array));
        return array.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
    }

    handlePageChange = (e, data) => {
        console.log("pagechange");
        const paged = this.paginate(this.state.filteredUsers, this.state.itemsPerPage, data.activePage);
        console.log("Set state handle page change");
        this.setState({
            pagedUsers: paged,
            activePage: data.activePage
        });
    }

    render() {
        console.log("re-render");
        console.log("oooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
        return (
            <Aux>
                { this.state.users && <Search tags={ this.state.tags } handleFilter={ this.handleFilter } handleSort={this.handleOrder} /> }
                { this.state.users && <Divider horizontal>Results</Divider> }
                { this.state.users && <Listview users={ this.state.pagedUsers } history={this.props.history} /> }
                { this.state.users && <Pagination className='Pagination__Container'
                    activePage={this.state.activePage}
                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                    totalPages={this.state.nbPages} 
                    onPageChange= {this.handlePageChange}
                /> }
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
}

export default connect(mapStateToProps, null)(AdvancedSearch);