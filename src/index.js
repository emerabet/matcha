import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import loginReducer from './containers/Login/Reducer';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';


const rootReducer = combineReducers({
    login: loginReducer
})

const store = createStore(rootReducer);

ReactDOM.render(
<Provider store={store}>
    <BrowserRouter>
        <App className="App"/>
    </BrowserRouter>
</Provider>

, document.getElementById('root'));
registerServiceWorker();
