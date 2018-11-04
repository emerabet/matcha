import React, { Component } from 'react';
import { Divider, Icon, Pagination, Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { buffer, point, polygon, pointsWithinPolygon, points } from '@turf/turf';
import distance from '@turf/distance';
import axios from 'axios';
import Search from './../../components/Search/Search';
import Listview from './../../components/Listview/Listview';
import MapSearch from './../../components/MapSearch/MapSearch';
import Aux from '../../Hoc/Aux/Aux';
import * as headers from '../../Tools/Header';
import NotAuthorized from '../../components/NotAuthorised/NotAuthorised';

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
        criteria: null,
        loaded: false,
        complete: false
    }

    async componentDidMount () {
        const complete = await this.checkProfile();
        if (complete)
            this.loadData();
        this.setState({complete: complete})
    }

    checkProfile = async () => {
        const query = `
                        query checkProfile {
                            checkProfile
                        }
                    `;

        const res = await axios.post(`/api`, { query: query, variables: { }}, headers.headers());
        if (res)
            return res.data.data.checkProfile;
        else
            return false;
    }

    loadData = async () => {
        const query = `
                        query getUsers($extended: Boolean, $orientation: String, $gender: String) {
                            getUsers(extended:$extended, orientation:$orientation, gender: $gender){
                                user_id,
                                login,
                                first_name,
                                last_name,
                                email,
                                age,
                                popularity,
                                bio,
                                gender,
                                orientation,
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

        const users = await axios.post(`/api`, { query: query, variables: { extended: true, orientation: localStorage.getItem('orientation'), gender: localStorage.getItem('gender') } }, headers.headers());

        if (users === undefined || users === null)
            return ;
        
        const tags = await axios.post('/api', { query: `query getTags { getTags { tag } }`}, headers.headers());

        const nbPages = this.calculPagination(users.data.data.getUsers.length, this.state.itemsPerPage);
        const paged = this.paginate(users.data.data.getUsers, this.state.itemsPerPage, this.state.activePage); 

        if (this.props.mode === "classic") {
            await this.scoring(users.data.data.getUsers, tags.data.data.getTags);
        } else {
            await this.setState({ 
                users : users.data.data.getUsers, 
                filteredUsers : users.data.data.getUsers,
                pagedUsers: paged,
                tags: tags.data.data.getTags,
                nbPages: nbPages,
                loaded: true
            });
        }

        this.withinArea(this.state.lastDistanceChecked);
    }

    scoring = async (users, tags) => {

        if (isNaN(parseFloat(this.props.user.latitude)) || isNaN(parseFloat(this.props.user.longitude)))
            return ;

        const queryTags = `
                        query getTagByUser($id: Int!) {
                            getTagByUser(id: $id){
                                tag
                            }
                        }
                    `;

        const resp = await axios.post(`/api`, { query: queryTags, variables: {id: parseInt(localStorage.getItem("user_id"), 10)}}, headers.headers());
        const user_tags = resp.data.data.getTagByUser; 
        const ranking = await Promise.all(users.map(async member => {
            let dist = 19999;
            if (member.latitude && member.longitude) {
                var from = point([parseFloat(this.props.user.latitude), parseFloat(this.props.user.longitude)]);
                var to = point([member.latitude, member.longitude]);
                var options = {units: 'kilometers'};
                dist = distance(from, to, options);
            }
            
            let number_of_common_tags = 0;
            await user_tags.forEach(async u_tag => {
                await member.tags.forEach(async m_tag =>{
                    if (u_tag.tag === m_tag.tag)
                        number_of_common_tags++;
                })
            });
            const popularity = (member.popularity && member.popularity !== 0 ? member.popularity : 1)
            const score = (1000 / dist) * (1 + number_of_common_tags) * (popularity);

            const withScore = {...member, ranking: score}
            return withScore
        }));
        
        let sorted = await ranking.concat();
        await Promise.all(sorted.sort((a, b) => {
            return (b.ranking - a.ranking)
        }));

        const nbPages = this.calculPagination(sorted.length, this.state.itemsPerPage);

        const paged = this.paginate(sorted, this.state.itemsPerPage, this.state.activePage);
        
        await this.setState({ 
            users : sorted, 
            filteredUsers : sorted,
            pagedUsers: paged,
            tags: tags,
            nbPages: nbPages,
            loaded: true
        });
    }

    handleFilter = async (filters) => {
        if (filters.distance !== this.state.lastDistanceChecked) {
            await this.withinArea(filters.distance);
        }

        let filtered = this.state.users.filter((itm) => {
            if ((itm.age >= filters.age.min && itm.age <= filters.age.max)
            && (itm.popularity >= filters.popularity.min && itm.popularity <= filters.popularity.max)
            && (itm.inArea === true)
            && (filters.tag.every((value) => {
                return itm.tags.some((v) => v.tag === value);}))) {
                return true;
            } else {
            return false; }
        });

        const nbPages = this.calculPagination(filtered.length, this.state.itemsPerPage);
        const paged = this.paginate(filtered, this.state.itemsPerPage, 1);

        this.setState({ 
            filteredUsers: filtered,
            pagedUsers: paged,
            nbPages: nbPages,
            activePage: 1
        });
    }

    withinArea = async (dist = 5) => {
        if (!this.props.user || !this.props.user.latitude || !this.props.user.longitude || isNaN(parseFloat(this.props.user.latitude)) || isNaN(parseFloat(this.props.user.longitude)))
            return ;

        if (dist === this.state.lastDistanceChecked)
            return ;
        const lat = parseFloat(this.props.user.latitude);
        const lng = parseFloat(this.props.user.longitude);
        const pt = point([lat, lng]);
        const buffered = buffer(pt, parseInt(dist, 10), {units: 'kilometers'});

        /* Copie en profondeur du tableau d'objets */
        const newUsers = JSON.parse(JSON.stringify(this.state.users));

        newUsers.forEach(element => {
            element.inArea = false;
            if (element.latitude && element.longitude) {
                const pts = points([[element.latitude, element.longitude]]);
                const searchWithin = polygon(buffered.geometry.coordinates);
                const ptsWithin = pointsWithinPolygon(pts, searchWithin);

                if (ptsWithin.features.length > 0) {
                    element.inArea = true;
                    // Check distance whith more precision
                    if (element.disance === undefined) {
                        var from = point([lat, lng]);
                        var to = point([element.latitude, element.longitude]);
                        var options = {units: 'kilometers'};

                        element.distance = distance(from, to, options);
                    }
                }
            } else {
                element.inArea = false;
            }
        });

        await this.setState({
                        users: newUsers,
                        lastDistanceChecked: dist
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
        return array.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
    }

    handlePageChange = (e, data) => {
        const paged = this.paginate(this.state.filteredUsers, this.state.itemsPerPage, data.activePage);
        this.setState({
            pagedUsers: paged,
            activePage: data.activePage
        });
    }



    classicView = () => {

        return (
            <Aux>
                <Search tags={ this.state.tags } handleFilter={ this.handleFilter } handleSort={this.handleOrder} />
                <Divider horizontal>Results</Divider> 
                <Listview users={ this.state.pagedUsers } history={this.props.history} mode={this.props.mode} />
                <Pagination fluid className='Pagination__Container'
                    activePage={this.state.activePage}
                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                    totalPages={this.state.nbPages} 
                    onPageChange= {this.handlePageChange}
                />
            </Aux>
        );
    }

    interactiveView = () => {

        return (
            <Aux>
                <Grid stackable>
                    <Grid.Column width={5}>
                        <Search tags={ this.state.tags } handleFilter={ this.handleFilter } handleSort={this.handleOrder} />
                        <Divider horizontal>Results</Divider> 
                        <Listview users={ this.state.pagedUsers } history={this.props.history} mode={this.props.mode} />
                        <Pagination fluid className='Pagination__Container'
                            activePage={this.state.activePage}
                            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                            prevItem={{ content: <Icon name='angle left' />, icon: true }}
                            nextItem={{ content: <Icon name='angle right' />, icon: true }}
                            totalPages={this.state.nbPages} 
                            onPageChange= {this.handlePageChange}
                        />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <MapSearch history={this.props.history} lat={this.props.user.latitude} lng={this.props.user.longitude} users={this.state.pagedUsers} height='800px' />
                    </Grid.Column>
                </Grid>                
            </Aux>
        );
    }



    render() {
        return (
            <Aux>
                {
                    this.state.complete
                ?
                    <Aux>
                        { this.state.loaded === false &&  <Segment basic tertiary loading className='Segment__Loading'></Segment>}
                        { this.props.mode === 'map' && this.state.users && this.interactiveView() }
                        { this.props.mode === 'classic' && this.state.users && this.classicView() }
                    </Aux>
                :
                    <NotAuthorized history={this.props.history} />
                }
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