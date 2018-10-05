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
import Reload from './Hoc/Reload';

axios.defaults.baseURL = 'http://10.18.201.85:4000';
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log("AXIOS OK");
    console.log(response);

   // if (response.data.errors) {
   //     sessionStorage.clear();
       // window.location.assign("http://10.18.201.85:3000/login");
  //  }

    return response;
  }, function (error) {
    console.log("AXIOS ERROR");
    // Do something with response error
    sessionStorage.clear();
    //return Promise.reject(error);
  });
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
        <Reload>
            <BrowserRouter>
                <App className="App"/>
            </BrowserRouter>
        </Reload>
    </Provider>
    , document.getElementById('root')
);

registerServiceWorker();