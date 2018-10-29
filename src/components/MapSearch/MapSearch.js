import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Card, Image, Button } from 'semantic-ui-react'

class MapSearch extends Component {


    handleClick = (e) => {

        this.props.history.push(`/stalk/${e}`);
    }

    render() {

        const zoom = 10;
        const position = [this.props.lat, this.props.lng];
        const users = this.props.users;

        return (
                    <Map style={{height:this.props.height}}center={position} zoom={zoom}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        { users.map(u => {
                            if (u.latitude && u.longitude && (u.longitude > -180 && u.longitude < 180) && (u.latitude > -90 && u.latitude  < 90)) {
                                return (
                                    <Marker key={u.user_id} position={[u.latitude, u.longitude]}>
                                    
                                    <Tooltip>
                                        {u.login}<br />
                                        {u.popularity} pts | {parseInt(u.distance, 10)} km from you
                                    </Tooltip>
                                    <Popup>
                                        <Card>
                                            <Image src={u.src} />
                                            <Card.Content>
                                                <Card.Header>{u.login}</Card.Header>
                                                <Card.Description>{u.bio}</Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    {u.popularity} pts | {parseInt(u.distance, 10)} km from you
                                            </Card.Content>
                                            <Card.Content extra>
                                                    <Button onClick={() => this.handleClick(u.user_id)} fluid basic color='pink'>
                                                        View
                                                    </Button>
                                            </Card.Content>
                                        </Card>
                                    </Popup>
                                    
                                    </Marker>
                                );
                            } else
                                return false;
                        }) }
                    </Map>
        )

    }

}

export default MapSearch;