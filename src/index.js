import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import loginReducer from './containers/Login/Reducer';
import notificationReducer from './components/Activity/Reducer';
import chatReducer from './containers/SuperChat/Reducer';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import thunk from 'redux-thunk';
import 'semantic-ui-css/semantic.min.css';
import Reload from './Hoc/Reload';
import SocketProvider from './Hoc/Socket/SocketProvider';

axios.defaults.baseURL = '/';
//axios.defaults.baseURL = 'https://localhost:4000';
axios.defaults.withCredentials = true;
axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    // Do something with response error
    if (error.response.status === 403)
        localStorage.clear();
    //return Promise.reject(error);
  });
const rootReducer = combineReducers({
    login: loginReducer,
    notifications: notificationReducer,
    chat: chatReducer,
});

const middleware = applyMiddleware(thunk);

const store = createStore(
    rootReducer,
    middleware
);

ReactDOM.render(
    <Provider store={store}>
        <SocketProvider>
            <Reload>
                <BrowserRouter>
                    <App className="App"/>
                </BrowserRouter>
            </Reload>
        </SocketProvider>
    </Provider>
    , document.getElementById('root')
);

//registerServiceWorker();