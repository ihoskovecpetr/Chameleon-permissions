import React from 'react';
import ReactDOM from 'react-dom';
import {getAuthenticatedUser} from './lib/authenticatedUser';
import DataProvider from './components/DataProvider';

//import '@fortawesome/fontawesome-free-solid'
//import '@fortawesome/fontawesome-free-regular'
import './app.scss';
//fontAwesome.library.add(faCoffee, faUser);

getAuthenticatedUser()
    .then(user => {
        console.log(user);
        ReactDOM.render(<DataProvider
            user = {user}
        />, document.getElementById('app'));
    })
    .catch(console.log);

if (module.hot) {
    console.log('Accepting Hot Module');
    module.hot.accept();
}
