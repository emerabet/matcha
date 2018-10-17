import React from 'react';
import * as actions from './Actions';
import { connect } from 'react-redux';
import { Component } from 'react';
import classes from './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import withSocket from '../../Hoc/Socket/SocketHOC';

class  Login extends Component {
   
    state = {
        userName: '',
        password: ''
    }

    handleLogin = async (e) => {
        e.preventDefault();
        console.log('in handle login');
        await this.props.onLogin(this.state.userName, this.state.password, this.props.socket);
       
        this.props.history.push('/home');
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render (){
        return (
                <div className={classes.Container}>
                    <form className={classes.Login} onSubmit={this.handleLogin}>
                        <label htmlFor="userName">Username</label>
                        <input type="text" onChange={this.handleChange} name="userName" value={ this.state.userName } placeholder="User name"></input>
                        <label htmlFor="password">Password</label>
                        <input type="password" onChange={this.handleChange} name="password" value={ this.state.password } placeholder="Password"></input>
                        <button type="submit">Login</button>
                    </form>
                    <Link to="/register"> Register </Link>
                </div>
                /*<Form onSubmit={this.handleLogin}>
                    <Input icon="user" iconPosition="left" onChange={this.handleChange} name="userName" value={ this.state.userName } placeholder="User name" />
                    <Input icon="lock" iconPosition="left" onChange={this.handleChange} name="password" placeholder="Password" />
                    <Button primary> Login </Button>
                </Form>*/
        );
    }
}

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (userName, password, socket) => dispatch(actions.login(userName, password, socket))
    }
}

export default withSocket(connect(mapStateToProps, mapDispatchToProps)(Login));