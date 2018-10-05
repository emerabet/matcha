import React, { Component } from 'react';
import { Grid, Image, Button, Icon, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as headers from '../../Tools/Header';


class Stalk extends Component {

    state = {
        isLiked: false,
        isBlacklist: false,
        colorLike: 'grey',
        colorBlacklist: 'grey',
        user: null,
        activeImage: 0,
        src:'',
        userViewed: null,
    }

    async componentDidMount() {

        const id = parseInt(this.props.match.params.id);

        // recuperer profil utilisateur
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
        const user = await axios.post('/api', { query, variables: {
            extended: true, 
            user_id2: id
        }}, headers.headers());

        console.log("icisdof");
        console.log(user);

        this.setState({
            user: user.data.data.getUser,
            nbImage: user.data.data.getUser.pictures.length,
            src: this.getActivePicture(user.data.data.getUser),
            userViewed: id
        })

        console.log(this.state);

        // * verifier si y'a deja un match

        // * marquer le profil comme visité
        this.sendVisit(id);
        
        // * envoyer une socket de notification
        
        // Sinon charger le module de notifications ???

    }


    sendVisit = async (id) => {
        const query = `mutation addVisit ($user_id_visited: Int!) {
            addVisit(user_id_visited: $user_id_visited)
        }`;
        const res = await axios.post('/api', { query, variables: {
            user_id_visited: id
        }}, headers.headers());

        console.log("VISITED: ", res.data.data.addVisit);
    }


    handleNextPhoto  = async (e, data) => {

        if (!this.state.user || !this.state.user.pictures || this.state.user.pictures.length === 0)
            return ;

        let newIndex = 0;

        if (data.name == 'topleft') {
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
        console.log("kkkijiij");
        console.log(user);
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

        this.setState({
            isLiked: res.data.data.likeUser,
            colorLike: res.data.data.likeUser === true ? 'red' : 'grey'
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


    render() {

        let loaded = null;
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
                        <Button.Group attached='bottom'>
                            <Button><Icon name='angle left' /></Button>
                            <Button><Icon name='angle right' /></Button>
                            <Button><Icon name='angle left' /></Button>
                            <Button><Icon name='angle right' /></Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column>
                        <h5>Username: {this.state.user.login} ({this.state.user.age}))</h5>
                        <h5>Localisation: {this.state.user.country} ({this.state.user.city})</h5>
                        <h5>Popularity: {this.state.user.popularity}</h5>
                        <h5>Status: Online</h5>
                        <Button color={this.state.colorLike} onClick={this.handleLike} animated='vertical'>
                            <Button.Content hidden>Like</Button.Content>
                            <Button.Content visible>
                                <Icon name='like' />
                            </Button.Content>
                        </Button>

                        <Button color={this.state.colorBlacklist} onClick={this.handleBlacklist} animated='vertical'>
                            <Button.Content hidden>Black list</Button.Content>
                            <Button.Content visible>
                                <Icon name='lock' />
                            </Button.Content>
                        </Button>
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
            { loaded }
            </div>
        );




    }


}
const mapStateToProps = state => {
    console.log("map");
    console.log(state);
    return {
        myuser: state.login.user
    }
}

export default connect(mapStateToProps, null)(Stalk);