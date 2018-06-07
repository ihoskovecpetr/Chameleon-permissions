import React from 'react';
import ReactDOM from 'react-dom';
import * as logger from 'loglevel';

import {getAuthenticatedUser} from './lib/authenticatedUser';
import DataProvider from './components/DataProvider';

logger.setLevel('debug');

//import '@fortawesome/fontawesome-free-solid'
//import '@fortawesome/fontawesome-free-regular'
import './app.scss';
//fontAwesome.library.add(faCoffee, faUser);

getAuthenticatedUser()
    .then(user => {
        logger.info(user);
        ReactDOM.render(<DataProvider
            user = {user}
        />, document.getElementById('app'));
    })
    .catch(logger.warn);

if (module.hot) {
    logger.debug('Accepting Hot Module');
    module.hot.accept();
}
