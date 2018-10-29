import React from 'react';
import './Message.css';
import { Image } from 'semantic-ui-react';

const Message = ({msg, type, date, from, pos}) => {
    return (
        <div>
                <div className={pos === "main" ? type : `${type}_s`}>
                    { type === "message-from-contact" 
                    ?
                        (<div className="message-header-container">
                            {pos === "main" &&
                                <div className="message-picture">
                                    <Image  avatar src="/pictures/smoke_by.png"/>
                                </div>
                            }
                            <div className="message-login"> 
                            <h4>{from}</h4>
                            </div>
                        </div>)
                    :
                        (<div className="message-header-container">
                        
                        <div className="message-login-reverse"> 
                        <h4 style={{textAlign:"right"}}>{from}</h4>
                        </div>
                        {pos === "main" &&
                            <div className="message-picture-reverse">
                                <Image  avatar src="/pictures/smoke_by.png"/>
                            </div>
                        }
                        </div>)
                    }
                    <p>{msg}</p>
                    <p className="message-time">{`${new Date(date / 1).getHours()}:${new Date(date / 1).getMinutes()}:${new Date(date / 1).getSeconds()}`}</p>
                </div>
        
            </div>
        
    )
}

export default Message;