import React from 'react';
import { Component } from 'react';
import { Table } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as headers from '../../Tools/Header';
import ReportedUser from '../../components/ReportedUser/ReportedUser';

class  Admin extends Component {

    state = {
        reported_users: [],
        admin: false
    }

    async componentDidMount() {
        const query = `
                        query getReported {
                            getReported{
                                    user_id_reported,
                                    user_reported_login,
                                    user_reported_email,
                                    user_id_reporter,
                                    user_reporter_login,
                                    user_reporter_email,
                                    date
                            }
                        }
                    `;        
        
        const response = await axios.post(`/api`,
            {
                query: query,
                variables: {
                    extended: true
                }
            }, headers.headers());
            if (response.data.data.getReported)
                this.setState({reported_users: response.data.data.getReported, admin: true});
            else {
                toast("You are not authorised to see this page", {type: toast.TYPE.ERROR});
                this.props.history.push("/home");
            }
    }

    render (){
        return (<div>
           {this.state.admin
            ?
            <div>
                <h2> Reported users </h2>
                <Table celled>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>Reported user</Table.HeaderCell>
                        <Table.HeaderCell colSpan='3'>User reporting</Table.HeaderCell>
                        <Table.HeaderCell rowSpan='2'>Date</Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>User id</Table.HeaderCell>
                        <Table.HeaderCell>Login</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>User id</Table.HeaderCell>
                        <Table.HeaderCell>Login</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {
                            this.state.reported_users.map(reported => {
                                return <ReportedUser key={`${reported.user_id_reported}-${reported.user_id_reporter}`} reported={reported} />
                            })
                        }
                    </Table.Body>
                </Table>
            </div>
        :   
        <div> unauthosrised user </div>
        }
        </div>
        );
    }
}

export default Admin;