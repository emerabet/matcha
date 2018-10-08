import React, { Component } from 'react'
import { Card, Icon, Button } from 'semantic-ui-react'

const description = [
  'Amy is a violinist with 2 years experience in the wedding industry.',
  'She enjoys the outdoors and currently resides in upstate New York.',
].join(' ')

const open_style = {
    position: "absolute",
    bottom: "0",
    right: "5%"
}

const closed_style = {
    display: "none"
}

const no_button = {
    display: "none"
}

const display_button = {
    position: "absolute",
    bottom: "0",
    right: "5%"
}

class ChatBottom extends Component {

    state = {
        open: false
    }

    handleClickOpenClose = (e) => {
        this.setState({open: !this.state.open});
    }

    render () {
        return (
            <div>
                <Card attached style={open_style}>
        <Card.Content onClick={this.handleClickOpenClose} header={<div>User Name <Icon onClick={this.handleClickOpenClose} style={{position: "absolute", right: "5px"}} name="window close"/></div>} />
                    <Card.Content style={this.state.open ? null : closed_style} description={description} />
                    <Card.Content extra style={this.state.open ? null : closed_style}>
                    <Icon name='user' style={this.state.open ? null : closed_style} />
                    4 Friends
                    </Card.Content>
                   
                </Card>
            </div>
)
    }}

export default ChatBottom