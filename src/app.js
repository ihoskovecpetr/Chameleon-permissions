import React from 'react';
import ReactDOM from 'react-dom';
import {getAuthenticatedUser} from './lib/authenticatedUser';
import AppLayout from './components/AppLayout';
import {version as APP_VERSION } from '../package.json';

//import '@fortawesome/fontawesome-free-solid'
//import '@fortawesome/fontawesome-free-regular'
import './app.scss';
//fontAwesome.library.add(faCoffee, faUser);

const apiHost = process.env['API_HOST'] ? process.env['API_HOST'] : '';

getAuthenticatedUser(apiHost)
    .then(user => {
        console.log(user);
        ReactDOM.render(<AppLayout
            apiHost = {apiHost}
            user = {user}
            version = {APP_VERSION}
        />, document.getElementById('app'));
    })
    .catch(console.log);

if (module.hot) {
    console.log('Accepting Hot Module');
    module.hot.accept();
}
