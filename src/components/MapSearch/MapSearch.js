import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Aux from './../../Hoc/Aux/Aux';


class MapSearch extends Component {

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
                                    <Marker key={u.user_id} position={[u.latitude, u.longitude]}></Marker>
                                );
                            }
                        }) }
                    </Map>
        )

    }

}

export default MapSearch;