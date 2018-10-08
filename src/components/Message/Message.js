import React from 'react';
import './Message.css';

const Message = ({msg, type, date, from}) => {
    return (
        <div className={type}>
            <h4>{from}</h4>
            <p>{msg}</p>
            <p className="message-time">{`${new Date(date / 1).getHours()}:${new Date(date / 1).getMinutes()}:${new Date(date / 1).getSeconds()}`}</p>
        </div>
        
    )
}

export default Message;