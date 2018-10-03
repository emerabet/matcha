import React, { Component } from 'react';
import { Grid, Image, Button, Icon } from 'semantic-ui-react';
import axios from 'axios';


class Stalk extends Component {

    state = {
        isLiked: false,
        user: null
    }

    async componentDidMount() {

        // recuperer token
        const token = sessionStorage.getItem("token");
        console.log(token);

        // recuperer profil utilisateur
        const query = `
                        query getUser ($token: String!, $extended: Boolean, $user_id2: Int) {
                            getUser(token: $token, extended: $extended, user_id2: $user_id2){
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
                                tags {
                                    tag
                                },
                                pictures {picture_id, user_id, src, priority}
                            }
                        }
                    `;
        const user = await axios.post('/api', { query, variables: {
            token: token,
            extended: true, 
            user_id2: 82
        }});

        this.setState({
            user: user.data.data.getUser
        })

        console.log(this.state);


        // Vérifier si il s'agit d'une visite ou de son profil

        // Si c'est une visite
                // * verifier si y'a deja un match
                // * marquer le profil comme visité
                // * envoyer une socket de notification
        
        // Sinon charger le module de notifications

    }

    render() {

        let loaded = null;
        
        if (this.state.user) {
            loaded = (<Grid stackable divided='vertically'>
                    <Grid.Row columns={2} divided>
                    <Grid.Column>
                        <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Grid.Column>
                    <Grid.Column>
                        <h5>Username: {this.state.user.login} ({this.state.user.age}))</h5>
                        <h5>Localisation: France (Paris)</h5>
                        <h5>Popularity: 80</h5>
                        <h5>Status: Online</h5>
                        <Button animated='vertical'>
                            <Button.Content hidden>Like</Button.Content>
                            <Button.Content visible>
                                <Icon name='like' />
                            </Button.Content>
                        </Button>

                        <Button animated='vertical'>
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
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, aliquam? Temporibus veritatis cupiditate, ipsum velit praesentium libero rem repellat natus tempora sint quaerat tenetur alias id architecto. Molestias, saepe sed.</p>
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
export default Stalk;