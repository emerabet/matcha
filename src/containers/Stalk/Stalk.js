import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Segment, Card } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import { point } from '@turf/turf';
import distance from '@turf/distance';
import * as headers from '../../Tools/Header';
import Activity from '../../components/Activity/Activity';
import withSocket from '../../Hoc/Socket/SocketHOC';
import MapSearch from '../../components/MapSearch/MapSearch';
import NotAuthorised from '../../components/NotAuthorised/NotAuthorised';

class Stalk extends Component {

    state = {
        isLiked: false,
        isBlacklist: false,
        isReported: false,
        colorLike: 'grey',
        colorBlacklist: 'grey',
        colorReport: 'grey',
        user: null,
        activeImage: 0,
        src:'',
        userViewed: null,
        isMyProfile: false,
        complete : true
    }

    getUserDetails = async (id) => {
        const query = `
                        query getUser ($extended: Boolean, $user_id2: Int) {
                            getUser(extended: $extended, user_id2: $user_id2){
                                user_id,
                                login,
                                first_name,
                                last_name,
                                email,
                                insertId,
                                share_location,
                                last_visit,
                                latitude,
                                longitude,
                                city,
                                country,
                                zipcode,
                                gender,
                                orientation,
                                bio,
                                birthdate,
                                popularity,
                                isMyProfile,
                                tags {
                                    tag
                                },
                                pictures {picture_id, user_id, src, priority}
                            }
                        }
                    `;
        const user = axios.post('/api', { query, variables: {
            extended: true, 
            user_id2: id
        }}, headers.headers());

        return user;
    }

    getIsLikedReported = async (id) => {
        try {
            const query = `
                            query getStatusLikedReported ($user_id2: Int!) {
                                getStatusLikedReported(user_id2: $user_id2){
                                    liked,
                                    reported,
                                    report
                                }
                            }
                        `;
            const res = axios.post('/api', { query, variables: {
                user_id2:id
            }}, headers.headers());

            return res;
        } catch (err) {
            return err;
        }
    }

