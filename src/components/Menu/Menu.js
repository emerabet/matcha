import React from 'react';
import './Menu.css';

const Menu = () => {
    return (
        <div className='Menu'>
          <ul>
            <li><a href="default.asp">Home</a></li>
            <li><a href="news.asp">My profile</a></li>
            <li><a href="contact.asp">Notifications</a></li>
            <li><a href="about.asp">Chat</a></li>
          </ul>
          <h1> Menu </h1>
      </div>
    )
}

export default Menu;