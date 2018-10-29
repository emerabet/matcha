import React, { Component } from 'react';
import axios from 'axios';

class Verif extends Component {

    async componentDidMount() {
        const registration_token = this.props.match.params.registration_token;
        const query = `
            mutation confirmAccount($registration_token: String!) {
                confirmAccount(registration_token: $registration_token)
            }
            `;
        const result = await axios.post(`/api`, {   query: query,
            variables: { registration_token: registration_token }
        });
        const status = result.data.data.confirmAccount === true ? "validated" : "nok";
        this.props.history.push({
            pathname: '/login',
            //  search: '?query=abc',
            state: { validated: status }
            })
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Verif;