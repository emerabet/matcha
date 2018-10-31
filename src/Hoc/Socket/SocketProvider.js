import React, { Component, createContext } from 'react';
import socketIOClient from 'socket.io-client';

export const SocketContext = createContext({
  socket: ""
}) 

class SocketProvider extends Component {
    state = {
      socket: socketIOClient('/')
      //socket: socketIOClient('https://localhost:4000')
    };
  
    render() {
      return (
        <SocketContext.Provider value={this.state.socket}>
          {this.props.children}
        </SocketContext.Provider>
      );
    }
  }
  
  export default SocketProvider;