    sendVisit = async (id) => {
        const query = `mutation addVisit ($user_id_visited: Int!) {
            addVisit(user_id_visited: $user_id_visited)
        }`;
        const res = axios.post('/api', { query, variables: {
            user_id_visited: id
        }}, headers.headers());

        return res;
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

    async componentDidMount() {
        const complete = await this.checkProfile();
        if (complete) {
            const id = parseInt(this.props.match.params.id, 10);

            // recuperer profil utilisateur
            let res1 = this.getUserDetails(id);

            // marquer le profil comme visité
            let res2 = this.sendVisit(id);

            let res3 = this.getIsLikedReported(id);

            const user = await res1;
            const resVisit = await res2;
            const isLikedReported = await res3;

            if (resVisit.data.data.addVisit === true)
                this.props.socket.emit('visit', id);

            let colorLike = 'grey';
            let colorBlacklist = 'grey';
            let colorReport = 'grey';
            let isLike = false;
            let isReported = false;
            let isReport = false;

            if (isLikedReported.data.data.getStatusLikedReported) {
                isLike = isLikedReported.data.data.getStatusLikedReported.liked == null ? false : true;
                isReported = isLikedReported.data.data.getStatusLikedReported.reported == null ? false : true;
                isReport = isLikedReported.data.data.getStatusLikedReported.report == null ? false : true;
                colorLike =  isLike === true ? 'red' : 'grey';
                colorBlacklist = isReported === true ? 'black' : 'grey';
                colorReport = isReport === true ? 'red' : 'grey';
            }

           if (isNaN(parseFloat(this.props.myuser.latitude)) === false || isNaN(parseFloat(this.props.myuser.longitude)) === false ) {
                const from = point([this.props.myuser.latitude, this.props.myuser.longitude]);
                const to = point([user.data.data.getUser.latitude, user.data.data.getUser.longitude]);
                const options = {units: 'kilometers'};
                user.data.data.getUser.distance = distance(from, to, options);
            }

            this.setState({
                user: user.data.data.getUser,
                nbImage: user.data.data.getUser.pictures.length,
                src: this.getActivePicture(user.data.data.getUser),
                userViewed: id,
                isMyProfile: user.data.data.getUser.isMyProfile,
                isLiked: isLike,
                isBlacklist: isReported,
                isReported: isReport,
                colorLike: colorLike,
                colorBlacklist: colorBlacklist,
                colorReport: colorReport,
                complete: complete
            })
        } else {
            this.setState({complete: complete})
        }
    }

    handleNextPhoto  = async (e, data) => {

        if (!this.state.user || !this.state.user.pictures || this.state.user.pictures.length === 0)
            return ;

        let newIndex = 0;

        if (data.name === 'topleft') {
            newIndex = (this.state.activeImage - 1);
            if (newIndex < 0)
                newIndex = this.state.user.pictures.length - 1;
        } else {
            newIndex = (this.state.activeImage + 1) % this.state.user.pictures.length;
        }

        this.setState({
            activeImage:newIndex,
            src: this.state.user.pictures[newIndex].src
        });
    }

    getActivePicture = (user) => {
        if (!user || !user.pictures || user.pictures.length === 0)
            return '/pictures/smoke_by.png';
        return user.pictures[this.state.activeImage].src;
    }


    handleLike = async (e, data) => {

        const idToLike = this.state.userViewed;

        const query = `mutation likeUser ($user_id_to_like: Int!) {
                            likeUser(user_id_to_like: $user_id_to_like)
                        }`;
        const res = await axios.post('/api', { query, variables: {
            user_id_to_like: idToLike
        }}, headers.headers());

        // 1 = like
        // 2 = unlike
        // 3 = like blocked
        // 4 = unlike blocked
        if (res.data.data.likeUser === 1) {
            this.props.socket.emit('liked', idToLike);
        } else if (res.data.data.likeUser === 2) {
            this.props.socket.emit('unliked', idToLike);
        }

        this.setState({
            isLiked: (res.data.data.likeUser === 1 || res.data.data.likeUser === 3 ? true : false),
            colorLike: (res.data.data.likeUser === 1 || res.data.data.likeUser === 3 ? 'red' : 'grey')
        });
    }

    handleBlacklist = async (e, data) => {

        const idToBlackList = this.state.userViewed;

        const query = `mutation addToBlackList ($user_id_to_black_list: Int!) {
                            addToBlackList(user_id_to_black_list: $user_id_to_black_list)
                        }`;
        const res = await axios.post('/api', { query, variables: {
            user_id_to_black_list: idToBlackList
        }}, headers.headers());

        this.setState({
            isBlacklist: res.data.data.addToBlackList,
            colorBlacklist: res.data.data.addToBlackList === true ? 'black' : 'grey'
        });
    }

    handleReport = async (e, data) => {

        const idToReport = this.state.userViewed;

        const query = `mutation addToReport($user_id_to_report: Int!) {
                            addToReport(user_id_to_report: $user_id_to_report)
                        }`;
        const res = await axios.post('/api', { query, variables: {
            user_id_to_report: idToReport
        }}, headers.headers());

        if (res.data.data.likeUser === true) {
            this.props.socket.emit('liked', idToReport);
        } else if (res.data.data.likeUser === false) {
            this.props.socket.emit('unliked', idToReport);
        }

        this.setState({
            isReported: res.data.data.addToReport,
            colorReport: res.data.data.addToReport === true ? 'red' : 'grey'
        });
    }


    render() {

        let loaded = <Segment basic tertiary loading className='Segment__Loading'></Segment>;
        let tags = [];
        
        if (this.state.user) {

            tags = this.state.user.tags.map((item) => {
                return item.tag;
            });

            loaded = (<Grid stackable divided='vertically'>
                    <Grid.Row columns={2} divided>
                        <Grid.Column>
                            <Button.Group attached='top'>
                                <Button name='topleft' onClick={this.handleNextPhoto} ><Icon name='angle left' /></Button>
                                <Button name='topright' onClick={this.handleNextPhoto} ><Icon name='angle right' /></Button>
                            </Button.Group>
                            <Segment attached>
                                <Image src={this.state.src} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{this.state.user.login} {this.state.user.age}</Card.Header>
                                    <Card.Meta>{this.state.user.country} ({this.state.user.city})</Card.Meta>
                                    <Card.Description>
                                        <h5>Popularity: {this.state.user.popularity}</h5>
                                        <h5>Status: { this.props.socket.connectedUsersMatcha !== undefined && this.props.socket.connectedUsersMatcha.includes(this.state.user.user_id) ? 'Online' : 'Offline'}</h5>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui three buttons'>
                                    <Button basic color={this.state.colorLike} onClick={this.handleLike} animated='vertical'>
                                        <Button.Content hidden>Like</Button.Content>
                                        <Button.Content visible>
                                            <Icon name='like' />
                                        </Button.Content>
                                    </Button>
                                    <Button basic color={this.state.colorBlacklist} onClick={this.handleBlacklist} animated='vertical'>
                                        <Button.Content hidden>Black list</Button.Content>
                                        <Button.Content visible>
                                            <Icon name='lock' />
                                        </Button.Content>
                                    </Button>
                                    <Button basic color={this.state.colorReport} onClick={this.handleReport} animated='vertical'>
                                        <Button.Content hidden>Report as fake</Button.Content>
                                        <Button.Content visible>
                                            <Icon name='close' />
                                        </Button.Content>
                                    </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Card fluid>
                                <MapSearch lat={this.state.user.latitude} lng={this.state.user.longitude} height='250px' users={[this.state.user]}></MapSearch>
                            </Card>
                            { this.state.isMyProfile &&  <Card fluid>
                                                            <Card.Content>
                                                                <Card.Header>Recent Activity</Card.Header>
                                                            </Card.Content>
                                                            <Card.Content>
                                                                <Activity size='small'></Activity>
                                                            </Card.Content>
                                                        </Card> }
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <h2>BIO</h2>
                            <p>{this.state.user.bio}</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <h2>TAGS</h2>
                            <p>{ tags.join(', ')}</p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>);
        }

        return (
            <div>
                { 
                    this.state.complete
                ? 
                    loaded
                :
                    <NotAuthorised history={this.props.history} />
                }
            </div>
           
        );




    }


}
const mapStateToProps = state => {
    return {
        myuser: state.login.user
    }
}

export default withSocket(connect(mapStateToProps, null)(Stalk));