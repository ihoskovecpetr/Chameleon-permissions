import React from 'react';
import ReactDOM from 'react-dom';
import * as logger from 'loglevel';

import {getAuthenticatedUser} from './lib/authenticatedUser';
import DataProvider from './components/DataProvider';

logger.setLevel('debug');


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);

import './app.scss';

getAuthenticatedUser()
    .then(user => {
        logger.info(user);
        ReactDOM.render(<DataProvider
            user = {user}
        />, document.getElementById('app'));
    })
    .catch(logger.warn); //TODO

if (module.hot) {
    logger.debug('Accepting Hot Module');
    module.hot.accept();
}
