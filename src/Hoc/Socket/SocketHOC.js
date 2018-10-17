import React from 'react';
import { SocketContext } from './SocketProvider';

const withSocket = (Component) => {
    return (props) => {
        return (
          <SocketContext.Consumer>
            {socket => <Component {...props} socket={socket}/>}
          </SocketContext.Consumer>
        );
      }
}

export default withSocket;