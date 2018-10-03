import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import loginReducer from './containers/Login/Reducer';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import thunk from 'redux-thunk';
import 'semantic-ui-css/semantic.min.css';

axios.defaults.baseURL = 'http://10.18.201.85:4000';

const rootReducer = combineReducers({
    login: loginReducer,
});

/*const initialState = {
    login: "ok"
}*/

const middleware = applyMiddleware(thunk);

const store = createStore(
    rootReducer,
 //   initialState,
    middleware
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App className="App"/>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);

registerServiceWorker();