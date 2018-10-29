import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class NotAuthorized extends Component {
    
    goToProfile = () => {
        this.props.history.push("/profile");
    }
    
    render() {
        return (
            <div className="notAuthorized">
                <p>You are not authorized to look for other member, please complete your full profile first (birthdate, gender, bio and add at least one picture)</p>
                <Button color='pink' onClick={this.goToProfile}> Complete profile </Button>
            </div>
        )
    }
}

export default NotAuthorized;