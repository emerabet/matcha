import React from 'react';
import { Table } from 'semantic-ui-react';

const ReportedUser = ({reported}) => {
    return (
        <Table.Row>
            <Table.Cell> { reported.user_id_reported } </Table.Cell>
            <Table.Cell> { reported.user_reported_login } </Table.Cell>
            <Table.Cell> { reported.user_reported_email } </Table.Cell>
            <Table.Cell> { reported.user_id_reporter } </Table.Cell>
            <Table.Cell> { reported.user_reporter_login } </Table.Cell>
            <Table.Cell> { reported.user_reporter_email } </Table.Cell>
            <Table.Cell> { reported.date } </Table.Cell>
      </Table.Row>
    )
}

export default ReportedUser;