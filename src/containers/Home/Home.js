import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import TopMenu from '../../components/Menu/TopMenu';
import classes from './Home.css';
import './Home.css';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';


class Home extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

   render() {
    const { activeItem } = this.state

    return (
      <BottomNavigation
            value={5}
            onChange={null}
            showLabels
            className={classes.root}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    )
  }

}

const mapStateToProps = state => {
    return {
        token: state.login.token
    }
};

const mapDispatchToProps = null

export default connect(mapStateToProps, mapDispatchToProps)(Home);